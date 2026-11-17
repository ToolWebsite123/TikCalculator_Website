const { calculateEarnings, calculateRevenue, MAX_CPM } = require('./calcLogic');

describe('calcLogic calculateEarnings', () => {
  it('computes rounded engagement, applies 5% follower view floor, and caps CPM at $6', () => {
    const result = calculateEarnings({
      followers: 18_300_000,
      totalLikes: 484_800_000,
      totalVideos: 3_100,
      cpm: 20,
      platformShare: 0.4,
    });

    // avgLikes = 484,800,000 / 3,100 = 156,387.10
    // engagementRate = roundTo2((156,387.0968 / 18,300,000) * 100) = 0.85
    // views floored at 5% of followers = 915,000
    // CPM clamped to MAX_CPM = 6
    // earningAvg = (915,000 / 1000) * 6 * (1 - 0.4) = 3,294
    expect(result.avgLikes).toBeCloseTo(156387.1, 1);
    expect(result.engagementRate).toBe(0.85);
    expect(result.views).toBe(915_000);
    expect(result.CPM).toBe(MAX_CPM);
    expect(result.earningPerVideo).toBe(3294);
    expect(result.earningsRange).toEqual({
      min: result.earningsMin,
      avg: result.earningPerVideo,
      max: result.earningsMax,
    });
  });

  it('delegates calculateRevenue cleanly and handles invalid zeroed inputs', () => {
    const zeroResult = calculateRevenue({
      followers: 0,
      totalLikes: 0,
      totalVideos: 0,
      cpm: 4,
    });

    expect(zeroResult.estimatedEarnings).toBe(0);
    expect(zeroResult.earningPerVideo).toBe(0);
    expect(zeroResult.error).toBe('Followers and totalVideos must be greater than zero');
  });

  it('uses unfloored views when computed views fall between 5% and 50% of followers', () => {
    const result = calculateEarnings({
      followers: 100_000,
      totalLikes: 2_000_000,
      totalVideos: 100, // avgLikes = 20,000 -> engagementRate = 20%
      cpm: 5,
      platformShare: 0.35,
    });

    // views = 100,000 * 0.20 = 20,000 (within [5,000, 50,000])
    expect(result.engagementRate).toBe(20);
    expect(result.views).toBe(20_000);
    // earning = (20,000 / 1000) * 5 * 0.65 = 65
    expect(result.earningPerVideo).toBe(65);
  });
});
