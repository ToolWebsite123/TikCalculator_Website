/**
 * TikTok Earnings Calculator
 *
 * We approximate TikCalculator.com's per-post earnings output using
 * realistic CPM ranges seen across Creator Fund / brand deals:
 *   - Tiered by region (Tier1: US/CA/UK/AU/NZ/DE, Tier2: EU/BR/MX/SG, Tier3: rest)
 *   - Adjusted by engagement rate and follower scale
 *   - Returns min/avg/max CPM and earnings so frontend can show a range
 *
 * Final earnings are calculated as: (avgViews / 1000) * CPM
 */

const round = (val, places = 2) =>
  Math.round((Number(val) + Number.EPSILON) * 10 ** places) / 10 ** places;

/**
 * Calculate average views from video array
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
 * Calculate engagement rate from videos
 * Formula B: engagementRate = ((likes + comments + shares) / views) * 100
 */
const calculateEngagementRate = (latestVideos = []) => {
  if (!Array.isArray(latestVideos) || latestVideos.length === 0) return null;

  const videosWithData = latestVideos.filter(
    v => v && Number(v.views) > 0 && (Number(v.likes) > 0 || Number(v.comments) > 0 || Number(v.shares) > 0)
  );

  if (videosWithData.length === 0) return null;

  let totalViews = 0;
  let totalEngagements = 0;

  videosWithData.forEach(v => {
    const views = Number(v.views) || 0;
    const likes = Number(v.likes) || 0;
    const comments = Number(v.comments) || 0;
    const shares = Number(v.shares) || Number(v.share_count) || 0; // Include shares

    totalViews += views;
    totalEngagements += (likes + comments + shares); // Formula B: includes shares
  });

  if (totalViews === 0) return null;

  // Formula B: engagementRate = ((likes + comments + shares) / views) * 100
  const engagementRate = (totalEngagements / totalViews) * 100;
  return engagementRate;
};

// Region-based CPM defaults (USD per 1k views), calibrated closer to TikCalculator
const CPM_TIERS = {
  tier1: { min: 22, avg: 30, max: 42 }, // US, CA, UK, AU, NZ, DE
  tier2: { min: 16, avg: 22, max: 32 }, // Western EU, BR, MX, SG
  tier3: { min: 12, avg: 18, max: 26 },  // Other regions (calibrated upward)
};

const TIER1_CODES = ['US', 'CA', 'UK', 'GB', 'AU', 'NZ', 'DE'];
const TIER2_CODES = ['FR', 'ES', 'IT', 'PT', 'BR', 'MX', 'SG', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'IE', 'CH'];

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Compute CPM range using region, engagement, and follower scale.
 * Returns { min, avg, max, used } where `used` is the avg after adjustments.
 */
const calculateCPMRange = ({ region, engagementRate = 0, followers = 0 }) => {
  const regionCode = (region || '').toString().trim().toUpperCase();
  const base =
    TIER1_CODES.includes(regionCode) ? CPM_TIERS.tier1 :
      TIER2_CODES.includes(regionCode) ? CPM_TIERS.tier2 :
        CPM_TIERS.tier3;

  // Engagement adjustment: 0.9x–1.2x around ~7.5% baseline (0–15% mapped to 0–2)
  const normalizedEngagement = clamp(engagementRate / 7.5, 0, 2);
  const engagementFactor = clamp(0.9 + (normalizedEngagement * 0.15), 0.9, 1.2);

  // Follower scale: uplift only (no penalty) to avoid under-shooting smaller creators
  let followerFactor = 1.0;
  if (followers > 2_000_000) followerFactor = 1.18;
  else if (followers > 500_000) followerFactor = 1.12;
  else if (followers > 100_000) followerFactor = 1.08;
  else if (followers > 10_000) followerFactor = 1.02;

  const adjust = (value) => clamp(value * engagementFactor * followerFactor, 7, 80);

  const min = adjust(base.min);
  const avg = adjust(base.avg);
  const max = adjust(base.max);

  return {
    min: round(min, 2),
    avg: round(avg, 2),
    max: round(max, 2),
    used: round(avg, 2),
    factors: {
      region: regionCode || 'GLOBAL',
      engagementFactor: round(engagementFactor, 3),
      followerFactor: round(followerFactor, 3),
    },
  };
};

const calculatePlatformFactor = () => 1.0;

/**
 * Compute analytics from video data
 * NEVER returns null - always provides fallback values
 */
const computeAnalytics = ({ followers, likes, videos, latestVideos = [] }) => {
  // Try to calculate from real video data first
  if (Array.isArray(latestVideos) && latestVideos.length > 0) {
    const videosWithViews = latestVideos.filter(v => v && Number(v.views) > 0);

    if (videosWithViews.length > 0) {
      const avgViews = averageViewsFromVideos(videosWithViews);
      const engagementRate = calculateEngagementRate(videosWithViews);

      if (avgViews && avgViews > 0) {
        return {
          avgViews: round(avgViews, 2),
          engagementRate: engagementRate ? round(engagementRate, 2) : 0,
          sampleSize: videosWithViews.length,
        };
      }
    }
  }

  // Fallback: Estimate from profile stats (TikCalculator.com method)
  // Use last 12-20 videos average if available, otherwise use followers * 0.08
  let estimatedAvgViews = 0;
  if (followers > 0) {
    // Estimate avgViews as 8% of followers (realistic TikTok average)
    estimatedAvgViews = followers * 0.08;

    // Ensure minimum views for small accounts
    if (estimatedAvgViews < 1000) {
      estimatedAvgViews = Math.max(1000, followers * 0.1);
    }
  } else {
    // Absolute minimum fallback
    estimatedAvgViews = 1000;
  }

  // Estimate engagement from likes/videos
  let estimatedEngagement = 5.0; // Default 5%
  if (likes > 0 && videos > 0 && followers > 0) {
    const avgLikesPerVideo = likes / videos;
    estimatedEngagement = (avgLikesPerVideo / followers) * 100;
    estimatedEngagement = Math.min(Math.max(estimatedEngagement, 1.0), 50); // Clamp between 1% and 50%
  } else if (followers > 0) {
    // Estimate based on follower count (larger accounts typically have lower engagement)
    if (followers > 10_000_000) {
      estimatedEngagement = 2.0;
    } else if (followers > 1_000_000) {
      estimatedEngagement = 3.0;
    } else if (followers > 100_000) {
      estimatedEngagement = 5.0;
    } else {
      estimatedEngagement = 8.0;
    }
  }

  return {
    avgViews: round(estimatedAvgViews, 2),
    engagementRate: round(estimatedEngagement, 2),
    sampleSize: 0,
  };
};

/**
 * Calculate earnings EXACTLY like TikCalculator.com
 * NEVER returns null - always provides valid earnings data
 */
const calculateEarnings = ({
  followers = 0,
  likes = 0,
  videos = 0,
  latestVideos = [],
  region = '',
}) => {
  // Calculate analytics (NEVER returns null)
  let analytics = computeAnalytics({ followers, likes, videos, latestVideos });

  // CRITICAL: Ensure analytics is valid - use fallback if needed
  if (!analytics || !analytics.avgViews || analytics.avgViews <= 0) {
    console.warn('[calcEarnings] ⚠ Analytics invalid, using emergency fallback');
    const emergencyViews = Math.max(followers * 0.08, 1000);
    analytics = {
      avgViews: emergencyViews,
      engagementRate: 5.0,
      sampleSize: 0,
    };
  }

  const { avgViews, engagementRate, sampleSize } = analytics;

  // Ensure avgViews is never 0 (use 0 if truly no views, but ensure it's a number)
  const safeAvgViews = Math.max(avgViews || 0, 0);

  // Dynamic CPM range
  const cpmRange = calculateCPMRange({
    region,
    engagementRate,
    followers,
  });

  // Core earnings calc (per video)
  const earningPerVideo = round((safeAvgViews / 1000) * cpmRange.used, 2);
  const earningPerVideoMin = round((safeAvgViews / 1000) * cpmRange.min, 2);
  const earningPerVideoMax = round((safeAvgViews / 1000) * cpmRange.max, 2);

  const result = {
    earnings: earningPerVideo,
    earningPerVideo,
    estimatedEarnings: earningPerVideo,
    earningsMin: earningPerVideoMin,
    earningsMax: earningPerVideoMax,
    avgViews: round(safeAvgViews, 2),
    engagementRate: round(engagementRate || 0, 2), // Display only
    cpm: cpmRange.used,
    cpmMin: cpmRange.min,
    cpmMax: cpmRange.max,
    platformFactor: calculatePlatformFactor(),
    analytics: {
      avgViews: round(safeAvgViews, 2),
      engagementRate: round(engagementRate || 0, 2),
      sampleSize,
    },
    meta: {
      source: sampleSize > 0 ? 'recentVideos' : 'estimated',
      followers,
      likes,
      videos,
      region,
    },
    cpmRange,
  };

  return result;
};

module.exports = {
  calculateEarnings,
  computeAnalytics,
  averageViewsFromVideos,
  calculateEngagementRate,
  calculateCPMRange,
  calculatePlatformFactor,
};
