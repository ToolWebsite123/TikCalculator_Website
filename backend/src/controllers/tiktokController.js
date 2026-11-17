// Use services scraper which has better API support
const { scrapeTikTokProfile: scrapeTikTokProfileService, TikTokScraperError, deriveAnalytics, fetchVideosFromTikWM } = require('../services/tiktokScraper');
// Fallback to scraper if services fails
let scrapeTikTokProfileFallback;
try {
  const scraperModule = require('../scraper/tiktokScraper');
  scrapeTikTokProfileFallback = scraperModule.scrapeTikTokProfile;
} catch (err) {
  console.warn('[Controller] Fallback scraper not available');
}

// Use services scraper as primary
const scrapeTikTokProfile = scrapeTikTokProfileService;
const { calculateEarnings, calculateCPMRange } = require('../utils/calcEarnings');
const { isMongoAvailable } = require('../utils/db');

// Try to require ProfileCache, but handle gracefully if MongoDB is not available
let ProfileCache = null;
try {
  ProfileCache = require('../models/ProfileCache');
} catch (err) {
  console.warn('⚠️  ProfileCache model not available - caching disabled');
}

const CACHE_MAX_AGE_MS = 1 * 60 * 60 * 1000; // 1 hour

const activeRequests = new Map();

const getOrCreateRequest = (username, requestFn) => {
  const cleanUsername = username.trim().toLowerCase().replace('@', '');
  if (activeRequests.has(cleanUsername)) {
    console.log(`[Controller] Request for @${cleanUsername} already in progress, sharing result...`);
    return activeRequests.get(cleanUsername);
  }
  const requestPromise = requestFn()
    .then((result) => { activeRequests.delete(cleanUsername); return result; })
    .catch((error) => { activeRequests.delete(cleanUsername); throw error; });
  activeRequests.set(cleanUsername, requestPromise);
  return requestPromise;
};

// ── Helper: extract joinedAt from TikTok ID ──
const joinedAtFromTikTokId = (tiktokId) => {
  if (!tiktokId) return null;
  try {
    const ts = Number(BigInt(tiktokId) >> 32n);
    if (ts > 1451606400 && ts < 9999999999) {
      const result = new Date(ts * 1000).toISOString();
      console.log(`[Controller] ✓ joinedAt from TikTok ID ${tiktokId}: ${result}`);
      return result;
    }
  } catch (e) {
    console.warn('[Controller] Could not extract joinedAt from TikTok ID:', e.message);
  }
  return null;
};

function calculateEarningsData(avgViews, engagementRate = 5, followers = 0, region = '') {
  const cpmRange = calculateCPMRange({ region, engagementRate, followers });
  const safeAvgViews = Math.max(Number(avgViews) || 0, 0);
  const safeEngagementRate = Math.max(Number(engagementRate) || 5, 0);
  const earningPerVideo = Number(((safeAvgViews / 1000) * cpmRange.used).toFixed(2));
  const earningsMin = Number(((safeAvgViews / 1000) * cpmRange.min).toFixed(2));
  const earningsMax = Number(((safeAvgViews / 1000) * cpmRange.max).toFixed(2));

  console.log('[calculateEarningsData] ========================================');
  console.log('[calculateEarningsData] INPUT:', { avgViews: safeAvgViews, cpm: cpmRange.used, cpmRange, engagementRate: safeEngagementRate, followers, region });
  console.log('[calculateEarningsData] Formula: (avgViews / 1000) * CPM');
  console.log('[calculateEarningsData] STEP 1: (avgViews / 1000) =', safeAvgViews / 1000);
  console.log('[calculateEarningsData] STEP 2: earnings (avg) =', earningPerVideo);
  console.log('[calculateEarningsData] RANGE:', { earningsMin, earningsMax });
  console.log('[calculateEarningsData] FINAL RESULT:', { estimatedEarnings: earningPerVideo, earningPerVideo });
  console.log('[calculateEarningsData] ========================================');

  return {
    avgViews: safeAvgViews,
    engagementRate: safeEngagementRate,
    cpm: cpmRange.used,
    cpmMin: cpmRange.min,
    cpmMax: cpmRange.max,
    platformFactor: 1.0,
    estimatedEarnings: earningPerVideo,
    earningPerVideo,
    earningsMin,
    earningsMax,
  };
}

function buildSafeEarnings({ avgViews, engagementRate = 5, followers = 0, region = '' }) {
  const data = calculateEarningsData(avgViews, engagementRate, followers, region);
  return {
    earnings: data.earningPerVideo,
    earningPerVideo: data.earningPerVideo,
    estimatedEarnings: data.earningPerVideo,
    earningsMin: data.earningsMin,
    earningsMax: data.earningsMax,
    perVideoNet: data.earningPerVideo,
    perVideo: data.earningPerVideo,
    monthly: data.earningPerVideo * 20,
    monthlyEarning: data.earningPerVideo * 20,
    yearly: data.earningPerVideo * 240,
    cpm: data.cpm,
    cpmMin: data.cpmMin,
    cpmMax: data.cpmMax,
    platformFactor: data.platformFactor,
    avgViews: data.avgViews,
    engagementRate: data.engagementRate,
  };
}

const buildResponse = (profile, analytics, earnings, latestVideos = []) => {
  if (!profile || typeof profile !== 'object') {
    console.error('[Controller] CRITICAL: Invalid profile in buildResponse!', profile);
    profile = {};
  }

  let username = '';
  try {
    username = (profile.username || profile.userName || '').toString().trim();
  } catch (err) {
    username = '';
  }
  if (!username) username = 'unknown';

  const preserveFullUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    return url
      .replace(/\\u002F/g, '/')
      .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\\//g, '/')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .trim();
  };

  const avgViews = Number(analytics?.avgViews) || 0;
  const engagementRate = Number(analytics?.engagementRate) || 5;
  const followerCount = Number(profile?.followers) || 0;
  const region = profile?.region || profile?.country || '';
  const earningsData = calculateEarningsData(avgViews, engagementRate, followerCount, region);

  let rawDescription = (profile.bio || profile.description || profile.signature || '').toString().trim();
  if (rawDescription) {
    rawDescription = rawDescription
      .replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/^Signature\s*\(Required\)\s*:\s*/i, '').trim();
  }
  const extractedDescription = rawDescription || '';

  // ── Resolve joinedAt: profile field OR TikTok ID fallback ──
  const resolvedJoinedAt =
    profile.joinedAt ||
    profile.joined_at ||
    joinedAtFromTikTokId(profile.tiktokId || profile.tiktok_id || profile.id || profile.uid) ||
    null;

  if (resolvedJoinedAt) {
    console.log(`[Controller] ✓ joinedAt resolved in buildResponse: ${resolvedJoinedAt}`);
  } else {
    console.warn(`[Controller] ⚠ joinedAt is null for ${username} (tiktokId: ${profile.tiktokId || 'N/A'})`);
  }

  const response = {
    success: true,
    username,
    description: extractedDescription || '',
    bio: extractedDescription || '',
    profile: {
      username,
      fullName: (profile.fullName || profile.full_name || profile.nickname || username || '').toString().trim(),
      bio: extractedDescription || '',
      description: extractedDescription || '',
      followers: Number(profile.followers) || 0,
      following: Number(profile.following) || 0,
      likes: Number(profile.likes) || 0,
      videos: Number(profile.videos) || 0,
      verified: Boolean(profile.verified),
      profilePic: preserveFullUrl(
        profile.profilePic || profile.profilePicture || profile.profilePictureUrl ||
        profile.avatar || profile.avatarLarger || ''
      ),
      profilePicThumb: preserveFullUrl(
        profile.profilePicThumb || profile.profilePic || profile.avatarThumb || profile.avatarMedium || ''
      ),
      region: (profile.region || profile.country || '').toString(),
      tiktokId: (profile.tiktokId || profile.tiktok_id || profile.id || profile.uid || '').toString(),
      category: (profile.category || '').toString(),
      joinedAt: resolvedJoinedAt,   // ← always filled if tiktokId exists
      secUid: (profile.secUid || profile.sec_uid || '').toString(),
    },
    analytics: analytics || { avgViews: 0, engagementRate: 0, sampleSize: 0 },
    earnings: earnings || {
      earnings: 0, earningPerVideo: 0, estimatedEarnings: 0, perVideoNet: 0,
      perVideo: 0, monthly: 0, monthlyEarning: 0, yearly: 0,
      cpm: 0, cpmMin: 0, cpmMax: 0, earningsMin: 0, earningsMax: 0, platformFactor: 1.0,
    },
    earningsData,
    avgViews: earningsData.avgViews,
    engagementRate: earningsData.engagementRate,
    cpm: earningsData.cpm,
    cpmMin: earningsData.cpmMin,
    cpmMax: earningsData.cpmMax,
    platformFactor: earningsData.platformFactor,
    estimatedEarnings: earningsData.estimatedEarnings,
    earningPerVideo: earningsData.earningPerVideo,
    perVideoNet: earningsData.earningPerVideo,
    earningsMin: earningsData.earningsMin,
    earningsMax: earningsData.earningsMax,
    latestVideos: Array.isArray(latestVideos) ? latestVideos : [],
    cachedAt: new Date().toISOString(),
  };

  if (!response.profile.username || response.profile.username.trim() === '') {
    response.profile.username = username || 'unknown';
  }

  return response;
};

const getTikTokProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const forceRefresh = req.query.refresh === 'true';

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }

    const cleanUsername = username.trim().toLowerCase().replace('@', '');

    if (!forceRefresh && ProfileCache && isMongoAvailable()) {
      try {
        const cached = await ProfileCache.findOne({ username: cleanUsername });
        if (cached) {
          const age = Date.now() - cached.fetchedAt.getTime();
          const hasValidProfile = cached.profile?.followers > 0;
          const hasValidAnalytics = cached.analytics?.avgViews > 0 && cached.analytics?.sampleSize > 0;
          const hasValidEarnings = cached.earnings?.perVideo > 0;
          const hasVideos = cached.latestVideos && Array.isArray(cached.latestVideos) && cached.latestVideos.length > 0;
          const hasVideosWithViews = hasVideos && cached.latestVideos.some(v => v && Number(v.views) > 0);

          if (age < CACHE_MAX_AGE_MS && hasValidProfile && hasValidAnalytics && hasValidEarnings && hasVideosWithViews) {
            console.log(`[Controller] ✓ Returning cached data for @${cleanUsername}`);
            const cachedProfile = {
              ...cached.profile,
              bio: cached.bio || cached.profile?.bio || cached.profile?.description || '',
              description: cached.bio || cached.profile?.bio || cached.profile?.description || '',
              // ── Re-apply joinedAt fallback for old cached entries ──
              joinedAt: cached.profile?.joinedAt || joinedAtFromTikTokId(cached.profile?.tiktokId) || null,
            };
            return res.json(buildResponse(cachedProfile, cached.analytics, cached.earnings, cached.latestVideos || []));
          } else {
            console.log(`[Controller] Cache invalid for @${cleanUsername} - forcing re-scrape`);
          }
        }
      } catch (cacheErr) {
        console.warn('[Controller] Cache read error:', cacheErr.message);
      }
    }

    console.log(`[Controller] Fetching fresh data for @${cleanUsername}`);

    let scrapedData;
    try {
      scrapedData = await getOrCreateRequest(cleanUsername, async () => {
        return await scrapeTikTokProfile(cleanUsername);
      });
    } catch (scrapeErr) {
      if (scrapeErr instanceof TikTokScraperError) {
        const errorResponses = {
          'NOT_FOUND': { status: 404, message: `User '@${cleanUsername}' not found on TikTok` },
          'BAD_REQUEST': { status: 400, message: 'Invalid username format' },
          'CAPTCHA_REQUIRED': { status: 429, message: 'TikTok verification required. Please try again.', retry: true },
          'RATE_LIMIT': { status: 429, message: 'Too many requests. Please try again later.', retry: true },
          'NETWORK_ERROR': { status: 503, message: 'Network error.', retry: true },
          'TIMEOUT': { status: 504, message: 'Request timeout. Please try again.', retry: true },
          'HTTP_ERROR': { status: 502, message: 'TikTok server error. Please try again.', retry: true },
        };
        const errorInfo = errorResponses[scrapeErr.code] || { status: 500, message: 'Failed to fetch TikTok profile', retry: true };
        return res.status(errorInfo.status).json({ success: false, error: errorInfo.message, code: scrapeErr.code, retry: errorInfo.retry || false });
      }
      console.error('[Controller] Scrape error:', scrapeErr.message);
      return res.status(500).json({ success: false, error: 'Failed to fetch TikTok profile data', retry: true });
    }

    console.log('[Controller] ========================================');
    console.log('[Controller] ScrapedData structure:', {
      hasProfile: !!scrapedData.profile,
      hasUser: !!scrapedData.user,
      hasDescription: !!scrapedData.description,
      hasBio: !!scrapedData.bio,
      profileKeys: scrapedData.profile ? Object.keys(scrapedData.profile) : [],
      userKeys: scrapedData.user ? Object.keys(scrapedData.user) : [],
      profileBio: scrapedData.profile?.bio,
      profileDescription: scrapedData.profile?.description,
      userBio: scrapedData.user?.bio,
      rootBio: scrapedData.bio,
      rootDescription: scrapedData.description,
    });
    console.log('[Controller] ========================================');

    let profile = scrapedData.profile;

    if (!profile && scrapedData.user) {
      const extractedDescription = (
        scrapedData.user.bio || scrapedData.user.description || scrapedData.description || scrapedData.bio || ''
      ).toString().trim().replace(/^Signature\s*\(Required\)\s*:\s*/i, '').trim();

      profile = {
        username: scrapedData.user.username || cleanUsername,
        fullName: scrapedData.user.nickname || scrapedData.user.username || cleanUsername,
        profilePic: scrapedData.user.avatar || '',
        description: extractedDescription || '',
        bio: extractedDescription || '',
        followers: Number(scrapedData.user.followers) || 0,
        following: Number(scrapedData.user.following) || 0,
        likes: Number(scrapedData.user.likes) || 0,
        videos: Number(scrapedData.user.videos) || 0,
        verified: Boolean(scrapedData.user.verified),
        profilePicThumb: scrapedData.user.avatar || '',
        region: scrapedData.user.region || '',
        tiktokId: scrapedData.user.tiktokId || '',
        category: scrapedData.user.category || '',
        joinedAt: scrapedData.user.joinedAt || null,
        secUid: scrapedData.user.secUid || '',
      };
    }

    if (profile) {
      const profileBio = (
        profile.bio || profile.description || profile.signature ||
        scrapedData.profile?.bio || scrapedData.user?.bio ||
        scrapedData.bio || scrapedData.description || ''
      ).toString().trim();

      const cleanBio = profileBio
        .replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'").replace(/^Signature\s*\(Required\)\s*:\s*/i, '').trim();

      profile.bio = cleanBio;
      profile.description = cleanBio;

      if (cleanBio) {
        console.log(`[Controller] ✓ Extracted bio: "${cleanBio.substring(0, 50)}${cleanBio.length > 50 ? '...' : ''}"`);
      }
    }

    let latestVideos = Array.isArray(scrapedData.latestVideos) ? scrapedData.latestVideos : [];

    const videosWithViews = latestVideos.filter(v => v && Number(v.views) > 0);
    if (videosWithViews.length === 0) {
      console.log(`[Controller] No videos with views found, fetching from TikWM API...`);
      let tikwmVideos = [];
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`[Controller] TikWM API attempt ${attempt}/3...`);
          tikwmVideos = await fetchVideosFromTikWM(cleanUsername, 30);
          if (tikwmVideos && Array.isArray(tikwmVideos) && tikwmVideos.length > 0) {
            const vwv = tikwmVideos.filter(v => v && Number(v.views) > 0);
            if (vwv.length > 0) {
              latestVideos = tikwmVideos;
              console.log(`[Controller] ✓ Fetched ${tikwmVideos.length} videos from TikWM API`);
              break;
            }
          }
        } catch (tikwmErr) {
          console.warn(`[Controller] ⚠ TikWM API attempt ${attempt} failed: ${tikwmErr.message}`);
        }
        if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!profile) {
      return res.status(500).json({ success: false, error: 'Invalid data received from TikTok', retry: true });
    }

    if (!profile.username || profile.username.trim() === '') profile.username = cleanUsername;
    profile.username = (profile.username || cleanUsername).toString().trim();
    profile.fullName = profile.fullName || profile.nickname || profile.username || cleanUsername;

    const fixProfilePicUrl = (url) => {
      if (!url || typeof url !== 'string') return '';
      return url.replace(/\\u002F/g, '/').replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16))).replace(/\\\//g, '/').replace(/\\"/g, '"').trim();
    };

    profile.profilePic = fixProfilePicUrl(profile.profilePic || profile.avatar || profile.avatarLarger || profile.avatarMedium || '');
    profile.followers = Number(profile.followers) || 0;
    profile.following = Number(profile.following) || 0;
    profile.likes = Number(profile.likes) || 0;
    profile.videos = Number(profile.videos) || 0;

    const rawBio = (profile.bio || profile.description || profile.signature || scrapedData?.profile?.bio || scrapedData?.user?.bio || '').toString().trim();
    const cleanBio = rawBio.replace(/^Signature\s*\(Required\)\s*:\s*/i, '').trim();
    profile.bio = cleanBio;
    profile.description = cleanBio;

    if (cleanBio) console.log(`[Controller] ✓ Final bio set: "${cleanBio.substring(0, 50)}${cleanBio.length > 50 ? '...' : ''}"`);

    profile.verified = Boolean(profile.verified);
    profile.profilePicThumb = fixProfilePicUrl(profile.profilePicThumb || profile.profilePic || profile.avatarThumb || '');
    profile.region = profile.region || profile.country || '';
    profile.tiktokId = profile.tiktokId || profile.tiktok_id || profile.id || profile.uid || '';
    profile.category = profile.category || '';
    profile.secUid = profile.secUid || profile.sec_uid || '';

    // ── joinedAt: scraper value OR TikTok ID fallback ──
    profile.joinedAt =
      profile.joinedAt ||
      profile.joined_at ||
      joinedAtFromTikTokId(profile.tiktokId) ||
      null;

    console.log(`[Controller] joinedAt final value: ${profile.joinedAt || 'NULL'}`);

    let analytics = null;
    let earnings = null;

    try {
      const vwv = (latestVideos || []).filter(v => v && Number(v.views) > 0);
      console.log(`[Controller] ========================================`);
      console.log(`[Controller] Calculating earnings:`, { followers: profile.followers, likes: profile.likes, videos: profile.videos, videoCount: latestVideos?.length || 0, videosWithViews: vwv.length });

      const calculated = calculateEarnings({
        followers: profile.followers || 0,
        likes: profile.likes || 0,
        videos: profile.videos || 0,
        latestVideos: vwv.length > 0 ? vwv : latestVideos,
        region: profile.region || '',
      });

      if (calculated && calculated.earnings !== undefined) {
        analytics = calculated.analytics;
        earnings = {
          earnings: calculated.earnings,
          earningPerVideo: calculated.earningPerVideo || calculated.earnings,
          estimatedEarnings: calculated.earnings,
          perVideoNet: calculated.earningPerVideo || calculated.earnings,
          perVideo: calculated.earningPerVideo || calculated.earnings,
          monthly: (calculated.earningPerVideo || calculated.earnings) * 20,
          monthlyEarning: (calculated.earningPerVideo || calculated.earnings) * 20,
          yearly: (calculated.earningPerVideo || calculated.earnings) * 240,
          cpm: calculated.cpm,
          cpmMin: calculated.cpmMin,
          cpmMax: calculated.cpmMax,
          earningsMin: calculated.earningsMin,
          earningsMax: calculated.earningsMax,
          platformFactor: calculated.platformFactor,
        };
        console.log(`[CALCULATED]`, { earnings: calculated.earnings, earningPerVideo: calculated.earningPerVideo, avgViews: calculated.avgViews, cpm: calculated.cpm });
      } else {
        const emergencyViews = Math.max((profile.followers || 0) * 0.08, 1000);
        const safeFallback = buildSafeEarnings({ avgViews: emergencyViews, engagementRate: 5.0, followers: profile.followers || 0, region: profile.region || '' });
        analytics = { avgViews: emergencyViews, engagementRate: 5.0, sampleSize: 0 };
        earnings = safeFallback;
      }
    } catch (calcErr) {
      console.error('[Controller] Calculation error:', calcErr.message);
      const emergencyViews = Math.max((profile.followers || 0) * 0.08, 1000);
      const safeFallback = buildSafeEarnings({ avgViews: emergencyViews, engagementRate: 5.0, followers: profile.followers || 0, region: profile.region || '' });
      analytics = { avgViews: emergencyViews, engagementRate: 5.0, sampleSize: 0 };
      earnings = safeFallback;
    }

    const responseData = buildResponse(profile, analytics, earnings, latestVideos || []);

    if (!responseData.profile?.username || responseData.profile.username.trim() === '') {
      responseData.profile = responseData.profile || {};
      responseData.profile.username = cleanUsername;
    }

    if (!responseData.earningsData || typeof responseData.earningsData !== 'object') {
      responseData.earningsData = calculateEarningsData(Number(responseData.avgViews) || 0, 5);
    }

    console.log('[Controller] ✓ Final response includes earningsData:', { hasEarningsData: !!responseData.earningsData, avgViews: responseData.earningsData?.avgViews, estimatedEarnings: responseData.earningsData?.estimatedEarnings });
    console.log("Final Earnings Payload:", responseData.earningsData);

    if (ProfileCache && isMongoAvailable()) {
      try {
        const hasRealVideoData = latestVideos && latestVideos.length > 0 && latestVideos.some(v => v && Number(v.views) > 0);
        const isValidData = responseData.profile?.followers > 0 && analytics?.avgViews > 0 && analytics?.sampleSize > 0 && earnings?.perVideo > 0 && hasRealVideoData;

        if (isValidData) {
          await ProfileCache.findOneAndUpdate(
            { username: responseData.profile.username || cleanUsername },
            { username: responseData.profile.username || cleanUsername, profile: responseData.profile, analytics, earnings, latestVideos: latestVideos || [], bio: responseData.profile.bio || responseData.bio || '', fetchedAt: new Date() },
            { upsert: true, new: true }
          );
          console.log(`[Controller] ✓ Cached valid data for @${cleanUsername}`);
        }
      } catch (cacheErr) {
        console.warn('[Controller] Cache save error:', cacheErr.message);
      }
    }

    return res.json(responseData);

  } catch (err) {
    console.error('[Controller] Unexpected error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error', message: err.message || 'An unexpected error occurred' });
  }
};

const clearCache = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ success: false, error: 'Username is required' });
    if (!ProfileCache || !isMongoAvailable()) return res.status(503).json({ success: false, error: 'Database not available - caching disabled' });
    const cleanUsername = username.trim().toLowerCase().replace('@', '');
    const result = await ProfileCache.deleteMany({ username: cleanUsername });
    return res.json({ success: true, deleted: result.deletedCount, message: `Cache cleared for @${cleanUsername}` });
  } catch (err) {
    console.error('[Controller] Clear cache error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to clear cache' });
  }
};

const clearAllCache = async (req, res) => {
  try {
    if (!ProfileCache || !isMongoAvailable()) return res.status(503).json({ success: false, error: 'Database not available - caching disabled' });
    const result = await ProfileCache.deleteMany({});
    return res.json({ success: true, deleted: result.deletedCount, message: 'All cache cleared' });
  } catch (err) {
    console.error('[Controller] Clear all cache error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to clear cache' });
  }
};

const healthCheck = async (req, res) => {
  try {
    const mongoAvailable = isMongoAvailable();
    const cacheCount = mongoAvailable && ProfileCache ? await ProfileCache.countDocuments() : 0;
    return res.json({ success: true, status: 'healthy', cache: { enabled: mongoAvailable && ProfileCache !== null, count: cacheCount, maxAge: `${CACHE_MAX_AGE_MS / 1000 / 60 / 60} hours` }, database: { connected: mongoAvailable, status: mongoAvailable ? 'connected' : 'disconnected' }, timestamp: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ success: false, status: 'unhealthy', error: err.message });
  }
};

const earningsCache = {};
const EARNINGS_CACHE_TTL = 60 * 1000;

const getTikTokEarnings = async (req, res) => {
  try {
    const { username } = req.params;
    const forceRefresh = req.query.refresh === 'true';
    console.log(`[Earnings] GET /api/tiktok/user/${username}/earnings - refresh: ${forceRefresh}`);

    if (!username || username.trim().length === 0) return res.status(400).json({ success: false, error: 'Username is required' });

    const cleanUsername = username.trim().toLowerCase().replace('@', '');

    if (!forceRefresh && earningsCache[cleanUsername]) {
      const cached = earningsCache[cleanUsername];
      if (Date.now() - cached.timestamp < EARNINGS_CACHE_TTL) {
        const cachedData = cached.data;
        if (cachedData && cachedData.success !== false) {
          if (!cachedData.estimatedEarnings && cachedData.earnings) cachedData.estimatedEarnings = cachedData.earnings;
          return res.json(cachedData);
        }
      } else {
        delete earningsCache[cleanUsername];
      }
    }

    let profileData;
    try {
      if (!forceRefresh && ProfileCache && isMongoAvailable()) {
        try {
          const cached = await ProfileCache.findOne({ username: cleanUsername });
          if (cached) {
            const age = Date.now() - cached.fetchedAt.getTime();
            const hasVideos = cached.latestVideos && Array.isArray(cached.latestVideos) && cached.latestVideos.length > 0;
            const hasValidProfile = cached.profile?.followers > 0;
            const hasValidAnalytics = cached.analytics?.avgViews > 0 && cached.analytics?.sampleSize > 0;
            const hasValidEarnings = cached.earnings?.perVideo > 0;
            const hasVideosWithViews = hasVideos && cached.latestVideos.some(v => v && Number(v.views) > 0);

            if (age < CACHE_MAX_AGE_MS && hasValidProfile && hasValidAnalytics && hasValidEarnings && hasVideosWithViews) {
              const cachedProfile = { ...cached.profile, bio: cached.bio || cached.profile?.bio || '', description: cached.bio || cached.profile?.bio || '' };
              profileData = { profile: cachedProfile, analytics: cached.analytics, latestVideos: cached.latestVideos || [], source: 'cache' };
            }
          }
        } catch (cacheErr) {
          console.warn('[Earnings] Cache read error:', cacheErr.message);
        }
      }

      if (!profileData) {
        const scrapedData = await getOrCreateRequest(cleanUsername, async () => { return await scrapeTikTokProfile(cleanUsername); });
        profileData = { profile: scrapedData.profile || scrapedData.user, latestVideos: scrapedData.latestVideos || [], source: 'html' };
      }
    } catch (scrapeErr) {
      if (scrapeErr instanceof TikTokScraperError) {
        if (scrapeErr.code === 'NOT_FOUND') return res.status(404).json({ success: false, error: `User '@${cleanUsername}' not found on TikTok`, code: 'NOT_FOUND' });
        return res.status(502).json({ success: false, error: 'Failed to fetch TikTok data', code: scrapeErr.code });
      }
      return res.status(502).json({ success: false, error: 'Failed to fetch TikTok profile data' });
    }

    const profile = profileData.profile || {};
    let latestVideos = profileData.latestVideos || [];

    let tikwmSuccess = false;
    let tikwmVideos = [];
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        tikwmVideos = await fetchVideosFromTikWM(cleanUsername, 30);
        if (tikwmVideos && Array.isArray(tikwmVideos) && tikwmVideos.length > 0) {
          const vwv = tikwmVideos.filter(v => v && Number(v.views) > 0);
          if (vwv.length > 0) { latestVideos = tikwmVideos; tikwmSuccess = true; break; }
        }
      } catch (err) {
        console.error(`[Earnings] TikWM attempt ${attempt} failed: ${err.message}`);
      }
      if (attempt < 3 && !tikwmSuccess) await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const calculatedResult = calculateEarnings({ followers: profile.followers || 0, likes: profile.likes || 0, videos: profile.videos || 0, latestVideos, region: profile.region || '' });

    if (!calculatedResult || calculatedResult.earnings === undefined) {
      const emergencyViews = Math.max((profile?.followers || 0) * 0.08, 1000);
      const safeFallback = buildSafeEarnings({ avgViews: emergencyViews, engagementRate: 5.0, followers: profile?.followers || 0, region: profile?.region || '' });
      return res.json({ success: true, ...safeFallback, avgViews: emergencyViews, engagementRate: 5.0, username: cleanUsername, followers: profile?.followers || 0, likes: profile?.likes || 0, following: profile?.following || 0, videos: profile?.videos || 0, source: 'fallback' });
    }

    const { earnings, earningPerVideo, avgViews: finalAvgViews, engagementRate: finalEngagementRate, cpm: finalCPM, platformFactor: finalPlatformFactor, earningsMin: finalEarningsMin, earningsMax: finalEarningsMax, cpmMin: finalCpmMin, cpmMax: finalCpmMax } = calculatedResult;

    const POSTS_PER_MONTH = 20;
    let safeEarnings = earnings;
    let safeEarningPerVideo = earningPerVideo;
    let safeAvgViews = finalAvgViews;
    let safeEngagementRate = finalEngagementRate;
    let safeCPM = finalCPM;
    let safeEarningsMin = finalEarningsMin ?? earningPerVideo;
    let safeEarningsMax = finalEarningsMax ?? earningPerVideo;
    let safeCpmMin = finalCpmMin ?? finalCPM;
    let safeCpmMax = finalCpmMax ?? finalCPM;

    if (!safeEarnings || safeEarnings <= 0 || !safeAvgViews || safeAvgViews <= 0) {
      const fallbackViews = Math.max((profile.followers || 0) * 0.08, 1000);
      const fallback = buildSafeEarnings({ avgViews: fallbackViews, engagementRate: safeEngagementRate || 5.0, followers: profile.followers || 0, region: profile.region || '' });
      safeEarnings = Math.max(fallback.earnings, 0.01);
      safeEarningPerVideo = safeEarnings;
      safeAvgViews = fallbackViews;
      safeCPM = fallback.cpm;
      safeCpmMin = fallback.cpmMin ?? fallback.cpm;
      safeCpmMax = fallback.cpmMax ?? fallback.cpm;
      safeEarningsMin = fallback.earningsMin ?? safeEarningPerVideo;
      safeEarningsMax = fallback.earningsMax ?? safeEarningPerVideo;
      if (!safeEngagementRate || safeEngagementRate <= 0) safeEngagementRate = 5.0;
    }

    const response = {
      success: true,
      avgViews: safeAvgViews,
      engagementRate: safeEngagementRate,
      cpm: safeCPM,
      cpmMin: safeCpmMin,
      cpmMax: safeCpmMax,
      platformFactor: finalPlatformFactor,
      estimatedEarnings: safeEarnings,
      earningPerVideo: safeEarningPerVideo,
      earnings: safeEarnings,
      perVideoNet: safeEarningPerVideo,
      earningsMin: safeEarningsMin,
      earningsMax: safeEarningsMax,
      username: cleanUsername,
      followers: profile.followers || 0,
      likes: profile.likes || 0,
      following: profile.following || 0,
      videos: profile.videos || 0,
      monthlyEarning: safeEarningPerVideo * POSTS_PER_MONTH,
      monthlyEarnings: safeEarningPerVideo * POSTS_PER_MONTH,
      source: profileData.source || 'html',
      raw: { videoCount: latestVideos.length, postsPerMonth: POSTS_PER_MONTH, videosWithViews: latestVideos.filter(v => v && Number(v.views) > 0).length },
    };

    earningsCache[cleanUsername] = { data: response, timestamp: Date.now() };
    return res.json(response);

  } catch (err) {
    console.error('[Earnings] Unexpected error:', err);
    const cleanUsername = (req.params?.username || '').trim().toLowerCase().replace('@', '');
    let profile = {};
    try { const sd = await scrapeTikTokProfile(cleanUsername); profile = sd.profile || sd.user || {}; } catch (e) {}
    const emergencyViews = Math.max((profile.followers || 0) * 0.08, 1000);
    const emergencyData = buildSafeEarnings({ avgViews: emergencyViews, engagementRate: 5.0, followers: profile.followers || 0, region: profile.region || '' });
    return res.json({ success: true, estimatedEarnings: Math.max(emergencyData.earnings, 0.01), earningPerVideo: Math.max(emergencyData.earnings, 0.01), earnings: Math.max(emergencyData.earnings, 0.01), avgViews: emergencyViews, engagementRate: 5.0, cpm: emergencyData.cpm, cpmMin: emergencyData.cpmMin, cpmMax: emergencyData.cpmMax, platformFactor: emergencyData.platformFactor, username: cleanUsername, followers: profile.followers || 0, likes: profile.likes || 0, following: profile.following || 0, videos: profile.videos || 0, monthlyEarning: Math.max(emergencyData.earnings * 20, 0.20), source: 'error_fallback' });
  }
};

const calculateEarningsFromViews = async (req, res) => {
  try {
    const views = parseFloat(req.query.views) || 0;
    const engagementRate = parseFloat(req.query.engagementRate) || 0;
    const followers = parseFloat(req.query.followers) || 0;
    const region = (req.query.region || req.query.country || '').toString();

    if (!views || views <= 0) return res.status(400).json({ success: false, error: 'views parameter is required and must be greater than 0' });

    const avgViews = views;
    let finalEngagementRate = engagementRate;
    if (!finalEngagementRate || finalEngagementRate <= 0) {
      if (followers > 0) {
        const ratio = views / followers;
        if (ratio > 0.1) finalEngagementRate = 5.0;
        else if (ratio > 0.05) finalEngagementRate = 3.0;
        else finalEngagementRate = 2.0;
      } else { finalEngagementRate = 5.0; }
    }

    const cpmRange = calculateCPMRange({ region, engagementRate: finalEngagementRate, followers });
    const platformFactor = 1.0;
    const earningPerVideo = Number(((avgViews / 1000) * cpmRange.used * platformFactor).toFixed(2));
    const earningsMin = Number(((avgViews / 1000) * cpmRange.min * platformFactor).toFixed(2));
    const earningsMax = Number(((avgViews / 1000) * cpmRange.max * platformFactor).toFixed(2));
    const round = (val, places = 2) => Math.round((Number(val) + Number.EPSILON) * 10 ** places) / 10 ** places;

    return res.json({ success: true, earnings: round(earningPerVideo, 2), earningPerVideo: round(earningPerVideo, 2), estimatedEarnings: round(earningPerVideo, 2), earningsMin: round(earningsMin, 2), earningsMax: round(earningsMax, 2), avgViews: round(avgViews, 2), engagementRate: round(finalEngagementRate, 2), cpm: round(cpmRange.used, 2), cpmMin: round(cpmRange.min, 2), cpmMax: round(cpmRange.max, 2), platformFactor, region: region || 'GLOBAL' });
  } catch (error) {
    console.error('[Earnings] Error calculating from views:', error);
    return res.status(500).json({ success: false, error: 'Failed to calculate earnings', message: error.message });
  }
};

module.exports = { getTikTokProfile, getTikTokEarnings, calculateEarningsFromViews, clearCache, clearAllCache, healthCheck };