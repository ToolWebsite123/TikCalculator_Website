/**
 * TikTok Earnings Calculator (Profile-Based Only)
 * 
 * Calculates ESTIMATED earnings based on profile stats.
 * NO video scraping - uses profile followers, likes, videos count.
 * 
 * CPM Range: $0.50 - $6.00 (realistic Creator Fund rates)
 * Returns earnings as a RANGE (min, avg, max) - all clearly marked as "estimated"
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Round a number to specified decimal places
 */
const round = (val, places = 2) =>
  Math.round((Number(val) + Number.EPSILON) * 10 ** places) / 10 ** places;

/**
 * Clamp a value between min and max
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Safe number conversion with fallback
 */
const safeNum = (val, fallback = 0) =>
  Number.isFinite(Number(val)) ? Number(val) : fallback;

// ============================================================================
// CPM CONFIGURATION (Capped at max $6 for realistic estimates)
// ============================================================================

/**
 * CPM Tiers by Region (USD per 1000 views)
 * 
 * IMPORTANT: These are REALISTIC Creator Fund CPM rates
 * - Tier 1 (High CPM): US, UK, Canada, Australia, Germany
 * - Tier 2 (Medium CPM): Western Europe, Brazil, Mexico
 * - Tier 3 (Lower CPM): Rest of world
 * 
 * MAX CPM CAPPED AT $6.00 for realistic estimates
 */
const CPM_TIERS = {
  tier1: { min: 0.80, avg: 2.50, max: 6.00 },  // US, CA, UK, AU, DE
  tier2: { min: 0.50, avg: 1.50, max: 4.00 },  // EU, BR, MX
  tier3: { min: 0.20, avg: 0.80, max: 2.50 },  // Other regions
};

// High-value regions (Tier 1)
const TIER1_CODES = ['US', 'CA', 'UK', 'GB', 'AU', 'NZ', 'DE'];

// Medium-value regions (Tier 2)
const TIER2_CODES = ['FR', 'ES', 'IT', 'PT', 'BR', 'MX', 'SG', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'IE', 'CH'];

// Maximum CPM cap (never exceed this for realistic estimates)
const MAX_CPM_CAP = 6.00;
const MIN_CPM_FLOOR = 0.10;

// ============================================================================
// CPM CALCULATION
// ============================================================================

/**
 * Calculate CPM range based on region, engagement, and follower count
 * 
 * @param {Object} params
 * @param {string} params.region - Country/region code (e.g., 'US', 'UK')
 * @param {number} params.engagementRate - Engagement rate percentage (0-100)
 * @param {number} params.followers - Total follower count
 * @returns {Object} CPM range { min, avg, max, used }
 */
const calculateCPMRange = ({ region = '', engagementRate = 0, followers = 0 }) => {
  const regionCode = (region || '').toString().trim().toUpperCase();
  
  // Select base CPM tier based on region
  const baseTier = TIER1_CODES.includes(regionCode)
    ? CPM_TIERS.tier1
    : TIER2_CODES.includes(regionCode)
      ? CPM_TIERS.tier2
      : CPM_TIERS.tier3;

  // Engagement adjustment: 0.85x to 1.15x (subtle adjustment)
  // Higher engagement = slightly higher CPM
  const normalizedEngagement = clamp(engagementRate / 10, 0, 2); // 0-10% maps to 0-1, 10-20% maps to 1-2
  const engagementFactor = clamp(0.85 + (normalizedEngagement * 0.15), 0.85, 1.15);

  // Follower scale: Small uplift for larger accounts (brand deal potential)
  let followerFactor = 1.0;
  if (followers > 5_000_000) followerFactor = 1.10;
  else if (followers > 1_000_000) followerFactor = 1.08;
  else if (followers > 500_000) followerFactor = 1.05;
  else if (followers > 100_000) followerFactor = 1.02;

  // Calculate adjusted CPM values
  const adjustCPM = (value) => {
    const adjusted = value * engagementFactor * followerFactor;
    // CRITICAL: Cap CPM at MAX_CPM_CAP ($6) for realistic estimates
    return clamp(adjusted, MIN_CPM_FLOOR, MAX_CPM_CAP);
  };

  const min = adjustCPM(baseTier.min);
  const avg = adjustCPM(baseTier.avg);
  const max = adjustCPM(baseTier.max);

  return {
    min: round(min, 2),
    avg: round(avg, 2),
    max: round(max, 2),
    used: round(avg, 2), // Use average for main calculation
    factors: {
      region: regionCode || 'GLOBAL',
      tier: TIER1_CODES.includes(regionCode) ? 1 : TIER2_CODES.includes(regionCode) ? 2 : 3,
      engagementFactor: round(engagementFactor, 3),
      followerFactor: round(followerFactor, 3),
    },
  };
};

// ============================================================================
// ANALYTICS CALCULATION (Profile-Based)
// ============================================================================

/**
 * Compute analytics from profile stats (NO video scraping)
 * 
 * Estimates avgViews and engagementRate from:
 * - followers count
 * - total likes
 * - total videos
 * 
 * @param {Object} params
 * @returns {Object} { avgViews, engagementRate, sampleSize: 0 }
 */
const computeAnalytics = ({ followers = 0, likes = 0, videos = 0 }) => {
  const f = safeNum(followers, 0);
  const l = safeNum(likes, 0);
  const v = safeNum(videos, 0);

  console.log('[calcEarnings] Computing profile-based analytics:', { followers: f, likes: l, videos: v });

  // Estimate average views per video
  // Formula: avgViews = followers * viewRate (typically 5-15% of followers)
  let estimatedAvgViews = 0;
  
  if (f > 0) {
    // View rate varies by account size (smaller accounts often have higher relative views)
    let viewRate = 0.08; // Default 8%
    
    if (f > 10_000_000) viewRate = 0.03;      // 3% for mega accounts
    else if (f > 1_000_000) viewRate = 0.05;  // 5% for large accounts
    else if (f > 100_000) viewRate = 0.08;    // 8% for medium accounts
    else if (f > 10_000) viewRate = 0.12;     // 12% for small accounts
    else viewRate = 0.15;                      // 15% for micro accounts
    
    estimatedAvgViews = f * viewRate;
    
    // Minimum floor for very small accounts
    estimatedAvgViews = Math.max(estimatedAvgViews, 500);
  } else {
    estimatedAvgViews = 500; // Absolute minimum fallback
  }

  // Estimate engagement rate from profile stats
  // Formula: engagementRate = (avgLikes / followers) * 100
  let estimatedEngagement = 5.0; // Default 5%
  
  if (l > 0 && v > 0 && f > 0) {
    const avgLikesPerVideo = l / v;
    estimatedEngagement = (avgLikesPerVideo / f) * 100;
    // Clamp to realistic range (0.5% - 30%)
    estimatedEngagement = clamp(estimatedEngagement, 0.5, 30);
  } else if (f > 0) {
    // Estimate based on follower count (larger accounts = lower engagement typically)
    if (f > 10_000_000) estimatedEngagement = 2.0;
    else if (f > 1_000_000) estimatedEngagement = 3.5;
    else if (f > 100_000) estimatedEngagement = 5.0;
    else if (f > 10_000) estimatedEngagement = 7.0;
    else estimatedEngagement = 10.0;
  }

  const result = {
    avgViews: round(estimatedAvgViews, 0),
    engagementRate: round(estimatedEngagement, 2),
    sampleSize: 0, // Always 0 since we're not using video data
    source: 'profile-estimated',
  };

  console.log('[calcEarnings] ✓ Profile analytics:', result);
  return result;
};

// ============================================================================
// MAIN EARNINGS CALCULATION
// ============================================================================

/**
 * Calculate ESTIMATED earnings from profile stats
 * 
 * Returns earnings as a RANGE (min, avg, max) - all marked as "estimated"
 * NO video scraping - profile-based only
 * CPM capped at $6 max for realistic estimates
 * 
 * @param {Object} params
 * @param {number} params.followers - Follower count
 * @param {number} params.likes - Total likes
 * @param {number} params.videos - Total videos
 * @param {string} params.region - Country/region code
 * @returns {Object} Earnings data with min/avg/max range
 */
const calculateEarnings = ({
  followers = 0,
  likes = 0,
  videos = 0,
  region = '',
}) => {
  console.log('[calcEarnings] ========================================');
  console.log('[calcEarnings] Starting PROFILE-BASED calculation');
  console.log('[calcEarnings] Input:', { followers, likes, videos, region });

  // Step 1: Compute analytics from profile stats
  const analytics = computeAnalytics({ followers, likes, videos });
  const { avgViews, engagementRate } = analytics;

  // Step 2: Calculate CPM range (capped at $6 max)
  const cpmRange = calculateCPMRange({
    region,
    engagementRate,
    followers,
  });

  // Step 3: Calculate earnings RANGE (min, avg, max)
  // Formula: earnings = (avgViews / 1000) * CPM
  const viewsInThousands = avgViews / 1000;
  
  const estimatedEarningsMin = round(viewsInThousands * cpmRange.min, 2);
  const estimatedEarningsAvg = round(viewsInThousands * cpmRange.used, 2);
  const estimatedEarningsMax = round(viewsInThousands * cpmRange.max, 2);

  // Build result object - all earnings clearly marked as "estimated"
  const result = {
    // Primary earnings (use average as main value)
    estimatedEarnings: estimatedEarningsAvg,
    earningPerVideo: estimatedEarningsAvg,
    
    // Earnings RANGE (min, avg, max)
    earningsRange: {
      min: estimatedEarningsMin,
      avg: estimatedEarningsAvg,
      max: estimatedEarningsMax,
    },
    
    // Legacy fields for backward compatibility
    earnings: estimatedEarningsAvg,
    earningsMin: estimatedEarningsMin,
    earningsMax: estimatedEarningsMax,
    
    // Analytics data
    avgViews: round(avgViews, 0),
    engagementRate: round(engagementRate, 2),
    
    // CPM data (capped at $6 max)
    cpm: cpmRange.used,
    cpmMin: cpmRange.min,
    cpmMax: cpmRange.max,
    cpmRange,
    
    // Metadata
    analytics: {
      avgViews: round(avgViews, 0),
      engagementRate: round(engagementRate, 2),
      sampleSize: 0,
    },
    meta: {
      source: 'profile-estimated',
      isEstimated: true, // Always true - these are estimates
      followers,
      likes,
      videos,
      region: region || 'GLOBAL',
      maxCpmUsed: MAX_CPM_CAP,
    },
    
    // Platform factor (always 1.0 - no adjustment)
    platformFactor: 1.0,
  };

  // Log calculation details
  console.log('[calcEarnings] ========================================');
  console.log('[calcEarnings] ✓ ESTIMATED EARNINGS CALCULATED');
  console.log('[calcEarnings] Formula: (avgViews / 1000) * CPM');
  console.log('[calcEarnings] Step 1: avgViews =', avgViews);
  console.log('[calcEarnings] Step 2: CPM range =', { min: cpmRange.min, avg: cpmRange.used, max: cpmRange.max });
  console.log('[calcEarnings] Step 3: Earnings range =', result.earningsRange);
  console.log('[calcEarnings] ========================================');

  return result;
};

// ============================================================================
// LEGACY SUPPORT FUNCTIONS
// ============================================================================

/**
 * Calculate average views from video array (legacy support)
 * Note: This function exists for backward compatibility but
 * the main calculation is profile-based only
 */
const averageViewsFromVideos = (latestVideos = []) => {
  if (!Array.isArray(latestVideos) || latestVideos.length === 0) return null;
  
  const viewCounts = latestVideos
    .map((v) => Number(v?.views) || 0)
    .filter((v) => v > 0);
  
  if (viewCounts.length === 0) return null;
  
  const sum = viewCounts.reduce((acc, v) => acc + v, 0);
  return sum / viewCounts.length;
};

/**
 * Calculate engagement rate from videos (legacy support)
 */
const calculateEngagementRate = (latestVideos = []) => {
  if (!Array.isArray(latestVideos) || latestVideos.length === 0) return null;
  
  const videosWithData = latestVideos.filter(
    v => v && Number(v.views) > 0 && (Number(v.likes) > 0 || Number(v.comments) > 0)
  );
  
  if (videosWithData.length === 0) return null;
  
  let totalViews = 0;
  let totalEngagements = 0;
  
  videosWithData.forEach(v => {
    const views = Number(v.views) || 0;
    const likes = Number(v.likes) || 0;
    const comments = Number(v.comments) || 0;
    
    totalViews += views;
    totalEngagements += (likes + comments);
  });
  
  if (totalViews === 0) return null;
  
  return (totalEngagements / totalViews) * 100;
};

/**
 * Platform factor (always 1.0)
 */
const calculatePlatformFactor = () => 1.0;

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  calculateEarnings,
  computeAnalytics,
  calculateCPMRange,
  calculatePlatformFactor,
  // Legacy exports
  averageViewsFromVideos,
  calculateEngagementRate,
  // Constants (for testing)
  MAX_CPM_CAP,
  MIN_CPM_FLOOR,
  CPM_TIERS,
};
