/**
 * TikTok Earnings Calculator - Core Logic
 * 
 * Profile-based earnings calculation (NO video scraping)
 * CPM capped at $6 max for realistic estimates
 * Returns earnings as a RANGE (min, avg, max)
 */

// ============================================================================
// CONSTANTS
// ============================================================================

// CPM limits (realistic Creator Fund rates)
const MAX_CPM = 6.0;    // Maximum CPM cap
const MIN_CPM = 0.10;   // Minimum CPM floor
const DEFAULT_CPM = 2.5; // Default CPM if not specified

// Platform share (TikTok takes ~30-50% of Creator Fund earnings)
const DEFAULT_PLATFORM_SHARE = 0.35;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Round to 2 decimal places
 */
const roundTo2 = (num) => Math.round((Number(num) + Number.EPSILON) * 100) / 100;

/**
 * Format number as currency string
 */
const formatCurrency = (num) => `$${Math.round(Number(num) || 0).toLocaleString()}`;

/**
 * Format large numbers with K/M suffix
 */
const formatNumber = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return num.toLocaleString();
};

/**
 * Clamp value between min and max
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// ============================================================================
// MAIN CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate ESTIMATED TikTok earnings from profile stats
 * 
 * Profile-based only (NO video scraping)
 * CPM capped at $6 max for realistic estimates
 * Returns earnings as a RANGE (min, avg, max)
 * 
 * Formula:
 * 1) avgLikes = totalLikes / totalVideos
 * 2) engagementRate = (avgLikes / followers) * 100
 * 3) estimatedViews = followers * (engagementRate / 100)
 * 4) earnings = (views / 1000) * CPM * (1 - platformShare)
 * 
 * @param {Object} params
 * @param {number} params.followers - Follower count
 * @param {number} params.totalLikes - Total likes across all videos
 * @param {number} params.totalVideos - Total video count
 * @param {number} params.cpm - CPM rate (will be capped at $6)
 * @param {number} params.platformShare - Platform share (0-1, default 0.35)
 * @returns {Object} Earnings data with min/avg/max range
 */
const calculateEarnings = ({
  followers,
  totalLikes,
  totalVideos,
  cpm = DEFAULT_CPM,
  platformShare = DEFAULT_PLATFORM_SHARE,
}) => {
  // Parse and validate inputs
  const f = Number(followers) || 0;
  const likes = Number(totalLikes) || 0;
  const vids = Number(totalVideos) || 0;
  
  // CRITICAL: Cap CPM at MAX_CPM ($6) for realistic estimates
  const rawCpm = Number(cpm) > 0 ? Number(cpm) : DEFAULT_CPM;
  const safeCpm = clamp(rawCpm, MIN_CPM, MAX_CPM);
  
  // Validate platform share (0-95%)
  const shareRaw = platformShare >= 0 && platformShare < 1 ? Number(platformShare) : DEFAULT_PLATFORM_SHARE;
  const share = clamp(shareRaw, 0, 0.95);

  console.log('[calcLogic] Input:', {
    followers: f,
    likes,
    videos: vids,
    cpm: safeCpm,
    cpmCapped: rawCpm !== safeCpm,
    platformShare: share,
  });

  // Handle invalid input
  if (f <= 0 || vids <= 0) {
    console.log('[calcLogic] Invalid followers or videos');
    return {
      avgLikes: 0,
      engagementRate: 0,
      views: 0,
      CPM: safeCpm,
      // Earnings RANGE (all zeros for invalid input)
      estimatedEarnings: 0,
      earningPerVideo: 0,
      earningsRange: { min: 0, avg: 0, max: 0 },
      earningsMin: 0,
      earningsMax: 0,
      isEstimated: true,
      error: 'Followers and totalVideos must be greater than zero',
    };
  }

  // Step 1: Calculate average likes per video
  const avgLikes = likes / vids;
  console.log('[calcLogic] avgLikesPerVideo:', avgLikes);

  // Step 2: Calculate engagement rate
  const engagementRate = (avgLikes / f) * 100;
  console.log('[calcLogic] engagementRate:', engagementRate);

  // Step 3: Estimate views per video
  // Formula: views = followers * (engagementRate / 100)
  // With floor of 5% of followers (minimum realistic views)
  let views = f * (engagementRate / 100);
  const floorViews = f * 0.05; // 5% of followers as minimum floor
  const ceilingViews = f * 0.5; // 50% of followers as maximum ceiling
  
  if (!Number.isFinite(views) || views <= 0) {
    console.log('[calcLogic] views invalid, using 5% floor');
    views = floorViews;
  } else {
    views = clamp(views, floorViews, ceilingViews);
  }
  console.log('[calcLogic] estimatedViews:', views);

  // Step 4: Calculate earnings RANGE
  // Formula: earnings = (views / 1000) * CPM * (1 - platformShare)
  const viewsInThousands = views / 1000;
  const netMultiplier = 1 - share;
  
  // CPM range for min/max (±40% of base CPM)
  const cpmMin = clamp(safeCpm * 0.6, MIN_CPM, MAX_CPM);
  const cpmMax = clamp(safeCpm * 1.4, MIN_CPM, MAX_CPM);
  
  const earningMin = roundTo2(viewsInThousands * cpmMin * netMultiplier);
  const earningAvg = roundTo2(viewsInThousands * safeCpm * netMultiplier);
  const earningMax = roundTo2(viewsInThousands * cpmMax * netMultiplier);

  console.log('[calcLogic] Earnings range:', { min: earningMin, avg: earningAvg, max: earningMax });

  // Build result object
  const result = {
    // Analytics
    avgLikes: roundTo2(avgLikes),
    engagementRate: roundTo2(engagementRate),
    views: Math.round(views),
    
    // CPM (capped at $6)
    CPM: roundTo2(safeCpm),
    cpmMin: roundTo2(cpmMin),
    cpmMax: roundTo2(cpmMax),
    
    // ESTIMATED Earnings RANGE (min, avg, max)
    estimatedEarnings: earningAvg,
    earningPerVideo: earningAvg,
    earningsRange: {
      min: earningMin,
      avg: earningAvg,
      max: earningMax,
    },
    earningsMin: earningMin,
    earningsMax: earningMax,
    
    // Metadata
    isEstimated: true, // Always true - these are estimates
    platformShare: roundTo2(share),
  };

  console.log('[calcLogic] ✓ Result:', result);
  return result;
};

// Backward-compatible wrapper
const calculateRevenue = (params) => calculateEarnings(params);

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  calculateEarnings,
  calculateRevenue,
  roundTo2,
  formatCurrency,
  formatNumber,
  // Constants
  MAX_CPM,
  MIN_CPM,
  DEFAULT_CPM,
};
