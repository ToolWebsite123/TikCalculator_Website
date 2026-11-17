import { describe, expect, it, afterEach } from 'vitest';
import api, {
  fetchTikTokProfile,
  fetchTikTokEarnings,
  calculateEarningsFromViews,
  clearTikTokCache,
  saveCalculation,
  resolveApiBaseURL,
} from './api';

const originalAdapter = api.defaults.adapter;

describe('API utility & error interceptor (KHK-01, KHK-17)', () => {
  afterEach(() => {
    api.defaults.adapter = originalAdapter;
  });

  it('resolves same-origin empty baseURL in production without double-prefixing /api', () => {
    expect(resolveApiBaseURL(undefined, true)).toBe('');
    expect(resolveApiBaseURL('', true)).toBe('');
    expect(resolveApiBaseURL('/', true)).toBe('');
    expect(resolveApiBaseURL('/api', true)).toBe('');
    expect(resolveApiBaseURL('/api/', true)).toBe('');
    expect(resolveApiBaseURL('https://www.kalkulatortik.com/api', true)).toBe(
      'https://www.kalkulatortik.com'
    );
    expect(resolveApiBaseURL('https://api.example.com/', true)).toBe('https://api.example.com');
    expect(resolveApiBaseURL(undefined, false)).toBe('http://localhost:5000');
    expect(resolveApiBaseURL('', false)).toBe('http://localhost:5000');
    expect(resolveApiBaseURL('http://localhost:5001/', false)).toBe('http://localhost:5001');
  });

  it('avoids unnecessary Content-Type headers on GET/DELETE requests while keeping JSON on POST', async () => {
    const captured = [];
    api.defaults.adapter = async (config) => {
      captured.push({
        method: config.method,
        url: config.url,
        contentType: config.headers?.['Content-Type'] ?? config.headers?.get?.('Content-Type'),
      });
      return {
        data: { success: true, profile: { username: 'ok' } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    };

    await fetchTikTokProfile('@ok');
    await clearTikTokCache('@ok');
    await saveCalculation({ inputs: { views: 1000 } });

    expect(captured[0].method).toBe('get');
    expect(captured[0].url).toBe('/api/tiktok/user/ok');
    expect(captured[0].contentType).toBeUndefined();

    expect(captured[1].method).toBe('delete');
    expect(captured[1].url).toBe('/api/tiktok/cache/ok');
    expect(captured[1].contentType).toBeUndefined();

    expect(captured[2].method).toBe('post');
    expect(captured[2].url).toBe('/api/v1/save');
    expect(captured[2].contentType).toBe('application/json');
  });

  it('returns parsed profile and bio fields on a successful 200 API response', async () => {
    api.defaults.adapter = async (config) => ({
      data: {
        success: true,
        bio: 'Verified creator bio',
        profile: { username: 'creator_ok', followers: 12000 },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    });

    const result = await fetchTikTokProfile('@creator_ok');
    expect(result.success).toBe(true);
    expect(result.profile.username).toBe('creator_ok');
    expect(result.profile.bio).toBe('Verified creator bio');
  });

  it('preserves HTTP 404 status and response object without losing error context', async () => {
    api.defaults.adapter = async (config) => {
      const err = new Error('Request failed with status code 404');
      err.response = {
        status: 404,
        data: { success: false, error: "User '@missing' not found on TikTok" },
      };
      err.config = config;
      throw err;
    };

    await expect(fetchTikTokProfile('missing')).rejects.toMatchObject({
      status: 404,
      isNetworkError: false,
      response: {
        status: 404,
        data: { error: "User '@missing' not found on TikTok" },
      },
    });
  });

  it('preserves HTTP 429 rate-limit status and safe message', async () => {
    api.defaults.adapter = async (config) => {
      const err = new Error('Too Many Requests');
      err.response = {
        status: 429,
        data: { success: false, error: 'Too many requests. Please try again later.' },
      };
      err.config = config;
      throw err;
    };

    await expect(fetchTikTokProfile('busyuser')).rejects.toMatchObject({
      status: 429,
      isNetworkError: false,
      response: { status: 429 },
    });
  });

  it('sanitizes HTTP 500 server errors so sensitive stack traces or HTML are not exposed', async () => {
    api.defaults.adapter = async (config) => {
      const err = new Error('Request failed with status code 500');
      err.response = {
        status: 500,
        data: { error: 'TypeError: Cannot read properties of null at Object.getTikTokProfile (tiktokController.js:412)' },
      };
      err.config = config;
      throw err;
    };

    let caught;
    try {
      await fetchTikTokProfile('servererr');
    } catch (err) {
      caught = err;
    }

    expect(caught.status).toBe(500);
    expect(caught.message).toBe('Server error. Please try again.');
    expect(caught.response.data.error).toBe('Server error. Please try again.');
    expect(caught.message).not.toContain('tiktokController.js');
  });

  it('identifies true network failures cleanly', async () => {
    api.defaults.adapter = async (config) => {
      const err = new Error('Network Error');
      err.request = {};
      err.config = config;
      throw err;
    };

    await expect(fetchTikTokProfile('offlineuser')).rejects.toMatchObject({
      status: 0,
      isNetworkError: true,
      message: 'Network error. Please check your connection.',
    });
  });

  it('handles error responses with null, undefined, or HTML malformed bodies safely', async () => {
    api.defaults.adapter = async (config) => {
      const err = new Error('Bad Gateway');
      err.response = {
        status: 502,
        data: '<html><body>502 Bad Gateway</body></html>',
      };
      err.config = config;
      throw err;
    };

    let htmlCaught;
    try {
      await fetchTikTokProfile('htmlerr');
    } catch (err) {
      htmlCaught = err;
    }
    expect(htmlCaught.status).toBe(502);
    expect(htmlCaught.message).toBe('Server error. Please try again.');

    api.defaults.adapter = async (config) => {
      const err = new Error('Not Found');
      err.response = {
        status: 404,
        data: null,
      };
      err.config = config;
      throw err;
    };

    await expect(fetchTikTokProfile('nullbody')).rejects.toMatchObject({
      status: 404,
      message: 'User not found',
      response: { status: 404, data: { error: 'User not found' } },
    });
  });

  it('identifies request timeouts and preserves cancellation metadata cleanly', async () => {
    api.defaults.adapter = async (config) => {
      const err = new Error('timeout of 30000ms exceeded');
      err.code = 'ECONNABORTED';
      err.request = {};
      err.config = config;
      throw err;
    };

    await expect(fetchTikTokProfile('slowuser')).rejects.toMatchObject({
      status: 0,
      isNetworkError: true,
      isTimeout: true,
      code: 'ECONNABORTED',
      message: 'Request timed out. Please try again.',
    });

    api.defaults.adapter = async (config) => {
      const err = new Error('canceled');
      err.code = 'ERR_CANCELED';
      err.name = 'CanceledError';
      err.config = config;
      throw err;
    };

    await expect(fetchTikTokProfile('aborteduser')).rejects.toMatchObject({
      code: 'ERR_CANCELED',
      name: 'CanceledError',
      isCanceled: true,
    });
  });

  it('rejects cleanly without fabricating fallback CPM estimates on earnings lookup failures (KHK-08)', async () => {
    api.defaults.adapter = async (config) => {
      const err = new Error('Service unavailable');
      err.response = { status: 503, data: { error: 'Upstream unavailable' } };
      err.config = config;
      throw err;
    };

    await expect(calculateEarningsFromViews(100000, 5, 50000)).rejects.toMatchObject({
      status: 503,
    });
    await expect(fetchTikTokEarnings('@creator_down')).rejects.toMatchObject({
      status: 503,
    });
  });
});

