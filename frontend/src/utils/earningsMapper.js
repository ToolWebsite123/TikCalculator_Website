/**
 * Earnings Data Mapper
 * Maps backend API response to frontend earningsData format
 * Ensures all fields are present and never null/undefined
 */

/**
 * Map earnings data from API response (TikCalculator.com format)
 * @param {object} data - API response data
 * @param {object} profile - Profile data (optional)
 * @returns {object} Mapped earnings data
 */
export const mapEarningsData = (data, profile = {}) => {
  if (!data || typeof data !== 'object') {
    console.warn('[EarningsMapper] ⚠ Invalid data, using fallback');
    return createFallbackEarnings(profile);
  }

  console.log('[EarningsMapper] Mapping earnings data from:', {
    hasAvgViews: !!data.avgViews,
    hasEngagementRate: !!data.engagementRate,
    hasCpm: !!data.cpm,
    hasEstimatedEarnings: !!data.estimatedEarnings,
    hasEarningPerVideo: !!data.earningPerVideo,
    hasAnalytics: !!data.analytics,
    hasEarnings: !!data.earnings,
    dataKeys: Object.keys(data),
  });

  // Extract from root level (earnings endpoint format)
  let avgViews = Number(data.avgViews) || 0;
  let engagementRate = Number(data.engagementRate) || 0;
  let cpm = Number(data.cpm) || 0;
  let cpmMin = Number(data.cpmMin) || 0;
  let cpmMax = Number(data.cpmMax) || 0;
  let platformFactor = Number(data.platformFactor) || 1.0;
  let estimatedEarnings = Number(data.estimatedEarnings) || 0;
  let earningPerVideo = Number(data.earningPerVideo) || 0;
  let earnings = Number(data.earnings) || 0;
  let earningsMin = Number(data.earningsMin) || 0;
  let earningsMax = Number(data.earningsMax) || 0;

  // Extract from analytics object (profile endpoint format)
  if (!avgViews && data.analytics?.avgViews) {
    avgViews = Number(data.analytics.avgViews) || 0;
    console.log('[EarningsMapper] ✓ Extracted avgViews from analytics:', avgViews);
  }
  if (!engagementRate && data.analytics?.engagementRate) {
    engagementRate = Number(data.analytics.engagementRate) || 0;
    console.log('[EarningsMapper] ✓ Extracted engagementRate from analytics:', engagementRate);
  }

  // Extract from earnings object (profile endpoint format)
  if (!cpm && data.earnings?.cpm) {
    cpm = Number(data.earnings.cpm) || 0;
    console.log('[EarningsMapper] ✓ Extracted cpm from earnings object:', cpm);
  }
  if (!platformFactor && data.earnings?.platformFactor) {
    platformFactor = Number(data.earnings.platformFactor) || 1.0;
    console.log('[EarningsMapper] ✓ Extracted platformFactor from earnings object:', platformFactor);
  }
  if (!estimatedEarnings && data.earnings?.perVideo) {
    estimatedEarnings = Number(data.earnings.perVideo) || 0;
    earningPerVideo = estimatedEarnings;
    earnings = estimatedEarnings;
    console.log('[EarningsMapper] ✓ Extracted earnings from earnings.perVideo:', estimatedEarnings);
  }
  if (!estimatedEarnings && data.earnings?.earningPerVideo) {
    estimatedEarnings = Number(data.earnings.earningPerVideo) || 0;
    earningPerVideo = estimatedEarnings;
    earnings = estimatedEarnings;
    console.log('[EarningsMapper] ✓ Extracted earnings from earnings.earningPerVideo:', estimatedEarnings);
  }
  if (!estimatedEarnings && data.earnings?.earnings) {
    estimatedEarnings = Number(data.earnings.earnings) || 0;
    earningPerVideo = estimatedEarnings;
    earnings = estimatedEarnings;
    console.log('[EarningsMapper] ✓ Extracted earnings from earnings.earnings:', estimatedEarnings);
  }

  if (!earningsMin && (data.earnings?.earningsMin || data.earningsMin)) {
    earningsMin = Number(data.earnings?.earningsMin || data.earningsMin) || 0;
  }
  if (!earningsMax && (data.earnings?.earningsMax || data.earningsMax)) {
    earningsMax = Number(data.earnings?.earningsMax || data.earningsMax) || 0;
  }
  if (!cpmMin && (data.earnings?.cpmMin || data.cpmMin)) {
    cpmMin = Number(data.earnings?.cpmMin || data.cpmMin) || 0;
  }
  if (!cpmMax && (data.earnings?.cpmMax || data.cpmMax)) {
    cpmMax = Number(data.earnings?.cpmMax || data.cpmMax) || 0;
  }

  // CRITICAL: If we have avgViews but no earnings, calculate it (TikCalculator.com formula)
  if (avgViews > 0 && (!estimatedEarnings || estimatedEarnings <= 0)) {
    // Calculate CPM if not available (align with backend ranges)
    if (!cpm || cpm <= 0) {
      cpmMin = cpmMin && cpmMin > 0 ? cpmMin : 12;
      cpmMax = cpmMax && cpmMax > 0 ? cpmMax : 35;
      cpm = (cpmMin + cpmMax) / 2;
      console.log('[EarningsMapper] ✓ Calculated CPM range fallback:', { cpmMin, cpm, cpmMax });
    } else {
      cpmMin = cpmMin && cpmMin > 0 ? cpmMin : Math.max(cpm * 0.7, 5);
      cpmMax = cpmMax && cpmMax > 0 ? cpmMax : Math.max(cpm * 1.3, cpmMin + 5);
    }

    if (!platformFactor || platformFactor <= 0) {
      platformFactor = 1.0;
    }

    // Calculate earnings: (avgViews / 1000) * cpm
    estimatedEarnings = (avgViews / 1000) * cpm * platformFactor;
    earningPerVideo = estimatedEarnings;
    earnings = estimatedEarnings;
    earningsMin = (avgViews / 1000) * cpmMin;
    earningsMax = (avgViews / 1000) * cpmMax;
    console.log('[EarningsMapper] ✓✓✓ Calculated earnings from avgViews:', {
      avgViews,
      cpm,
      cpmMin,
      cpmMax,
      platformFactor,
      earnings: estimatedEarnings,
      earningsMin,
      earningsMax,
      formula: `(${avgViews} / 1000) * CPM`,
    });
  }

  // Extract monthly earnings if available (backend now sends total monthly as primary)
  const monthlyEarning = Number(data.monthlyEarning || data.monthlyEarnings) || 0;
  const monthlyMin = Number(data.monthlyMin) || 0;
  const monthlyMax = Number(data.monthlyMax) || 0;
  
  // Determine primary earnings: Use monthly total if available, otherwise calculate from per-video
  // Backend now sends monthly total as primary earnings field
  const primaryEarnings = monthlyEarning > 0 
    ? monthlyEarning 
    : (earnings || estimatedEarnings || earningPerVideo * 20 || 0);
  
  const primaryEarningsMin = monthlyMin > 0 
    ? monthlyMin 
    : (earningsMin || (earningPerVideo || 0) * 20 * 0.8 || 0);
  
  const primaryEarningsMax = monthlyMax > 0 
    ? monthlyMax 
    : (earningsMax || (earningPerVideo || 0) * 20 * 1.25 || 0);
  
  // Per video earnings (for reference/display)
  const perVideoValue = earningPerVideo > 0 
    ? earningPerVideo 
    : (primaryEarnings / 20 || 0);
  
  // Ensure all values are valid numbers (never 0 unless truly 0)
  const mappedData = {
    success: true,
    // Primary earnings - NOW SHOWS TOTAL (monthly) instead of per video
    earnings: Math.max(primaryEarnings, 0.01),
    estimatedEarnings: Math.max(primaryEarnings, 0.01),
    earningsMin: Math.max(primaryEarningsMin, 0),
    earningsMax: Math.max(primaryEarningsMax, 0),
    // Per video earnings (kept for reference)
    earningPerVideo: Math.max(perVideoValue, 0.01),
    perVideoNet: Math.max(perVideoValue, 0.01),
    // Monthly/Total earnings (aliases)
    monthlyEarning: Math.max(primaryEarnings, 0.20),
    monthlyEarnings: Math.max(primaryEarnings, 0.20),
    // Other fields
    avgViews: Math.max(avgViews, 0),
    engagementRate: Math.max(engagementRate, 0),
    cpm: Math.max(cpm, 0.8), // Keep a reasonable floor
    cpmMin: Math.max(cpmMin || cpm * 0.7, 0.8),
    cpmMax: Math.max(cpmMax || cpm * 1.3, cpmMin || cpm, 1.0),
    CPM: Math.max(cpm, 0.8),
    platformFactor: Math.max(platformFactor, 1.0),
    username: data.username || profile?.username || '',
    followers: Number(data.followers || profile?.followers || 0),
    likes: Number(data.likes || profile?.likes || 0),
    following: Number(data.following || profile?.following || 0),
    videos: Number(data.videos || profile?.videos || 0),
  };

  console.log('[EarningsMapper] ========================================');
  console.log('[EarningsMapper] ✓✓✓ MAPPED EARNINGS DATA:');
  console.log('[EarningsMapper]   - earnings:', mappedData.earnings);
  console.log('[EarningsMapper]   - estimatedEarnings:', mappedData.estimatedEarnings);
  console.log('[EarningsMapper]   - avgViews:', mappedData.avgViews);
  console.log('[EarningsMapper]   - engagementRate:', mappedData.engagementRate);
  console.log('[EarningsMapper]   - cpm:', mappedData.cpm);
  console.log('[EarningsMapper]   - platformFactor:', mappedData.platformFactor);
  console.log('[EarningsMapper] ========================================');

  return mappedData;
};

/**
 * Create fallback earnings data
 * @param {object} profile - Profile data
 * @returns {object} Fallback earnings data
 */
const createFallbackEarnings = (profile = {}) => {
  const fallbackViews = Math.max((profile.followers || 0) * 0.08, 1000);
  const fallbackCPM = 0.8;
  const fallbackPlatformFactor = 1.0;
  const fallbackEarnings = (fallbackViews / 1000) * fallbackCPM * fallbackPlatformFactor;

  return {
    success: true,
    earnings: Math.max(fallbackEarnings, 0.01),
    earningPerVideo: Math.max(fallbackEarnings, 0.01),
    estimatedEarnings: Math.max(fallbackEarnings, 0.01),
    perVideoNet: Math.max(fallbackEarnings, 0.01),
    avgViews: fallbackViews,
    engagementRate: 5.0,
    cpm: fallbackCPM,
    CPM: fallbackCPM,
    platformFactor: fallbackPlatformFactor,
    monthlyEarning: Math.max(fallbackEarnings * 20, 0.20),
    monthlyEarnings: Math.max(fallbackEarnings * 20, 0.20),
    username: profile?.username || '',
    followers: profile?.followers || 0,
    likes: profile?.likes || 0,
    following: profile?.following || 0,
    videos: profile?.videos || 0,
    source: 'fallback',
  };
};








