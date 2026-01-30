const { calculateEarnings } = require('../utils/calcLogic');

/**
 * Estimate TikTok earnings (views-based, corrected engagement)
 * @route POST /api/calculator/estimate
 */
const estimate = async (req, res, next) => {
  try {
    const { followers, totalLikes, totalVideos, cpm = 20, platformShare = 0.4 } =
      req.body || {};

    const numbers = [followers, totalLikes, totalVideos, cpm, platformShare].filter(
      (v) => v !== undefined && v !== null
    );

    if (numbers.some((n) => Number(n) < 0)) {
      return res.status(400).json({
        error: 'All inputs must be non-negative numbers',
      });
    }

    if (!followers || !totalLikes || !totalVideos) {
      return res.status(400).json({
        error: 'followers, totalLikes, and totalVideos are required',
      });
    }

    const result = calculateEarnings({
      followers,
      totalLikes,
      totalVideos,
      cpm,
      platformShare,
    });

    return res.status(200).json({
      avgLikes: result.avgLikes,
      engagementRate: result.engagementRate,
      views: result.views,
      CPM: result.CPM,
      earningPerVideo: result.earningPerVideo,
      error: result.error,
    });
  } catch (err) {
    console.error('Calculator error:', err);
    return next(err);
  }
};

module.exports = { estimate };