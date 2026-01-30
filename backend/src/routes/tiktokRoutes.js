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
 * Rate limiting middleware (simple implementation)
 */
const rateLimit = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute

const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimit[ip]) {
        rateLimit[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
        return next();
    }
    
    if (now > rateLimit[ip].resetTime) {
        rateLimit[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
        return next();
    }
    
    if (rateLimit[ip].count >= MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            error: 'Too many requests',
            message: 'Please wait a moment before trying again',
            retryAfter: Math.ceil((rateLimit[ip].resetTime - now) / 1000),
        });
    }
    
    rateLimit[ip].count++;
    next();
};

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
 */
router.get('/tiktok/user/:username', rateLimitMiddleware, getTikTokProfile);

/**
 * Get TikTok user earnings (dedicated endpoint)
 * GET /api/tiktok/user/:username/earnings
 * Query params:
 *   - refresh=true (force refresh cache)
 */
router.get('/tiktok/user/:username/earnings', rateLimitMiddleware, getTikTokEarnings);

/**
 * Calculate earnings from views (TikCalculator.com style)
 * GET /api/tiktok/earnings?views=XXXX&engagementRate=XX&followers=XXXX
 * Query params:
 *   - views (required): Average views per video
 *   - engagementRate (optional): Engagement rate percentage
 *   - followers (optional): Follower count for CPM calculation
 */
router.get('/tiktok/earnings', rateLimitMiddleware, calculateEarningsFromViews);

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