/**
 * TikTok Earnings Calculator - Utility Functions
 * 
 * Profile-based earnings calculation (NO video scraping)
 * CPM capped at $6 max for realistic estimates
 * Returns earnings as a RANGE (min, avg, max)
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_CPM = 6.0;    // Maximum CPM cap
const MIN_CPM = 0.10;   // Minimum CPM floor

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safe number conversion with fallback
 */
const safeNum = (val, fallback = 0) =>
  Number.isFinite(Number(val)) ? Number(val) : fallback;

/**
 * Clamp value between min and max
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Round to specified decimal places
 */
const round = (val, places = 2) =>
  Math.round((Number(val) + Number.EPSILON) * 10 ** places) / 10 ** places;

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
 * - estimatedViews = (followers * 0.12) + (likes * 0.013) + (videos * 22)
 * - Scaled down by 0.2 for realistic estimates
 * - CPM tiered by estimated views (capped at $6)
 * - engagementBoost = engagementRate / 120
 * - earnings = (estimatedViews / 1000) * CPM * 0.55
 * 
 * @param {Object} params
 * @param {number} params.followers - Follower count
 * @param {number} params.likes - Total likes
 * @param {number} params.videos - Total videos
 * @param {number} params.engagementRate - Engagement rate percentage
 * @returns {Object} Earnings data with min/avg/max range
 */
const calculateTikTokEarnings = ({
  followers,
  likes,
  videos,
  engagementRate,
} = {}) => {
  const f = safeNum(followers, 0);
  const l = safeNum(likes, 0);
  const v = safeNum(videos, 0);
  const er = safeNum(engagementRate, 0);

  // Step 1: Estimate views from profile stats
  const rawViews = f * 0.12 + l * 0.013 + v * 22;
  
  // Scale down for realistic estimates
  let estimatedViews = rawViews * 0.2;
  
  // Cap unrealistic spikes
  const maxViewsCap = f > 0 ? f * 1.5 : 2_000_000;
  estimatedViews = clamp(estimatedViews, 0, maxViewsCap);

  // Step 2: Determine base CPM (tiered by views, CAPPED AT $6)
  let baseCPM = 1.5; // Default for small accounts
  if (estimatedViews >= 5_000_000) baseCPM = 4.0;
  else if (estimatedViews >= 1_000_000) baseCPM = 3.0;
  else if (estimatedViews >= 100_000) baseCPM = 2.0;
  
  // Step 3: Apply engagement boost (subtle adjustment)
  const engagementBoost = clamp(er / 120, 0, 0.5); // Max 50% boost
  let finalCPM = baseCPM * (1 + engagementBoost);
  
  // CRITICAL: Cap CPM at MAX_CPM ($6)
  finalCPM = clamp(finalCPM, MIN_CPM, MAX_CPM);

  // Step 4: Calculate earnings RANGE
  // Formula: earnings = (views / 1000) * CPM * 0.55 (net after platform share)
  const viewsInThousands = estimatedViews / 1000;
  const netMultiplier = 0.55; // ~45% platform share
  
  // CPM range (±30% of final CPM)
  const cpmMin = clamp(finalCPM * 0.7, MIN_CPM, MAX_CPM);
  const cpmMax = clamp(finalCPM * 1.3, MIN_CPM, MAX_CPM);
  
  const earningsMin = round(viewsInThousands * cpmMin * netMultiplier, 2);
  const earningsAvg = round(viewsInThousands * finalCPM * netMultiplier, 2);
  const earningsMax = round(viewsInThousands * cpmMax * netMultiplier, 2);

  return {
    // Views estimate
    estimatedViews: round(estimatedViews, 0),
    
    // CPM (capped at $6)
    CPM: round(finalCPM, 2),
    cpmMin: round(cpmMin, 2),
    cpmMax: round(cpmMax, 2),
    
    // ESTIMATED Earnings RANGE
    estimatedEarnings: earningsAvg,
    earningsPerVideo: earningsAvg,
    earningsRange: {
      min: earningsMin,
      avg: earningsAvg,
      max: earningsMax,
    },
    earningsMin,
    earningsMax,
    
    // Metadata
    isEstimated: true,
    meta: {
      baseCPM: round(baseCPM, 2),
      engagementBoost: round(engagementBoost, 3),
      cappedAt: maxViewsCap,
      maxCpmUsed: MAX_CPM,
    },
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  calculateTikTokEarnings,
  safeNum,
  clamp,
  round,
  MAX_CPM,
  MIN_CPM,
};
