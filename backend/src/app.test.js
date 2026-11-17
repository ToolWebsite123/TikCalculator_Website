const request = require('supertest');

jest.mock('./routes/tiktokRoutes', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/tiktok/health', (_req, res) => res.json({ status: 'ok', service: 'tiktok' }));
  return router;
});

const app = require('./app');

describe('Backend Express App Health & HTTP 404 Routing (KHK-13)', () => {
  it('returns HTTP 200 JSON on existing health endpoints', async () => {
    const v1Health = await request(app).get('/api/v1/health');
    expect(v1Health.status).toBe(200);
    expect(v1Health.body.status).toBe('ok');

    const tiktokHealth = await request(app).get('/api/tiktok/health');
    expect(tiktokHealth.status).toBe(200);
    expect(tiktokHealth.body.status).toBe('ok');
  });

  it('returns genuine HTTP 404 JSON on missing /api endpoints instead of HTML fallback', async () => {
    const missingGet = await request(app).get('/api/this-endpoint-does-not-exist');
    expect(missingGet.status).toBe(404);
    expect(missingGet.headers['content-type']).toMatch(/application\/json/i);
    expect(missingGet.body.success).toBe(false);
    expect(missingGet.body.error).toMatch(/API endpoint not found/i);

    const missingPost = await request(app).post('/api/v1/nonexistent');
    expect(missingPost.status).toBe(404);
    expect(missingPost.headers['content-type']).toMatch(/application\/json/i);
    expect(missingPost.body.success).toBe(false);
  });

  it('trusts single proxy hop for X-Forwarded-For and allows canonical kalkulatortik CORS origin', async () => {
    expect(app.get('trust proxy')).toBe(1);

    const proxiedRes = await request(app)
      .get('/api/tiktok/health')
      .set('X-Forwarded-For', '203.0.113.10')
      .set('Origin', 'https://www.kalkulatortik.com');

    expect(proxiedRes.status).toBe(200);
    expect(proxiedRes.headers['access-control-allow-origin']).toBe('https://www.kalkulatortik.com');
  });
});

