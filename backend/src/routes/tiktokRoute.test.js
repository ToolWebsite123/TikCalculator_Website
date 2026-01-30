const express = require('express');
const request = require('supertest');

jest.mock('../services/tiktokApi', () => ({
  fetchTikTokProfile: jest.fn(),
  TikTokApiError: class extends Error {},
}));

jest.mock('../models/ProfileCache', () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));

const { fetchTikTokProfile } = require('../services/tiktokApi');
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

  it('returns cached profile when fresh', async () => {
    ProfileCache.findOne.mockResolvedValue({
      profile: {
        username: 'cacheduser',
        fullName: 'Cached User',
        profilePic: 'http://example.com/pic.jpg',
        followers: 10,
        following: 2,
        likes: 100,
        videos: 5,
      },
      analytics: { avgViews: 1000, engagementRate: 0.5, sampleSize: 0 },
      earnings: { perVideo: 12, monthly: 240, platformShare: 0.05, cpm: 23, monthlyVideos: 4 },
      meta: { source: 'cache' },
      raw: {},
      fetchedAt: new Date(),
    });

    const res = await request(buildApp()).get('/api/tiktok/user/cacheduser');

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('cacheduser');
    expect(fetchTikTokProfile).not.toHaveBeenCalled();
  });

  it('scrapes and caches when no fresh cache', async () => {
    ProfileCache.findOne.mockResolvedValue(null);
    ProfileCache.findOneAndUpdate.mockResolvedValue({});
    fetchTikTokProfile.mockResolvedValue({
      profile: {
        username: 'liveuser',
        fullName: 'Live User',
        profilePic: 'http://example.com/live.jpg',
        followers: 1_000_000,
        following: 100,
        likes: 50_000_000,
        videos: 200,
        latestVideos: [{ id: 'v1', views: 100_000, likes: 5_000, comments: 100 }],
      },
      analytics: { avgViews: 100000, engagementRate: 5, sampleSize: 1 },
      raw: { source: 'mock' },
    });

    const res = await request(buildApp()).get('/api/tiktok/user/liveuser');

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('liveuser');
    expect(res.body.analytics).toBeDefined();
    expect(res.body.earnings.perVideo).toBeGreaterThan(0);
    expect(ProfileCache.findOneAndUpdate).toHaveBeenCalled();
  });
});


