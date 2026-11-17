const express = require('express');
const request = require('supertest');

jest.mock('../services/tiktokScraper', () => {
  class TikTokScraperError extends Error {
    constructor(message, code = 'SCRAPER_ERROR') {
      super(message);
      this.code = code;
      this.name = 'TikTokScraperError';
    }
  }
  return {
    scrapeTikTokProfile: jest.fn(),
    fetchVideosFromTikWM: jest.fn(),
    deriveAnalytics: jest.fn(),
    TikTokScraperError,
  };
});

jest.mock('../utils/db', () => ({
  isMongoAvailable: jest.fn(() => true),
  connectDB: jest.fn(),
}));

jest.mock('../models/ProfileCache', () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));

const {
  scrapeTikTokProfile,
  fetchVideosFromTikWM,
  TikTokScraperError,
} = require('../services/tiktokScraper');
const ProfileCache = require('../models/ProfileCache');
const tiktokRoutes = require('./tiktokRoutes');

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api', tiktokRoutes);
  return app;
};

describe('GET /api/tiktok/user/:username', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns cached profile with both structured earnings object and earningsData', async () => {
    ProfileCache.findOne.mockResolvedValue({
      profile: {
        username: 'cacheduser',
        fullName: 'Cached User',
        profilePic: 'http://example.com/pic.jpg',
        followers: 100_000,
        following: 20,
        likes: 500_000,
        videos: 50,
      },
      analytics: { avgViews: 10_000, engagementRate: 5.5, sampleSize: 5 },
      earnings: { perVideo: 240, monthly: 4800, platformFactor: 1, cpm: 24, cpmMin: 18, cpmMax: 32 },
      latestVideos: [{ id: 'v1', views: 10_000, likes: 500, comments: 50 }],
      fetchedAt: new Date(),
    });

    const res = await request(buildApp()).get('/api/tiktok/user/cacheduser');

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('cacheduser');
    expect(typeof res.body.earnings).toBe('object');
    expect(res.body.earnings.perVideo).toBe(240);
    expect(res.body.earningsData).toBeDefined();
    expect(res.body.earningsData.estimatedEarnings).toBeGreaterThan(0);
    expect(scrapeTikTokProfile).not.toHaveBeenCalled();
  });

  it('scrapes, computes earnings object + earningsData, and caches when no fresh cache exists', async () => {
    ProfileCache.findOne.mockResolvedValue(null);
    ProfileCache.findOneAndUpdate.mockResolvedValue({});
    scrapeTikTokProfile.mockResolvedValue({
      profile: {
        username: 'liveuser',
        fullName: 'Live User',
        profilePic: 'http://example.com/live.jpg',
        followers: 1_000_000,
        following: 100,
        likes: 50_000_000,
        videos: 200,
      },
      latestVideos: [{ id: 'v1', views: 100_000, likes: 5_000, comments: 100, shares: 50 }],
    });

    const res = await request(buildApp()).get('/api/tiktok/user/liveuser');

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('liveuser');
    expect(res.body.analytics).toBeDefined();
    expect(typeof res.body.earnings).toBe('object');
    expect(res.body.earnings.perVideo).toBeGreaterThan(0);
    expect(res.body.estimatedEarnings).toBeGreaterThan(0);
    expect(res.body.earningsData.estimatedEarnings).toBe(res.body.estimatedEarnings);
    expect(ProfileCache.findOneAndUpdate).toHaveBeenCalled();
  });

  it('falls back to TikWM video pull and returns valid response when optional fields are missing', async () => {
    ProfileCache.findOne.mockResolvedValue(null);
    ProfileCache.findOneAndUpdate.mockResolvedValue({});
    scrapeTikTokProfile.mockResolvedValue({
      user: {
        username: 'minimal_user',
        followers: 25_000,
        following: 10,
        likes: 120_000,
        videos: 30,
      },
      latestVideos: [],
    });
    fetchVideosFromTikWM.mockResolvedValue([
      { id: 'v1', views: 15_000, likes: 900, comments: 40, shares: 20 },
    ]);

    const res = await request(buildApp()).get('/api/tiktok/user/@minimal_user');

    expect(res.status).toBe(200);
    expect(res.body.profile.username).toBe('minimal_user');
    expect(res.body.earningsData.avgViews).toBe(15_000);
    expect(res.body.earningsData.estimatedEarnings).toBeGreaterThan(0);
  });

  it('returns HTTP 404 when TikTok user is not found and 429 on upstream captcha/rate-limit', async () => {
    ProfileCache.findOne.mockResolvedValue(null);
    scrapeTikTokProfile.mockRejectedValueOnce(new TikTokScraperError('Missing', 'NOT_FOUND'));

    const res404 = await request(buildApp()).get('/api/tiktok/user/doesnotexist');
    expect(res404.status).toBe(404);
    expect(res404.body.success).toBe(false);
    expect(res404.body.code).toBe('NOT_FOUND');

    scrapeTikTokProfile.mockRejectedValueOnce(new TikTokScraperError('Captcha', 'CAPTCHA_REQUIRED'));
    const res429 = await request(buildApp()).get('/api/tiktok/user/throttled');
    expect(res429.status).toBe(429);
    expect(res429.body.success).toBe(false);
    expect(res429.body.code).toBe('CAPTCHA_REQUIRED');
  });
});
