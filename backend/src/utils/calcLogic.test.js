const { calculateEarnings } = require('./calcLogic');

describe('calculateEarnings (engagement-based views)', () => {
  it('computes engagement and earnings correctly for callmegrand sample', () => {
    const result = calculateEarnings({
      followers: 18_300_000,
      totalLikes: 484_800_000,
      totalVideos: 3_100,
      cpm: 20,
      platformShare: 0.4,
    });

    // avgLikes = 484,800,000 / 3,100 = 156,387.1
    // engagement = 156,387.1 / 18,300,000 = 0.8545%
    // views = followers * engagement = ~156,387
    expect(result.avgLikes).toBeCloseTo(156387.1, 1);
    expect(result.engagementRate).toBeCloseTo(0.8545, 3);
    expect(result.views).toBeCloseTo(156387, -1);

    // earnings = (views/1000) * cpm * (1 - platformShare)
    // = (156,387/1000) * 20 * 0.6 ≈ 1,876.6
    expect(result.earningPerVideo).toBeCloseTo(1876.6, 1);
  });
});
const { calculateRevenue } = require('./calcLogic');

describe('calculateRevenue', () => {
  it('computes per-video and monthly earnings (verification A)', () => {
    const result = calculateRevenue({
      viewsPerVideo: 100000,
      videosPerMonth: 8,
      cpm: 5,
      platformShare: 0.4,
    });
    expect(result.perVideoGross).toBeCloseTo(500); // (100000/1000)*5
    expect(result.perVideoNet).toBeCloseTo(300); // 500*(1-0.4)
    expect(result.monthlyNet).toBeCloseTo(2400); // 300*8
  });

  it('returns monthly 0 when videosPerMonth is 0', () => {
    const result = calculateRevenue({
      viewsPerVideo: 50000,
      videosPerMonth: 0,
      cpm: 4,
    });
    expect(result.perVideoNet).toBeGreaterThan(0);
    expect(result.monthlyNet).toBe(0);
  });

  it('uses followers/likes fallback to estimate viewsPerVideo (verification B)', () => {
    const result = calculateRevenue({
      followers: 1_600_000,
      likes: 80_500_000,
      videosPerMonth: 30,
      cpm: 20,
      platformShare: 0.4,
      avgViewsFactor: 0.1,
    });
    // engagementRate = 80500000 / 1600000 * 100 = 5031.25%
    // viewsPerVideo = followers * (engRate/100) * 0.1 = 1,600,000 * 50.3125 * 0.1 = 8,050,000
    // thousands = 8050
    // perVideoGross = 8050 * 20 = 161,000
    // perVideoNet = 161,000 * 0.6 = 96,600
    // monthlyNet = 96,600 * 30 = 2,898,000
    expect(result.impressionsPerVideo).toBeCloseTo(8_050_000);
    expect(result.perVideoGross).toBeCloseTo(161_000);
    expect(result.perVideoNet).toBeCloseTo(96_600);
    expect(result.monthlyNet).toBeCloseTo(2_898_000);
  });
});

