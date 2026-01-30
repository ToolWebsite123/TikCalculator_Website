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

const CACHE_MAX_AGE_MS = 1 * 60 * 60 * 1000; // 1 hour (as specified)

/**
 * Calculate earnings using exact TikCalculator.com formula
 * @param {number} avgViews - Average views per video
 * @param {number} engagementRate - Engagement rate (default 5%)
 * @param {number} followers - Followers (for CPM scaling)
 * @param {string} region - Country/region code for region-based CPM
 * @returns {object} Earnings data object
 */
function calculateEarningsData(avgViews, engagementRate = 5, followers = 0, region = '') {
  const cpmRange = calculateCPMRange({
    region,
    engagementRate,
    followers,
  });

  // Ensure avgViews is a valid number
  const safeAvgViews = Math.max(Number(avgViews) || 0, 0);
  const safeEngagementRate = Math.max(Number(engagementRate) || 5, 0);

  // Earnings formula: (avgViews / 1000) * CPM (avg) with range for display
  const earningPerVideo = Number(((safeAvgViews / 1000) * cpmRange.used).toFixed(2));
  const earningsMin = Number(((safeAvgViews / 1000) * cpmRange.min).toFixed(2));
  const earningsMax = Number(((safeAvgViews / 1000) * cpmRange.max).toFixed(2));

  console.log('[calculateEarningsData] ========================================');
  console.log('[calculateEarningsData] INPUT:', {
    avgViews: safeAvgViews,
    cpm: cpmRange.used,
    cpmRange,
    engagementRate: safeEngagementRate, // Display only
    followers,
    region,
  });
  console.log('[calculateEarningsData] Formula: (avgViews / 1000) * CPM');
  console.log('[calculateEarningsData] STEP 1: (avgViews / 1000) =', safeAvgViews / 1000);
  console.log('[calculateEarningsData] STEP 2: earnings (avg) =', earningPerVideo);
  console.log('[calculateEarningsData] RANGE:', { earningsMin, earningsMax });
  console.log('[calculateEarningsData] FINAL RESULT:', {
    estimatedEarnings: earningPerVideo,
    earningPerVideo: earningPerVideo,
  });
  console.log('[calculateEarningsData] ========================================');

  return {
    avgViews: safeAvgViews,
    engagementRate: safeEngagementRate, // Display only
    cpm: cpmRange.used,
    cpmMin: cpmRange.min,
    cpmMax: cpmRange.max,
    platformFactor: 1.0,
    estimatedEarnings: earningPerVideo,
    earningPerVideo: earningPerVideo,
    earningsMin,
    earningsMax,
  };
}

/**
 * Lightweight helper to build a safe earnings payload from raw inputs.
 * Keeps the logic consistent across all fallbacks.
 */
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

/**
 * Build standardized API response
 */
const buildResponse = (profile, analytics, earnings, latestVideos = []) => {
  // Validate profile input - use empty object if invalid
  if (!profile || typeof profile !== 'object') {
    console.error('[Controller] CRITICAL: Invalid profile in buildResponse!', profile);
    profile = {};
  }

  // CRITICAL: Ensure username is NEVER empty - use fallback
  let username = '';
  try {
    username = (profile.username || profile.userName || '').toString().trim();
  } catch (err) {
    console.error('[Controller] Error extracting username:', err.message);
    username = '';
  }

  if (!username || username === '') {
    console.error('[Controller] CRITICAL: Username is still empty in buildResponse!', {
      profileKeys: Object.keys(profile || {}),
      profileUsername: profile?.username,
      profileUserName: profile?.userName,
    });
    // Don't throw - use a default value instead
    username = 'unknown';
  }

  // Helper to preserve full URLs and fix escaped unicode characters
  const preserveFullUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    // Fix escaped unicode characters (e.g., \u002F -> /)
    return url
      .replace(/\\u002F/g, '/')
      .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\\//g, '/')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .trim(); // Keep full URL with all query params intact
  };

  // CRITICAL: Extract avgViews and engagementRate from analytics
  const avgViews = Number(analytics?.avgViews) || 0;
  const engagementRate = Number(analytics?.engagementRate) || 5; // Default 5%
  const followerCount = Number(profile?.followers) || 0;
  const region = profile?.region || profile?.country || '';

  // CRITICAL: Always calculate earningsData using the calculateEarningsData function
  // This ensures earningsData is NEVER null/undefined
  const earningsData = calculateEarningsData(avgViews, engagementRate, followerCount, region);

  console.log('[Controller] ✓ Calculated earningsData:', earningsData);

  // Extract description/bio from profile - clean "Signature (Required):" prefix and HTML
  let rawDescription = (profile.bio || profile.description || profile.signature || '').toString().trim();

  // Clean HTML tags and entities
  if (rawDescription) {
    rawDescription = rawDescription
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/^Signature\s*\(Required\)\s*:\s*/i, '') // Remove prefix
      .trim();
  }

  const extractedDescription = rawDescription || '';

  // Ensure all required fields are present with proper fallbacks
  // CRITICAL: Always include bio field (even if empty) to match expected format
  const response = {
    success: true,
    username: username, // Root level username
    description: extractedDescription || '', // Root level description (never "Signature (Required):")
    bio: extractedDescription || '', // Also include bio at root level (always present, even if empty)
    profile: {
      username: username, // This should NEVER be empty
      fullName: (profile.fullName || profile.full_name || profile.nickname || username || '').toString().trim(),
      bio: extractedDescription || '', // Always present, even if empty
      description: extractedDescription || '', // Also include as description in profile
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
      joinedAt: profile.joinedAt || profile.joined_at || null,
      secUid: (profile.secUid || profile.sec_uid || '').toString(),
    },
    analytics: analytics || {
      avgViews: 0,
      engagementRate: 0,
      sampleSize: 0,
    },
    earnings: earnings || {
      earnings: 0,
      earningPerVideo: 0,
      estimatedEarnings: 0,
      perVideoNet: 0,
      perVideo: 0,
      monthly: 0,
      monthlyEarning: 0,
      yearly: 0,
      cpm: 0,
      cpmMin: 0,
      cpmMax: 0,
      earningsMin: 0,
      earningsMax: 0,
      platformFactor: 1.0,
    },
    // CRITICAL: Include earningsData object with exact structure required
    // ALWAYS present - never null/undefined
    earningsData: earningsData,
    // Also include ALL earnings fields at root level for backward compatibility
    avgViews: earningsData.avgViews,
    engagementRate: earningsData.engagementRate,
    cpm: earningsData.cpm,
    cpmMin: earningsData.cpmMin,
    cpmMax: earningsData.cpmMax,
    platformFactor: earningsData.platformFactor,
    estimatedEarnings: earningsData.estimatedEarnings,
    earningPerVideo: earningsData.earningPerVideo,
    earnings: earningsData.estimatedEarnings,
    perVideoNet: earningsData.earningPerVideo,
    earningsMin: earningsData.earningsMin,
    earningsMax: earningsData.earningsMax,
    latestVideos: Array.isArray(latestVideos) ? latestVideos : [],
    cachedAt: new Date().toISOString(),
  };

  // Final validation - username MUST be present (use fallback if missing)
  if (!response.profile.username || response.profile.username.trim() === '') {
    console.error('[Controller] ERROR: Username is empty in final response! Using fallback.');
    response.profile.username = username || 'unknown';
  }

  return response;
};

/**
 * Get TikTok profile and calculate earnings
 * @route GET /api/tiktok/user/:username
 */
const getTikTokProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const forceRefresh = req.query.refresh === 'true';

    // Validate username
    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      });
    }

    const cleanUsername = username.trim().toLowerCase().replace('@', '');

    // Check cache first (unless force refresh)
    if (!forceRefresh && ProfileCache && isMongoAvailable()) {
      try {
        const cached = await ProfileCache.findOne({ username: cleanUsername });

        if (cached) {
          const age = Date.now() - cached.fetchedAt.getTime();

          // Check if cache is valid: must have followers AND valid analytics from REAL data
          const hasValidProfile = cached.profile?.followers > 0;
          const hasValidAnalytics = cached.analytics?.avgViews > 0 && cached.analytics?.sampleSize > 0; // Must have real video data
          const hasValidEarnings = cached.earnings?.perVideo > 0;
          const hasVideos = cached.latestVideos && Array.isArray(cached.latestVideos) && cached.latestVideos.length > 0;
          const hasVideosWithViews = hasVideos && cached.latestVideos.some(v => v && Number(v.views) > 0);

          // Return cached data ONLY if fresh AND has REAL data (not fallback values)
          if (age < CACHE_MAX_AGE_MS && hasValidProfile && hasValidAnalytics && hasValidEarnings && hasVideosWithViews) {
            console.log(`[Controller] ✓ Returning cached data with REAL values for @${cleanUsername}`, {
              avgViews: cached.analytics?.avgViews,
              sampleSize: cached.analytics?.sampleSize,
              videosWithViews: cached.latestVideos.filter(v => v && Number(v.views) > 0).length,
            });

            // Ensure bio is included in cached profile
            const cachedProfile = {
              ...cached.profile,
              bio: cached.bio || cached.profile?.bio || cached.profile?.description || '',
              description: cached.bio || cached.profile?.bio || cached.profile?.description || '',
            };

            return res.json(buildResponse(
              cachedProfile,
              cached.analytics,
              cached.earnings,
              cached.latestVideos || []
            ));
          } else {
            // Cache exists but is invalid - log why and force re-scrape
            console.log(`[Controller] Cache invalid for @${cleanUsername} - forcing re-scrape:`, {
              hasValidProfile,
              hasValidAnalytics,
              hasValidEarnings,
              hasVideosWithViews,
              age: age < CACHE_MAX_AGE_MS ? 'fresh' : 'expired',
              avgViews: cached.analytics?.avgViews || 0,
              sampleSize: cached.analytics?.sampleSize || 0,
            });
          }
        }
      } catch (cacheErr) {
        console.warn('[Controller] Cache read error:', cacheErr.message);
        // Continue to fetch fresh data
      }
    }

    // Fetch fresh data from TikTok
    console.log(`[Controller] Fetching fresh data for @${cleanUsername}`);

    let scrapedData;
    try {
      scrapedData = await scrapeTikTokProfile(cleanUsername);
    } catch (scrapeErr) {
      // Handle specific scraper errors
      if (scrapeErr instanceof TikTokScraperError) {
        const errorResponses = {
          'NOT_FOUND': { status: 404, message: `User '@${cleanUsername}' not found on TikTok` },
          'BAD_REQUEST': { status: 400, message: 'Invalid username format' },
          'CAPTCHA_REQUIRED': {
            status: 429,
            message: 'TikTok verification required. Please try again in a few moments.',
            retry: true
          },
          'RATE_LIMIT': {
            status: 429,
            message: 'Too many requests. Please try again later.',
            retry: true
          },
          'PARSE_ERROR': {
            status: 500,
            message: 'Failed to parse TikTok data. Please try again.',
            retry: true
          },
          'NETWORK_ERROR': {
            status: 503,
            message: 'Network error. Please check your connection.',
            retry: true
          },
          'TIMEOUT': {
            status: 504,
            message: 'Request timeout. Please try again.',
            retry: true
          },
          'HTTP_ERROR': {
            status: 502,
            message: 'TikTok server error. Please try again.',
            retry: true
          },
        };

        const errorInfo = errorResponses[scrapeErr.code] || {
          status: 500,
          message: 'Failed to fetch TikTok profile',
          retry: true,
        };

        return res.status(errorInfo.status).json({
          success: false,
          error: errorInfo.message,
          code: scrapeErr.code,
          retry: errorInfo.retry || false,
        });
      }

      // Unknown error
      console.error('[Controller] Scrape error:', scrapeErr.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch TikTok profile data',
        retry: true,
      });
    }

    // DEBUG: Log scrapedData structure
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

    // Extract profile - handle both old and new scraper response formats
    let profile = scrapedData.profile;

    // If profile doesn't exist but user does, create profile from user
    if (!profile && scrapedData.user) {
      // Extract description/bio from ALL possible sources
      const extractedDescription = (
        scrapedData.profile?.bio ||
        scrapedData.profile?.description ||
        scrapedData.profile?.signature ||
        scrapedData.user.bio ||
        scrapedData.user.description ||
        scrapedData.user.signature ||
        scrapedData.description ||
        scrapedData.bio ||
        ''
      ).toString().trim();

      // Clean HTML and unwanted prefixes
      let cleanDescription = extractedDescription
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/^Signature\s*\(Required\)\s*:\s*/i, '') // Remove prefix
        .trim();

      profile = {
        username: scrapedData.user.username || cleanUsername,
        fullName: scrapedData.user.nickname || scrapedData.user.username || cleanUsername,
        profilePic: scrapedData.user.avatar || '',
        description: cleanDescription || '',
        bio: cleanDescription || '',
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

      console.log(`[Controller] Created profile from user - bio: "${cleanDescription.substring(0, 50)}${cleanDescription.length > 50 ? '...' : ''}"`);
    }

    // CRITICAL: Ensure bio is extracted from profile if it exists
    if (profile) {
      // Extract bio from profile - try ALL possible fields including root level
      const profileBio = (
        profile.bio ||
        profile.description ||
        profile.signature ||
        scrapedData.profile?.bio ||
        scrapedData.profile?.description ||
        scrapedData.profile?.signature ||
        scrapedData.user?.bio ||
        scrapedData.user?.description ||
        scrapedData.user?.signature ||
        scrapedData.bio ||
        scrapedData.description ||
        ''
      ).toString().trim();

      // Clean HTML and unwanted prefixes
      let cleanBio = profileBio
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/^Signature\s*\(Required\)\s*:\s*/i, '') // Remove prefix
        .trim();

      // Always set bio and description in profile (even if empty)
      profile.bio = cleanBio;
      profile.description = cleanBio;

      if (cleanBio) {
        console.log(`[Controller] ✓ Extracted bio: "${cleanBio.substring(0, 50)}${cleanBio.length > 50 ? '...' : ''}"`);
      } else {
        console.warn(`[Controller] ⚠ No bio found for @${cleanUsername} - trying additional sources...`);

        // Last resort: Try to extract from scrapedData root level
        const rootBio = (
          scrapedData.bio ||
          scrapedData.description ||
          scrapedData.profile?.bio ||
          scrapedData.profile?.description ||
          scrapedData.user?.bio ||
          scrapedData.user?.description ||
          ''
        ).toString().trim();

        if (rootBio) {
          const cleanedRootBio = rootBio
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
            .trim();

          if (cleanedRootBio) {
            profile.bio = cleanedRootBio;
            profile.description = cleanedRootBio;
            console.log(`[Controller] ✓ Found bio in root level: "${cleanedRootBio.substring(0, 50)}${cleanedRootBio.length > 50 ? '...' : ''}"`);
          }
        }
      }
    }

    let latestVideos = Array.isArray(scrapedData.latestVideos) ? scrapedData.latestVideos : [];

    // ALWAYS try to fetch videos from TikWM API with retry logic (3 attempts)
    const videosWithViews = latestVideos.filter(v => v && Number(v.views) > 0);
    if (videosWithViews.length === 0) {
      console.log(`[Controller] No videos with views found, fetching from TikWM API (with retries)...`);

      // Retry logic: 3 attempts
      let tikwmVideos = [];
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`[Controller] TikWM API attempt ${attempt}/3...`);
          tikwmVideos = await fetchVideosFromTikWM(cleanUsername, 30);
          if (tikwmVideos && Array.isArray(tikwmVideos) && tikwmVideos.length > 0) {
            const videosWithViewsFromTikWM = tikwmVideos.filter(v => v && Number(v.views) > 0);
            if (videosWithViewsFromTikWM.length > 0) {
              latestVideos = tikwmVideos;
              console.log(`[Controller] ✓ Fetched ${tikwmVideos.length} videos from TikWM API (attempt ${attempt})`);
              break; // Success, exit retry loop
            } else {
              console.warn(`[Controller] ⚠ TikWM attempt ${attempt}: Got ${tikwmVideos.length} videos but none have views > 0`);
            }
          } else {
            console.warn(`[Controller] ⚠ TikWM attempt ${attempt}: No videos returned`);
          }
        } catch (tikwmErr) {
          console.warn(`[Controller] ⚠ TikWM API attempt ${attempt} failed: ${tikwmErr.message}`);
          if (attempt === 3) {
            console.error(`[Controller] ❌ All 3 TikWM API attempts failed`);
          }
        }

        // Wait 1 second between retries (except on last attempt)
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Validate scraped data - ensure profile exists
    if (!profile) {
      console.error('[Controller] CRITICAL: No profile or user data found in scrapedData');
      console.error('[Controller] scrapedData structure:', JSON.stringify(scrapedData, null, 2).substring(0, 500));
      return res.status(500).json({
        success: false,
        error: 'Invalid data received from TikTok - profile is missing',
        retry: true,
      });
    }

    // Ensure profile is an object
    if (typeof profile !== 'object') {
      console.error('[Controller] CRITICAL: Profile is not an object:', typeof profile);
      return res.status(500).json({
        success: false,
        error: 'Invalid profile data format',
        retry: true,
      });
    }

    // CRITICAL: Ensure username is ALWAYS set (use searched username as fallback)
    if (!profile.username || (typeof profile.username === 'string' && profile.username.trim() === '')) {
      profile.username = cleanUsername;
      console.warn(`[Controller] Username was missing, using searched username: ${profile.username}`);
    }

    // Ensure username is not empty string
    profile.username = (profile.username || cleanUsername).toString().trim();

    // Ensure other critical fields have defaults with proper fallbacks
    profile.fullName = profile.fullName || profile.nickname || profile.username || cleanUsername;

    // CRITICAL: Preserve full profilePic URL - fix escaped unicode characters
    const fixProfilePicUrl = (url) => {
      if (!url || typeof url !== 'string') return '';
      // Fix escaped unicode characters (e.g., \u002F -> /)
      return url
        .replace(/\\u002F/g, '/')
        .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/\\\//g, '/')
        .replace(/\\"/g, '"')
        .trim();
    };

    profile.profilePic = fixProfilePicUrl(
      profile.profilePic || profile.avatar || profile.avatarLarger ||
      profile.avatarMedium || profile.profilePicture || profile.profilePictureUrl || ''
    );

    profile.followers = Number(profile.followers) || 0;
    profile.following = Number(profile.following) || 0;
    profile.likes = Number(profile.likes) || 0;
    profile.videos = Number(profile.videos) || 0;

    // Ensure all other fields have defaults - clean bio
    // Try to get bio from multiple sources
    const rawBio = (
      profile.bio ||
      profile.description ||
      profile.signature ||
      scrapedData?.profile?.bio ||
      scrapedData?.profile?.description ||
      scrapedData?.profile?.signature ||
      scrapedData?.user?.bio ||
      scrapedData?.user?.description ||
      scrapedData?.user?.signature ||
      ''
    ).toString().trim();

    const cleanBio = rawBio.replace(/^Signature\s*\(Required\)\s*:\s*/i, '').trim();

    // Always set bio and description
    profile.bio = cleanBio;
    profile.description = cleanBio;

    if (cleanBio) {
      console.log(`[Controller] ✓ Final bio set: "${cleanBio.substring(0, 50)}${cleanBio.length > 50 ? '...' : ''}"`);
    }

    profile.verified = Boolean(profile.verified);

    // Preserve full thumbnail URL too - fix escaped unicode
    profile.profilePicThumb = fixProfilePicUrl(
      profile.profilePicThumb || profile.profilePic || profile.avatarThumb || profile.avatarMedium || ''
    );

    profile.region = profile.region || profile.country || '';
    profile.tiktokId = profile.tiktokId || profile.tiktok_id || profile.id || profile.uid || '';
    profile.category = profile.category || '';
    profile.joinedAt = profile.joinedAt || profile.joined_at || null;
    profile.secUid = profile.secUid || profile.sec_uid || '';

    // Calculate analytics and earnings - ALWAYS return valid data (never null)
    let analytics = null;
    let earnings = null;

    try {
      // Filter videos with valid views
      const videosWithViews = (latestVideos || []).filter(v => v && Number(v.views) > 0);

      console.log(`[Controller] ========================================`);
      console.log(`[Controller] Calculating earnings:`, {
        followers: profile.followers || 0,
        likes: profile.likes || 0,
        videos: profile.videos || 0,
        videoCount: latestVideos?.length || 0,
        videosWithViews: videosWithViews.length,
      });

      // ALWAYS calculate earnings (calculateEarnings never returns null)
      const calculated = calculateEarnings({
        followers: profile.followers || 0,
        likes: profile.likes || 0,
        videos: profile.videos || 0,
        latestVideos: videosWithViews.length > 0 ? videosWithViews : latestVideos, // Use all videos if none have views
        region: profile.region || profile.country || '',
      });

      // CRITICAL: calculateEarnings never returns null, but ensure we have valid data
      if (calculated && calculated.earnings !== undefined) {
        analytics = calculated.analytics;
        // Return earnings in TikCalculator.com format (same as earnings endpoint)
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

        console.log(`[CALCULATED]`, {
          earnings: calculated.earnings,
          earningPerVideo: calculated.earningPerVideo,
          avgViews: calculated.avgViews,
          engagementRate: calculated.engagementRate,
          cpm: calculated.cpm,
          platformFactor: calculated.platformFactor,
        });
        console.log(`[Controller] ✓ Calculated earnings:`, {
          avgViews: analytics?.avgViews,
          engagementRate: analytics?.engagementRate,
          earnings: earnings?.earnings,
          earningPerVideo: earnings?.earningPerVideo,
          cpm: earnings?.cpm,
        });
      } else {
        // Emergency fallback - should never happen, but ensure we have data
        console.warn('[Controller] ⚠ calculateEarnings returned unexpected format, using emergency fallback');
        const emergencyViews = Math.max((profile.followers || 0) * 0.08, 1000);
        const emergencyEngagementRate = 5.0; // Display only
        const safeFallback = buildSafeEarnings({
          avgViews: emergencyViews,
          engagementRate: emergencyEngagementRate,
          followers: profile.followers || 0,
          region: profile.region || profile.country || '',
        });

        analytics = {
          avgViews: emergencyViews,
          engagementRate: emergencyEngagementRate,
          sampleSize: 0,
        };
        earnings = safeFallback;
      }
    } catch (calcErr) {
      console.error('[Controller] Calculation error:', calcErr.message);
      console.error('[Controller] Stack:', calcErr.stack);
      // Emergency fallback - always return valid data using user's formulas
      const emergencyViews = Math.max((profile.followers || 0) * 0.08, 1000);
      const emergencyEngagementRate = 5.0; // Display only
      const safeFallback = buildSafeEarnings({
        avgViews: emergencyViews,
        engagementRate: emergencyEngagementRate,
        followers: profile.followers || 0,
        region: profile.region || profile.country || '',
      });

      analytics = {
        avgViews: emergencyViews,
        engagementRate: emergencyEngagementRate,
        sampleSize: 0,
      };
      earnings = safeFallback;
      console.log('[Controller] ✓ Using emergency fallback earnings:', earnings);
    }

    // Build response - profile.username should be set by now
    const responseData = buildResponse(
      profile,
      analytics,
      earnings,
      latestVideos || []
    );

    // FINAL SAFETY CHECK: Ensure username is NEVER empty in response
    if (!responseData.profile || !responseData.profile.username || responseData.profile.username.trim() === '') {
      console.error('[Controller] CRITICAL ERROR: Username missing in final response! Using fallback.');
      responseData.profile = responseData.profile || {};
      responseData.profile.username = cleanUsername; // Last resort fallback
    }

    // CRITICAL: Ensure earningsData is ALWAYS present and never null/undefined
    if (!responseData.earningsData || typeof responseData.earningsData !== 'object') {
      console.error('[Controller] CRITICAL ERROR: earningsData is missing! Creating fallback.');
      const fallbackAvgViews = Number(responseData.avgViews) || 0;
      responseData.earningsData = calculateEarningsData(fallbackAvgViews, 5);
      // Also update root level fields
      responseData.avgViews = responseData.earningsData.avgViews;
      responseData.engagementRate = responseData.earningsData.engagementRate;
      responseData.cpm = responseData.earningsData.cpm;
      responseData.platformFactor = responseData.earningsData.platformFactor;
      responseData.estimatedEarnings = responseData.earningsData.estimatedEarnings;
      responseData.earningPerVideo = responseData.earningsData.earningPerVideo;
    }

    console.log('[Controller] ✓ Final response includes earningsData:', {
      hasEarningsData: !!responseData.earningsData,
      avgViews: responseData.earningsData?.avgViews,
      estimatedEarnings: responseData.earningsData?.estimatedEarnings,
      earningPerVideo: responseData.earningsData?.earningPerVideo,
    });
    console.log("Final Earnings Payload:", responseData.earningsData);

    // Cache the results - ONLY if data is valid and from REAL video data
    if (ProfileCache && isMongoAvailable()) {
      try {
        // Validate before caching - don't cache fallback/invalid data
        const hasRealVideoData = latestVideos && latestVideos.length > 0 && latestVideos.some(v => v && Number(v.views) > 0);
        const isValidData =
          responseData.profile?.followers > 0 &&
          analytics?.avgViews > 0 &&
          analytics?.sampleSize > 0 && // Must have real video data
          earnings?.perVideo > 0 &&
          hasRealVideoData; // Must have videos with views

        if (isValidData) {
          await ProfileCache.findOneAndUpdate(
            { username: responseData.profile.username || cleanUsername },
            {
              username: responseData.profile.username || cleanUsername,
              profile: responseData.profile,
              analytics: analytics,
              earnings: earnings,
              latestVideos: latestVideos || [],
              bio: responseData.profile.bio || responseData.bio || responseData.description || '',
              fetchedAt: new Date(),
            },
            { upsert: true, new: true }
          );
          console.log(`[Controller] ✓ Cached valid data for @${cleanUsername}`);
        } else {
          console.warn(`[Controller] ⚠ Not caching invalid data for @${cleanUsername}:`, {
            hasFollowers: responseData.profile?.followers > 0,
            hasAvgViews: analytics?.avgViews > 10,
            hasEarnings: earnings?.perVideo > 0,
          });
        }
      } catch (cacheErr) {
        console.warn('[Controller] Cache save error:', cacheErr.message);
        // Continue without caching
      }
    }

    return res.json(responseData);

  } catch (err) {
    console.error('[Controller] Unexpected error:', err);
    console.error('[Controller] Error stack:', err.stack);

    // FIXED: Removed undefined 'result' variable reference
    // If we have scrapedData, try to return partial response
    // Note: This is a fallback - normally errors are handled above

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: err.message || 'An unexpected error occurred',
    });
  }
};

/**
 * Clear cache for a specific username
 * @route DELETE /api/tiktok/cache/:username
 */
const clearCache = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      });
    }

    if (!ProfileCache || !isMongoAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Database not available - caching disabled',
      });
    }

    const cleanUsername = username.trim().toLowerCase().replace('@', '');
    const result = await ProfileCache.deleteMany({ username: cleanUsername });

    return res.json({
      success: true,
      deleted: result.deletedCount,
      message: `Cache cleared for @${cleanUsername}`,
    });
  } catch (err) {
    console.error('[Controller] Clear cache error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
    });
  }
};

/**
 * Clear all cache
 * @route DELETE /api/tiktok/cache
 */
const clearAllCache = async (req, res) => {
  try {
    if (!ProfileCache || !isMongoAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Database not available - caching disabled',
      });
    }

    const result = await ProfileCache.deleteMany({});

    return res.json({
      success: true,
      deleted: result.deletedCount,
      message: 'All cache cleared',
    });
  } catch (err) {
    console.error('[Controller] Clear all cache error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
    });
  }
};

/**
 * Health check endpoint
 * @route GET /api/tiktok/health
 */
const healthCheck = async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoAvailable = isMongoAvailable();
    const cacheCount = mongoAvailable && ProfileCache ? await ProfileCache.countDocuments() : 0;

    return res.json({
      success: true,
      status: 'healthy',
      cache: {
        enabled: mongoAvailable && ProfileCache !== null,
        count: cacheCount,
        maxAge: `${CACHE_MAX_AGE_MS / 1000 / 60 / 60} hours`,
      },
      database: {
        connected: mongoAvailable,
        status: mongoAvailable ? 'connected' : 'disconnected',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: err.message,
    });
  }
};

/**
 * In-memory cache for earnings endpoint (60 seconds)
 */
const earningsCache = {};
const EARNINGS_CACHE_TTL = 60 * 1000; // 60 seconds

/**
 * Get TikTok user earnings with exact calculation
 * @route GET /api/tiktok/user/:username/earnings
 */
const getTikTokEarnings = async (req, res) => {
  try {
    const { username } = req.params;
    const forceRefresh = req.query.refresh === 'true';

    console.log(`[Earnings] GET /api/tiktok/user/${username}/earnings - refresh: ${forceRefresh}`);

    // Validate username
    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      });
    }

    const cleanUsername = username.trim().toLowerCase().replace('@', '');
    console.log(`[Earnings] Processing earnings for @${cleanUsername}`);

    // Check in-memory cache first (unless force refresh)
    if (!forceRefresh && earningsCache[cleanUsername]) {
      const cached = earningsCache[cleanUsername];
      const age = Date.now() - cached.timestamp;

      if (age < EARNINGS_CACHE_TTL) {
        console.log(`[Earnings] Returning cached data for @${cleanUsername}`);
        const cachedData = cached.data;
        // Ensure cached data has all required fields
        if (cachedData && cachedData.success !== false) {
          // Ensure estimatedEarnings is set (alias for earnings)
          if (!cachedData.estimatedEarnings && cachedData.earnings) {
            cachedData.estimatedEarnings = cachedData.earnings;
          }
          if (!cachedData.estimatedEarnings && cachedData.earningPerVideo) {
            cachedData.estimatedEarnings = cachedData.earningPerVideo;
          }
          console.log(`[Earnings] Cached data structure:`, {
            hasEarnings: !!cachedData.earnings,
            hasEstimatedEarnings: !!cachedData.estimatedEarnings,
            hasEarningPerVideo: !!cachedData.earningPerVideo,
            avgViews: cachedData.avgViews,
            cpm: cachedData.cpm,
          });
          return res.json(cachedData);
        }
      } else {
        // Cache expired, remove it
        delete earningsCache[cleanUsername];
      }
    }

    // Get profile data (this will use its own cache)
    let profileData;
    try {
      // Reuse the existing getTikTokProfile logic but get the raw data
      const forceRefreshProfile = forceRefresh;

      // Check MongoDB cache first - MUST validate analytics and earnings
      let cached = null;
      if (!forceRefreshProfile && ProfileCache && isMongoAvailable()) {
        try {
          cached = await ProfileCache.findOne({ username: cleanUsername });
          if (cached) {
            const age = Date.now() - cached.fetchedAt.getTime();
            const hasVideos = cached.latestVideos && Array.isArray(cached.latestVideos) && cached.latestVideos.length > 0;

            // CRITICAL: Validate cache data - must have REAL video data (not fallback values)
            const hasValidProfile = cached.profile?.followers > 0;
            const hasValidAnalytics = cached.analytics?.avgViews > 0 && cached.analytics?.sampleSize > 0; // Must have real video data
            const hasValidEarnings = cached.earnings?.perVideo > 0;
            const hasVideosWithViews = hasVideos && cached.latestVideos.some(v => v && Number(v.views) > 0);

            if (age < CACHE_MAX_AGE_MS && hasValidProfile && hasValidAnalytics && hasValidEarnings && hasVideosWithViews) {
              // Use cache only if it has REAL video data
              // Ensure bio is included in cached profile
              const cachedProfile = {
                ...cached.profile,
                bio: cached.bio || cached.profile?.bio || cached.profile?.description || '',
                description: cached.bio || cached.profile?.bio || cached.profile?.description || '',
              };

              profileData = {
                profile: cachedProfile,
                analytics: cached.analytics,
                latestVideos: cached.latestVideos || [],
                source: 'cache',
              };
              console.log(`[Earnings] ✓ Using MongoDB cache with REAL data - videos: ${(cached.latestVideos || []).length}, avgViews: ${cached.analytics?.avgViews}, sampleSize: ${cached.analytics?.sampleSize}`);
            } else {
              console.log(`[Earnings] MongoDB cache invalid - forcing re-scrape:`, {
                hasValidProfile,
                hasValidAnalytics,
                hasValidEarnings,
                hasVideosWithViews,
                avgViews: cached.analytics?.avgViews || 0,
                sampleSize: cached.analytics?.sampleSize || 0,
                perVideo: cached.earnings?.perVideo || 0,
              });
            }
          } else {
            console.log(`[Earnings] No MongoDB cache found`);
          }
        } catch (cacheErr) {
          console.warn('[Earnings] Cache read error:', cacheErr.message);
        }
      }

      // If no cached data, fetch fresh
      if (!profileData) {
        console.log(`[Earnings] Fetching fresh profile data for @${cleanUsername}`);
        const scrapedData = await scrapeTikTokProfile(cleanUsername);

        console.log(`[Earnings] Scraped data received - videos: ${(scrapedData.latestVideos || []).length}`);

        profileData = {
          profile: scrapedData.profile || scrapedData.user,
          latestVideos: scrapedData.latestVideos || [],
          source: 'html',
        };
      } else {
        const videoCount = (profileData.latestVideos || []).length;
        console.log(`[Earnings] Using cached profile data - videos: ${videoCount}`);

        // If cached data has no videos, fetch fresh data
        if (videoCount === 0) {
          console.log(`[Earnings] ⚠ Cached data has no videos, fetching fresh data...`);
          const scrapedData = await scrapeTikTokProfile(cleanUsername);

          console.log(`[Earnings] Fresh scraped data - videos: ${(scrapedData.latestVideos || []).length}`);

          profileData = {
            profile: scrapedData.profile || scrapedData.user,
            latestVideos: scrapedData.latestVideos || [],
            source: 'html',
          };
        }
      }
    } catch (scrapeErr) {
      if (scrapeErr instanceof TikTokScraperError) {
        if (scrapeErr.code === 'NOT_FOUND') {
          return res.status(404).json({
            success: false,
            error: `User '@${cleanUsername}' not found on TikTok`,
            code: 'NOT_FOUND',
          });
        }
        return res.status(502).json({
          success: false,
          error: 'Failed to fetch TikTok data',
          code: scrapeErr.code,
        });
      }
      return res.status(502).json({
        success: false,
        error: 'Failed to fetch TikTok profile data',
      });
    }

    // Extract data
    const profile = profileData.profile || {};
    let latestVideos = profileData.latestVideos || [];

    console.log(`[Earnings] ========================================`);
    console.log(`[Earnings] Starting earnings calculation for @${cleanUsername}`);
    console.log(`[API RAW DATA]`, {
      profile: {
        followers: profile.followers,
        likes: profile.likes,
        videos: profile.videos,
      },
      latestVideosCount: latestVideos.length,
      sampleVideos: latestVideos.slice(0, 3).map(v => ({
        views: v?.views,
        likes: v?.likes,
        comments: v?.comments,
      })),
    });

    // CRITICAL: ALWAYS fetch videos from TikWM API with retry logic (3 attempts) - PRIMARY source for real data
    console.log(`[Earnings] ========================================`);
    console.log(`[Earnings] Fetching videos from TikWM API (PRIMARY SOURCE) with retries...`);
    let tikwmSuccess = false;
    let tikwmVideos = [];

    // Retry logic: 3 attempts
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[Earnings] TikWM API attempt ${attempt}/3...`);
        tikwmVideos = await fetchVideosFromTikWM(cleanUsername, 30);
        if (tikwmVideos && Array.isArray(tikwmVideos) && tikwmVideos.length > 0) {
          const videosWithViews = tikwmVideos.filter(v => v && Number(v.views) > 0);
          if (videosWithViews.length > 0) {
            latestVideos = tikwmVideos;
            tikwmSuccess = true;
            console.log(`[Earnings] ✓ TikWM API SUCCESS (attempt ${attempt}): ${tikwmVideos.length} videos, ${videosWithViews.length} with views > 0`);

            // Log sample data
            if (videosWithViews.length > 0) {
              const sampleViews = videosWithViews.slice(0, 3).map(v => v.views);
              console.log(`[Earnings] Sample views from TikWM:`, sampleViews);
            }
            break; // Success, exit retry loop
          } else {
            console.warn(`[Earnings] ⚠ TikWM attempt ${attempt}: Got ${tikwmVideos.length} videos but NONE have views > 0`);
          }
        } else {
          console.warn(`[Earnings] ⚠ TikWM attempt ${attempt}: No videos returned (got: ${tikwmVideos?.length || 0})`);
        }
      } catch (err) {
        console.error(`[Earnings] ❌ TikWM API attempt ${attempt} failed: ${err.message}`);
        if (attempt === 3) {
          console.error(`[Earnings] ❌ All 3 TikWM API attempts failed`);
          console.error(`[Earnings] Error stack:`, err.stack);
        }
      }

      // Wait 1 second between retries (except on last attempt)
      if (attempt < 3 && !tikwmSuccess) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // If TikWM failed, try to get videos from scraped data
    if (!tikwmSuccess) {
      console.log(`[Earnings] TikWM failed, checking scraped videos...`);
      const scrapedVideosWithViews = latestVideos.filter(v => v && Number(v.views) > 0);
      if (scrapedVideosWithViews.length > 0) {
        latestVideos = scrapedVideosWithViews;
        console.log(`[Earnings] ✓ Using ${scrapedVideosWithViews.length} videos from scraper`);
      } else {
        console.error(`[Earnings] ❌ NO VIDEOS WITH VIEWS FOUND from any source!`);
        console.error(`[Earnings]   - TikWM videos: ${tikwmVideos.length}`);
        console.error(`[Earnings]   - Scraped videos: ${latestVideos.length}`);
      }
    }

    // Calculate avgViews from latest videos (MUST use last 30 videos from API)
    let avgViews = 0;
    console.log(`[Earnings] ========================================`);
    console.log(`[Earnings] Processing ${latestVideos.length} videos for @${cleanUsername}`);

    if (latestVideos && Array.isArray(latestVideos) && latestVideos.length > 0) {
      // Filter videos with valid views data
      const videosWithValidViews = latestVideos.filter(v => v && Number(v.views) > 0);

      console.log(`[Earnings] Videos breakdown:`, {
        total: latestVideos.length,
        withViews: videosWithValidViews.length,
        withoutViews: latestVideos.length - videosWithValidViews.length,
      });

      if (videosWithValidViews.length > 0) {
        // Use last 30 videos (or all available if less than 30)
        const videosToUse = videosWithValidViews.length > 30
          ? videosWithValidViews.slice(-30) // Last 30 videos
          : videosWithValidViews;

        console.log(`[Earnings] Using ${videosToUse.length} videos for calculation`);

        // Calculate total views
        const totalViews = videosToUse.reduce((sum, v) => {
          const views = Number(v.views) || 0;
          return sum + views;
        }, 0);

        console.log(`[Earnings] Total views: ${totalViews.toLocaleString()}`);
        console.log(`[Earnings] Number of videos: ${videosToUse.length}`);

        // Calculate average: totalViews / numberOfVideos
        avgViews = totalViews / videosToUse.length;

        console.log(`[Earnings] ========================================`);
        console.log(`[Earnings] ✓ CALCULATED AVG VIEWS: ${avgViews.toLocaleString()}`);
        console.log(`[Earnings] Formula: ${totalViews.toLocaleString()} / ${videosToUse.length} = ${avgViews.toLocaleString()}`);
        console.log(`[Earnings] ========================================`);
      } else {
        console.log(`[Earnings] ⚠ No videos with views > 0 found`);
        console.log(`[Earnings] Sample video data:`, latestVideos.slice(0, 2));
      }
    } else {
      console.log(`[Earnings] ⚠ No videos found in latestVideos array`);
    }

    // Use the new calculateEarnings function (TikCalculator.com formula)
    console.log(`[Earnings] Using calculateEarnings function...`);

    const calculatedResult = calculateEarnings({
      followers: profile.followers || 0,
      likes: profile.likes || 0,
      videos: profile.videos || 0,
      latestVideos: latestVideos,
      region: profile.region || profile.country || '',
    });

    console.log(`[PARSED DATA]`, calculatedResult);

    // CRITICAL: calculateEarnings never returns null, but ensure we have valid data
    if (!calculatedResult || calculatedResult.earnings === undefined) {
      console.error(`[Earnings] ❌ calculateEarnings returned invalid data - using emergency fallback`);
      const emergencyViews = Math.max((profile?.followers || 0) * 0.08, 1000);
      const emergencyEngagementRate = 5.0; // Display only
      const safeFallback = buildSafeEarnings({
        avgViews: emergencyViews,
        engagementRate: emergencyEngagementRate,
        followers: profile?.followers || 0,
        region: profile?.region || profile?.country || '',
      });

      return res.json({
        success: true,
        ...safeFallback,
        avgViews: emergencyViews,
        engagementRate: emergencyEngagementRate,
        platformFactor: safeFallback.platformFactor,
        username: cleanUsername,
        followers: profile?.followers || 0,
        likes: profile?.likes || 0,
        following: profile?.following || 0,
        videos: profile?.videos || 0,
        source: 'fallback',
      });
    }

    // Extract values from calculated result
    const {
      earnings,
      earningPerVideo,
      avgViews: finalAvgViews,
      engagementRate: finalEngagementRate,
      cpm: finalCPM,
      platformFactor: finalPlatformFactor,
      earningsMin: finalEarningsMin,
      earningsMax: finalEarningsMax,
      cpmMin: finalCpmMin,
      cpmMax: finalCpmMax,
    } = calculatedResult;

    // Determine source
    let source = profileData.source || 'html';
    if (profileData.source === 'cache') {
      source = 'cache';
    }

    // Calculate monthly earnings (20 posts per month)
    const POSTS_PER_MONTH = 20;
    const finalMonthlyEarning = earningPerVideo * POSTS_PER_MONTH;

    console.log(`[CALCULATED EARNINGS]`, {
      earnings,
      earningPerVideo,
      avgViews: finalAvgViews,
      engagementRate: finalEngagementRate,
      cpm: finalCPM,
      platformFactor: finalPlatformFactor,
      monthlyEarning: finalMonthlyEarning,
    });

    // CRITICAL: Ensure all values are non-zero and realistic
    // If any value is 0 or invalid, recalculate using fallback
    let safeEarnings = earnings;
    let safeEarningPerVideo = earningPerVideo;
    let safeAvgViews = finalAvgViews;
    let safeEngagementRate = finalEngagementRate;
    let safeCPM = finalCPM;
    let safeEarningsMin = finalEarningsMin ?? earningPerVideo;
    let safeEarningsMax = finalEarningsMax ?? earningPerVideo;
    let safeCpmMin = finalCpmMin ?? finalCPM;
    let safeCpmMax = finalCpmMax ?? finalCPM;

    // Safety check: if earnings is 0 or too low, recalculate
    if (!safeEarnings || safeEarnings <= 0 || !safeAvgViews || safeAvgViews <= 0) {
      console.warn('[Earnings] ⚠ Final values are invalid, recalculating with fallback...');
      const fallbackViews = Math.max((profile.followers || 0) * 0.08, 1000);
      const fallbackEngagementRate = safeEngagementRate || 5.0; // Display only
      const fallback = buildSafeEarnings({
        avgViews: fallbackViews,
        engagementRate: fallbackEngagementRate,
        followers: profile.followers || 0,
        region: profile.region || profile.country || '',
      });

      safeEarnings = Math.max(fallback.earnings, 0.01);
      safeEarningPerVideo = safeEarnings;
      safeAvgViews = fallbackViews;
      safeCPM = fallback.cpm;
      safeCpmMin = fallback.cpmMin ?? fallback.cpm;
      safeCpmMax = fallback.cpmMax ?? fallback.cpm;
      safeEarningsMin = fallback.earningsMin ?? safeEarningPerVideo;
      safeEarningsMax = fallback.earningsMax ?? safeEarningPerVideo;

      if (!safeEngagementRate || safeEngagementRate <= 0) {
        safeEngagementRate = profile.likes > 0 && profile.followers > 0 && profile.videos > 0
          ? Math.min((profile.likes / profile.videos / profile.followers) * 100, 50)
          : 5.0;
      }

      console.log('[Earnings] ✓ Recalculated with fallback:', {
        earnings: safeEarnings,
        avgViews: safeAvgViews,
        cpm: safeCPM,
        engagementRate: safeEngagementRate,
      });
    }

    // Build response with TikCalculator.com structure - UNIFIED FORMAT
    // All fields at root level for easy frontend access
    const response = {
      success: true,
      // CRITICAL: All earnings fields at root level (TikCalculator.com format)
      avgViews: safeAvgViews,
      engagementRate: safeEngagementRate,
      cpm: safeCPM,
      cpmMin: safeCpmMin,
      cpmMax: safeCpmMax,
      platformFactor: finalPlatformFactor,
      estimatedEarnings: safeEarnings,
      earningPerVideo: safeEarningPerVideo,
      earnings: safeEarnings, // Alias for estimatedEarnings
      perVideoNet: safeEarningPerVideo, // Alias for earningPerVideo
      earningsMin: safeEarningsMin,
      earningsMax: safeEarningsMax,
      // Additional fields for compatibility
      username: cleanUsername,
      followers: profile.followers || 0,
      likes: profile.likes || 0,
      following: profile.following || 0,
      videos: profile.videos || 0,
      monthlyEarning: safeEarningPerVideo * POSTS_PER_MONTH,
      monthlyEarnings: safeEarningPerVideo * POSTS_PER_MONTH,
      source: source,
      raw: {
        videoCount: latestVideos.length,
        postsPerMonth: POSTS_PER_MONTH,
        videosWithViews: latestVideos.filter(v => v && Number(v.views) > 0).length,
      },
    };

    // Log final response
    console.log(`[Earnings] ========================================`);
    console.log(`[Earnings] FINAL RESPONSE BEING SENT:`);
    console.log(`[CALCULATED EARNINGS]`, JSON.stringify({
      earnings: response.earnings,
      earningPerVideo: response.earningPerVideo,
      avgViews: response.avgViews,
      engagementRate: response.engagementRate,
      cpm: response.cpm,
      platformFactor: response.platformFactor,
    }, null, 2));
    console.log("Final Earnings Payload:", {
      avgViews: response.avgViews,
      engagementRate: response.engagementRate,
      cpm: response.cpm,
      platformFactor: response.platformFactor,
      estimatedEarnings: response.estimatedEarnings,
      earningPerVideo: response.earningPerVideo,
    });
    console.log(`[Earnings] ========================================`);

    // Cache the response
    earningsCache[cleanUsername] = {
      data: response,
      timestamp: Date.now(),
    };

    return res.json(response);

  } catch (err) {
    console.error('[Earnings] Unexpected error:', err);
    console.error('[Earnings] Error stack:', err.stack);

    // CRITICAL: Return valid earnings data even on error (never return zeros)
    // Use emergency fallback calculation
    const username = req.params?.username || '';
    const cleanUsername = username.trim().toLowerCase().replace('@', '');

    // Try to get profile data for fallback calculation
    let profile = {};
    try {
      const scrapedData = await scrapeTikTokProfile(cleanUsername);
      profile = scrapedData.profile || scrapedData.user || {};
    } catch (profileErr) {
      console.warn('[Earnings] Could not fetch profile for error fallback:', profileErr.message);
    }

    // Calculate emergency fallback earnings
    const emergencyViews = Math.max((profile.followers || 0) * 0.08, 1000);
    const emergencyEngagementRate = profile.likes > 0 && profile.followers > 0 && profile.videos > 0
      ? Math.min((profile.likes / profile.videos / profile.followers) * 100, 50)
      : 5.0; // Display only
    const emergencyData = buildSafeEarnings({
      avgViews: emergencyViews,
      engagementRate: emergencyEngagementRate,
      followers: profile.followers || 0,
      region: profile.region || profile.country || '',
    });
    const emergencyEngagement = profile.likes > 0 && profile.followers > 0 && profile.videos > 0
      ? Math.min((profile.likes / profile.videos / profile.followers) * 100, 50)
      : 5.0;

    return res.json({
      success: true,
      estimatedEarnings: Math.max(emergencyData.earnings, 0.01),
      earningPerVideo: Math.max(emergencyData.earnings, 0.01),
      earnings: Math.max(emergencyData.earnings, 0.01),
      avgViews: emergencyViews,
      engagementRate: emergencyEngagement,
      cpm: emergencyData.cpm,
      cpmMin: emergencyData.cpmMin,
      cpmMax: emergencyData.cpmMax,
      platformFactor: emergencyData.platformFactor,
      username: cleanUsername,
      followers: profile.followers || 0,
      likes: profile.likes || 0,
      following: profile.following || 0,
      videos: profile.videos || 0,
      monthlyEarning: Math.max(emergencyEarnings * 20, 0.20),
      source: 'error_fallback',
    });
  }
};

/**
 * Calculate earnings from views (TikCalculator.com style)
 * GET /api/tiktok/earnings?views=XXXX&engagementRate=XX&followers=XXXX
 */
const calculateEarningsFromViews = async (req, res) => {
  try {
    const views = parseFloat(req.query.views) || 0;
    const engagementRate = parseFloat(req.query.engagementRate) || 0;
    const followers = parseFloat(req.query.followers) || 0;
    const region = (req.query.region || req.query.country || '').toString();

    console.log('[Earnings] Calculate from views:', { views, engagementRate, followers });

    if (!views || views <= 0) {
      return res.status(400).json({
        success: false,
        error: 'views parameter is required and must be greater than 0',
      });
    }

    // Use calcEarnings utility to calculate
    const { calculateEarnings } = require('../utils/calcEarnings');

    // Calculate earnings using the utility
    const result = calculateEarnings({
      followers: followers || 0,
      likes: 0,
      videos: 0,
      latestVideos: [], // No video data, just using views
    });

    // Override avgViews with provided views
    const avgViews = views;

    // Calculate engagement rate if not provided
    let finalEngagementRate = engagementRate;
    if (!finalEngagementRate || finalEngagementRate <= 0) {
      // Estimate engagement based on views/followers ratio
      if (followers > 0) {
        const viewsToFollowersRatio = views / followers;
        if (viewsToFollowersRatio > 0.1) finalEngagementRate = 5.0; // High engagement
        else if (viewsToFollowersRatio > 0.05) finalEngagementRate = 3.0; // Medium engagement
        else finalEngagementRate = 2.0; // Low engagement
      } else {
        finalEngagementRate = 5.0; // Default
      }
    }

    // Calculate CPM based on views (TikCalculator.com style) - $1-$4 range
    const cpmRange = calculateCPMRange({
      region,
      engagementRate: finalEngagementRate,
      followers,
    });

    const platformFactor = 1.0;

    const earningPerVideo = Number(((avgViews / 1000) * cpmRange.used * platformFactor).toFixed(2));
    const earningsMin = Number(((avgViews / 1000) * cpmRange.min * platformFactor).toFixed(2));
    const earningsMax = Number(((avgViews / 1000) * cpmRange.max * platformFactor).toFixed(2));
    const estimatedEarnings = earningPerVideo;

    console.log('[calculateEarningsFromViews] ========================================');
    console.log('[calculateEarningsFromViews] Formula: (avgViews / 1000) * CPM');
    console.log('[calculateEarningsFromViews] INPUT:', {
      avgViews: avgViews,
      cpmRange,
      engagementRate: finalEngagementRate, // Display only
    });
    console.log('[calculateEarningsFromViews] STEP 1: (avgViews / 1000) =', avgViews / 1000);
    console.log('[calculateEarningsFromViews] STEP 2: earnings(avg) =', earningPerVideo);
    console.log('[calculateEarningsFromViews] RANGE:', { earningsMin, earningsMax });
    console.log('[calculateEarningsFromViews] FINAL RESULT:', earningPerVideo);
    console.log('[calculateEarningsFromViews] ========================================');

    // Round values
    const round = (val, places = 2) =>
      Math.round((Number(val) + Number.EPSILON) * 10 ** places) / 10 ** places;

    const response = {
      success: true,
      earnings: round(estimatedEarnings, 2),
      earningPerVideo: round(earningPerVideo, 2),
      estimatedEarnings: round(estimatedEarnings, 2),
      earningsMin: round(earningsMin, 2),
      earningsMax: round(earningsMax, 2),
      avgViews: round(avgViews, 2),
      engagementRate: round(finalEngagementRate, 2),
      cpm: round(cpmRange.used, 2),
      cpmMin: round(cpmRange.min, 2),
      cpmMax: round(cpmRange.max, 2),
      platformFactor: platformFactor,
      region: region || 'GLOBAL',
    };

    console.log('[Earnings] Calculated from views:', response);
    return res.json(response);
  } catch (error) {
    console.error('[Earnings] Error calculating from views:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate earnings',
      message: error.message,
    });
  }
};

module.exports = {
  getTikTokProfile,
  getTikTokEarnings,
  calculateEarningsFromViews,
  clearCache,
  clearAllCache,
  healthCheck,
};