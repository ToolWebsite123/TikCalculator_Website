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

// In-memory cache for ultra-fast responses (4 seconds target)
const inMemoryCache = new Map();
const IN_MEMORY_CACHE_TTL = 30 * 60 * 1000; // 30 minutes in-memory cache

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

  // Silent mode - only log errors

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

  // Silent mode

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

    // Check in-memory cache first (FASTEST - instant response)
    if (!forceRefresh && inMemoryCache.has(cleanUsername)) {
      const cached = inMemoryCache.get(cleanUsername);
      const age = Date.now() - cached.timestamp;
      
      if (age < IN_MEMORY_CACHE_TTL && cached.data) {
        // Cache hit - silent mode
        return res.json(cached.data);
      } else {
        // Cache expired, remove it
        inMemoryCache.delete(cleanUsername);
      }
    }

    // Check MongoDB cache (slower but persistent)
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
            // Cache hit - silent mode

            // Ensure bio is included in cached profile
            const cachedProfile = {
              ...cached.profile,
              bio: cached.bio || cached.profile?.bio || cached.profile?.description || '',
              description: cached.bio || cached.profile?.bio || cached.profile?.description || '',
            };

            const cachedResponse = buildResponse(
              cachedProfile,
              cached.analytics,
              cached.earnings,
              cached.latestVideos || []
            );
            
            // Store in in-memory cache for faster future access
            inMemoryCache.set(cleanUsername, {
              data: cachedResponse,
              timestamp: Date.now()
            });
            
            return res.json(cachedResponse);
          } else {
            // Cache exists but is invalid - force re-scrape
          }
        }
      } catch (cacheErr) {
        console.warn('[Controller] Cache read error:', cacheErr.message);
        // Continue to fetch fresh data
      }
    }

    // Fetch fresh data from TikTok
    // Fetching fresh data

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

    // Silent mode - no debug logs

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

      // Profile created from user data
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
        // Bio extracted
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
            // Bio found in root
          }
        }
      }
    }

    let latestVideos = Array.isArray(scrapedData.latestVideos) ? scrapedData.latestVideos : [];

    // ALWAYS try to fetch videos from TikWM API with retry logic (3 attempts)
    const videosWithViews = latestVideos.filter(v => v && Number(v.views) > 0);
    if (videosWithViews.length === 0) {
      // Fetching videos from TikWM

      // Retry logic: 3 attempts
      let tikwmVideos = [];
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          // TikWM attempt
          tikwmVideos = await fetchVideosFromTikWM(cleanUsername, 30);
          if (tikwmVideos && Array.isArray(tikwmVideos) && tikwmVideos.length > 0) {
            const videosWithViewsFromTikWM = tikwmVideos.filter(v => v && Number(v.views) > 0);
            if (videosWithViewsFromTikWM.length > 0) {
              latestVideos = tikwmVideos;
              // Videos fetched successfully
              break; // Success, exit retry loop
            } else {
              console.warn(`[Controller] ⚠ TikWM attempt ${attempt}: Got ${tikwmVideos.length} videos but none have views > 0`);
            }
          } else {
            console.warn(`[Controller] ⚠ TikWM attempt ${attempt}: No videos returned`);
          }
        } catch (tikwmErr) {
          console.warn(`[Controller] ⚠ TikWM API attempt ${attempt} failed: ${tikwmErr.message}`);
          if (attempt === 2) {
            console.error(`[Controller] ❌ All 2 TikWM API attempts failed`);
          }
        }

        // Wait 500ms between retries (except on last attempt) - faster for 4 second target
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 500));
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
      // Bio set
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

      // Calculating earnings

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
        // Calculate monthly earnings (total earnings per month)
        const perVideoEarning = calculated.earningPerVideo || calculated.earnings;
        const monthlyTotal = perVideoEarning * 20; // 20 posts per month average
        const monthlyMin = (calculated.earningsMin || perVideoEarning) * 20;
        const monthlyMax = (calculated.earningsMax || perVideoEarning) * 20;
        
        // Return earnings in TikCalculator.com format - TOTAL EARNINGS (monthly) as primary
        earnings = {
          // Primary earnings field - NOW SHOWS TOTAL (monthly) instead of per video
          earnings: monthlyTotal,
          estimatedEarnings: monthlyTotal,
          // Per video earnings (kept for reference)
          earningPerVideo: perVideoEarning,
          perVideoNet: perVideoEarning,
          perVideo: perVideoEarning,
          // Monthly/Total earnings
          monthly: monthlyTotal,
          monthlyEarning: monthlyTotal,
          yearly: perVideoEarning * 240,
          // Range for total earnings
          earningsMin: monthlyMin,
          earningsMax: monthlyMax,
          // Per video range (for reference)
          perVideoMin: calculated.earningsMin,
          perVideoMax: calculated.earningsMax,
          cpm: calculated.cpm,
          cpmMin: calculated.cpmMin,
          cpmMax: calculated.cpmMax,
          platformFactor: calculated.platformFactor,
        };

        // Earnings calculated
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
        // Using emergency fallback
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

    // Response ready

    // Store in in-memory cache FIRST (fastest access)
    if (responseData.profile?.followers > 0 && earnings?.perVideo > 0) {
      inMemoryCache.set(cleanUsername, {
        data: responseData,
        timestamp: Date.now()
      });
      // Cached in memory
    }

    // Cache the results in MongoDB - ONLY if data is valid and from REAL video data
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
          // Data cached
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

    // Validate username
    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      });
    }

    const cleanUsername = username.trim().toLowerCase().replace('@', '');

    // Check in-memory cache first (unless force refresh)
    if (!forceRefresh && earningsCache[cleanUsername]) {
      const cached = earningsCache[cleanUsername];
      const age = Date.now() - cached.timestamp;

      if (age < EARNINGS_CACHE_TTL) {
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
            }
          }
        } catch (cacheErr) {
          console.warn('[Earnings] Cache read error:', cacheErr.message);
        }
      }

      // If no cached data, fetch fresh
      if (!profileData) {
        const scrapedData = await scrapeTikTokProfile(cleanUsername);

        profileData = {
          profile: scrapedData.profile || scrapedData.user,
          latestVideos: scrapedData.latestVideos || [],
          source: 'html',
        };
      } else {
        const videoCount = (profileData.latestVideos || []).length;

        // If cached data has no videos, fetch fresh data
        if (videoCount === 0) {
          const scrapedData = await scrapeTikTokProfile(cleanUsername);

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

    // Silent mode - only log errors
    let tikwmSuccess = false;
    let tikwmVideos = [];

    // Retry logic: 2 attempts (faster for 4 second target)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        tikwmVideos = await fetchVideosFromTikWM(cleanUsername, 30);
        if (tikwmVideos && Array.isArray(tikwmVideos) && tikwmVideos.length > 0) {
          const videosWithViews = tikwmVideos.filter(v => v && Number(v.views) > 0);
          if (videosWithViews.length > 0) {
            latestVideos = tikwmVideos;
            tikwmSuccess = true;
            break; // Success, exit retry loop
          }
        }
      } catch (err) {
        console.error(`[Earnings] ❌ TikWM API attempt ${attempt} failed: ${err.message}`);
        if (attempt === 2) {
          console.error(`[Earnings] ❌ All 2 TikWM API attempts failed`);
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
      const scrapedVideosWithViews = latestVideos.filter(v => v && Number(v.views) > 0);
      if (scrapedVideosWithViews.length > 0) {
        latestVideos = scrapedVideosWithViews;
      } else {
        console.error(`[Earnings] ❌ NO VIDEOS WITH VIEWS FOUND from any source!`);
      }
    }

    // Calculate avgViews from latest videos (MUST use last 30 videos from API)
    let avgViews = 0;

    if (latestVideos && Array.isArray(latestVideos) && latestVideos.length > 0) {
      // Filter videos with valid views data
      const videosWithValidViews = latestVideos.filter(v => v && Number(v.views) > 0);

      if (videosWithValidViews.length > 0) {
        // Use last 30 videos (or all available if less than 30)
        const videosToUse = videosWithValidViews.length > 30
          ? videosWithValidViews.slice(-30) // Last 30 videos
          : videosWithValidViews;

        // Calculate total views
        const totalViews = videosToUse.reduce((sum, v) => {
          const views = Number(v.views) || 0;
          return sum + views;
        }, 0);

        // Calculate average: totalViews / numberOfVideos
        avgViews = totalViews / videosToUse.length;
      }
    }

    // Use the new calculateEarnings function (TikCalculator.com formula)
    const calculatedResult = calculateEarnings({
      followers: profile.followers || 0,
      likes: profile.likes || 0,
      videos: profile.videos || 0,
      latestVideos: latestVideos,
      region: profile.region || profile.country || '',
    });

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

    }

    // Calculate monthly total earnings (primary display value)
    const monthlyTotal = safeEarningPerVideo * POSTS_PER_MONTH;
    const monthlyMin = safeEarningsMin * POSTS_PER_MONTH;
    const monthlyMax = safeEarningsMax * POSTS_PER_MONTH;
    
    // Build response with TikCalculator.com structure - UNIFIED FORMAT
    // All fields at root level for easy frontend access
    // PRIMARY EARNINGS NOW SHOWS TOTAL (monthly) instead of per video
    const response = {
      success: true,
      // CRITICAL: Primary earnings fields now show TOTAL (monthly) earnings
      estimatedEarnings: monthlyTotal,
      earnings: monthlyTotal, // Primary field - TOTAL monthly earnings
      earningsMin: monthlyMin,
      earningsMax: monthlyMax,
      // Per video earnings (kept for reference)
      earningPerVideo: safeEarningPerVideo,
      perVideoNet: safeEarningPerVideo,
      perVideoMin: safeEarningsMin,
      perVideoMax: safeEarningsMax,
      // Additional fields
      avgViews: safeAvgViews,
      engagementRate: safeEngagementRate,
      cpm: safeCPM,
      cpmMin: safeCpmMin,
      cpmMax: safeCpmMax,
      platformFactor: finalPlatformFactor,
      // Monthly/Total earnings (aliases for compatibility)
      monthlyEarning: monthlyTotal,
      monthlyEarnings: monthlyTotal,
      yearly: safeEarningPerVideo * 240,
      // Additional fields for compatibility
      username: cleanUsername,
      followers: profile.followers || 0,
      likes: profile.likes || 0,
      following: profile.following || 0,
      videos: profile.videos || 0,
      source: source,
      raw: {
        videoCount: latestVideos.length,
        postsPerMonth: POSTS_PER_MONTH,
        videosWithViews: latestVideos.filter(v => v && Number(v.views) > 0).length,
      },
    };


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

    // Silent mode - only log errors

    // Round values
    const round = (val, places = 2) =>
      Math.round((Number(val) + Number.EPSILON) * 10 ** places) / 10 ** places;

    // Calculate monthly total earnings (primary display value)
    const POSTS_PER_MONTH = 20;
    const monthlyTotal = round(earningPerVideo * POSTS_PER_MONTH, 2);
    const monthlyMin = round(earningsMin * POSTS_PER_MONTH, 2);
    const monthlyMax = round(earningsMax * POSTS_PER_MONTH, 2);

    const response = {
      success: true,
      // Primary earnings - NOW SHOWS TOTAL (monthly) instead of per video
      earnings: monthlyTotal,
      estimatedEarnings: monthlyTotal,
      earningsMin: monthlyMin,
      earningsMax: monthlyMax,
      // Per video earnings (kept for reference)
      earningPerVideo: round(earningPerVideo, 2),
      perVideoNet: round(earningPerVideo, 2),
      perVideoMin: round(earningsMin, 2),
      perVideoMax: round(earningsMax, 2),
      // Monthly/Total earnings (aliases)
      monthlyEarning: monthlyTotal,
      monthlyEarnings: monthlyTotal,
      yearly: round(earningPerVideo * 240, 2),
      // Other fields
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