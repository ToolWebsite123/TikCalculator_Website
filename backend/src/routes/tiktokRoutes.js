const express = require('express');
const { 
    getTikTokProfile,
    getTikTokEarnings,
    calculateEarningsFromViews,
    clearCache, 
    clearAllCache,
    healthCheck 
} = require('../controllers/tiktokController');

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/tiktok/health
 */
router.get('/tiktok/health', healthCheck);

/**
 * Get TikTok user profile and earnings
 * GET /api/tiktok/user/:username
 * Query params:
 *   - refresh=true (force refresh cache)
 * 
 * Note: Rate limiting is handled globally in app.js
 * This endpoint supports concurrent requests from multiple users
 */
router.get('/tiktok/user/:username', getTikTokProfile);

/**
 * Get TikTok user earnings (dedicated endpoint)
 * GET /api/tiktok/user/:username/earnings
 * Query params:
 *   - refresh=true (force refresh cache)
 * 
 * Note: Rate limiting is handled globally in app.js
 * This endpoint supports concurrent requests from multiple users
 */
router.get('/tiktok/user/:username/earnings', getTikTokEarnings);

/**
 * Calculate earnings from views (TikCalculator.com style)
 * GET /api/tiktok/earnings?views=XXXX&engagementRate=XX&followers=XXXX
 * Query params:
 *   - views (required): Average views per video
 *   - engagementRate (optional): Engagement rate percentage
 *   - followers (optional): Follower count for CPM calculation
 * 
 * Note: Rate limiting is handled globally in app.js
 * This endpoint supports concurrent requests from multiple users
 */
router.get('/tiktok/earnings', calculateEarningsFromViews);

/**
 * Clear cache for specific user
 * DELETE /api/tiktok/cache/:username
 */
router.delete('/tiktok/cache/:username', clearCache);

/**
 * Clear all cache
 * DELETE /api/tiktok/cache
 */
router.delete('/tiktok/cache', clearAllCache);

module.exports = router;