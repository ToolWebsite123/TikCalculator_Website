const { calculateEarnings, averageViewsFromVideos } = require('./calcEarnings');

describe('averageViewsFromVideos', () => {
  it('returns mean when views present', () => {
    const avg = averageViewsFromVideos([{ views: 100 }, { views: 300 }]);
    expect(avg).toBe(200);
  });

  it('returns null when views missing', () => {
    expect(averageViewsFromVideos([])).toBeNull();
  });
});

describe('calculateEarnings', () => {
  it('uses latestVideos when available', () => {
    const { analytics, earnings } = calculateEarnings({
      followers: 1_000_000,
      likes: 50_000_000,
      videos: 200,
      latestVideos: [{ views: 120_000 }, { views: 80_000 }],
      cpm: 10,
      platformShare: 0.3,
    });

    expect(analytics.avgViews).toBeCloseTo(100_000, 1);
    expect(earnings.perVideo).toBeCloseTo((100_000 / 1000) * 10 * 0.7, 2);
  });

  it('falls back to likes/followers estimate when videos missing', () => {
    const { analytics, earnings } = calculateEarnings({
      followers: 500_000,
      likes: 10_000_000,
      videos: 500,
      latestVideos: [],
      cpm: 8,
      platformShare: 0.4,
    });

    expect(analytics.avgViews).toBeGreaterThan(0);
    expect(earnings.perVideo).toBeGreaterThan(0);
    expect(earnings.monthly).toBeGreaterThan(earnings.perVideo);
  });

  it('returns zeros for empty inputs', () => {
    const { analytics, earnings } = calculateEarnings({
      followers: 0,
      likes: 0,
      videos: 0,
      latestVideos: [],
    });

    expect(analytics.avgViews).toBe(0);
    expect(earnings.perVideo).toBe(0);
    expect(earnings.monthly).toBe(0);
  });
});





