const {
  calculateEarnings,
  computeAnalytics,
  averageViewsFromVideos,
  calculateEngagementRate,
  calculateCPMRange,
} = require('./calcEarnings');

describe('averageViewsFromVideos', () => {
  it('returns arithmetic mean across positive-view videos', () => {
    const avg = averageViewsFromVideos([{ views: 100 }, { views: 300 }, { views: 0 }]);
    expect(avg).toBe(200);
  });

  it('returns null when video list is empty or has no views', () => {
    expect(averageViewsFromVideos([])).toBeNull();
    expect(averageViewsFromVideos([{ views: 0 }])).toBeNull();
  });
});

describe('calculateEngagementRate (Formula B)', () => {
  it('computes (likes + comments + shares) / views * 100 across videos', () => {
    const rate = calculateEngagementRate([
      { views: 1000, likes: 70, comments: 20, shares: 10 },
      { views: 2000, likes: 160, comments: 30, shares: 10 },
    ]);
    // total engagements = 100 + 200 = 300; total views = 3000 -> 10%
    expect(rate).toBeCloseTo(10, 4);
  });
});

describe('calculateCPMRange', () => {
  it('applies Tier 1, Tier 2, and Tier 3 regional baseline CPMs and multipliers', () => {
    const neutralTier1 = calculateCPMRange({ region: 'US', engagementRate: 5.0, followers: 5000 });
    // At 5.0% engagement (5/7.5 = 0.6667 -> 0.9 + 0.1 = 1.0x) and <=10k followers (1.0x)
    expect(neutralTier1.min).toBe(22);
    expect(neutralTier1.avg).toBe(30);
    expect(neutralTier1.max).toBe(42);

    const neutralTier2 = calculateCPMRange({ region: 'BR', engagementRate: 5.0, followers: 5000 });
    expect(neutralTier2.avg).toBe(22);

    const neutralTier3 = calculateCPMRange({ region: 'XX', engagementRate: 5.0, followers: 5000 });
    expect(neutralTier3.avg).toBe(18);
  });

  it('clamps adjusted CPM strictly between $7.00 and $80.00', () => {
    const maxClamped = calculateCPMRange({ region: 'US', engagementRate: 25, followers: 5_000_000 });
    // 42 * 1.2 * 1.18 = 59.47 (< 80) -> avg 30 * 1.2 * 1.18 = 42.48
    expect(maxClamped.avg).toBeCloseTo(42.48, 2);
    expect(maxClamped.max).toBeLessThanOrEqual(80);
    expect(maxClamped.min).toBeGreaterThanOrEqual(7);
  });
});

describe('calculateEarnings (Sponsorship Benchmark Engine)', () => {
  it('uses sampled recent videos, Formula B engagement, and Tier 1 CPM correctly', () => {
    const result = calculateEarnings({
      followers: 250_000,
      likes: 10_000_000,
      videos: 200,
      latestVideos: [
        { views: 50_000, likes: 4000, comments: 300, shares: 200 },
        { views: 50_000, likes: 4000, comments: 300, shares: 200 },
      ],
      region: 'US',
    });

    // avgViews = 50,000, engagement = 4500/50000 = 9.0%
    // engFactor = 0.9 + (9/7.5)*0.15 = 1.08, followerFactor (>100k) = 1.08 -> combined = 1.1664
    // Adjusted CPM avg = 30 * 1.1664 = 34.992 -> 34.99
    expect(result.analytics.avgViews).toBe(50_000);
    expect(result.analytics.engagementRate).toBe(9);
    expect(result.analytics.sampleSize).toBe(2);
    expect(result.cpm).toBeCloseTo(34.99, 2);
    expect(result.earningPerVideo).toBeCloseTo(1749.5, 2);
    expect(result.earningsMin).toBeLessThan(result.earningPerVideo);
    expect(result.earningsMax).toBeGreaterThan(result.earningPerVideo);
    expect(result.meta.source).toBe('recentVideos');
  });

  it('falls back to 8% follower view model when recent videos are unavailable', () => {
    const analytics = computeAnalytics({
      followers: 500_000,
      likes: 10_000_000,
      videos: 500,
      latestVideos: [],
    });

    expect(analytics.avgViews).toBe(40_000);
    expect(analytics.sampleSize).toBe(0);

    const result = calculateEarnings({
      followers: 500_000,
      likes: 10_000_000,
      videos: 500,
      latestVideos: [],
      region: 'US',
    });

    expect(result.meta.source).toBe('estimated');
    expect(result.earningPerVideo).toBeGreaterThan(0);
    expect(result.earningsMin).toBeLessThanOrEqual(result.earningPerVideo);
    expect(result.earningsMax).toBeGreaterThanOrEqual(result.earningPerVideo);
  });

  it('applies 1,000-view and 5% engagement fallback floor for empty zeroed inputs', () => {
    const result = calculateEarnings({
      followers: 0,
      likes: 0,
      videos: 0,
      latestVideos: [],
    });

    expect(result.avgViews).toBe(1000);
    expect(result.engagementRate).toBe(5);
    expect(result.cpm).toBe(18);
    expect(result.earningPerVideo).toBe(18);
  });
});
