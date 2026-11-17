import axios from 'axios';

/**
 * Resolve API baseURL safely without double-prefixing endpoints that already begin with `/api`.
 * Defaults to relative same-origin (`''`) in production so `/api/*` uses the Vercel proxy rewrite.
 */
export const resolveApiBaseURL = (
  rawBaseUrl = import.meta.env.VITE_API_BASE_URL,
  isProd = import.meta.env.PROD
) => {
  const trimmed = typeof rawBaseUrl === 'string' ? rawBaseUrl.trim() : '';
  if (!trimmed) {
    return isProd ? '' : 'http://localhost:5000';
  }

  const withoutTrailingSlashes = trimmed.replace(/\/+$/, '');
  if (!withoutTrailingSlashes || withoutTrailingSlashes === '/api') {
    return '';
  }

  return withoutTrailingSlashes.endsWith('/api')
    ? withoutTrailingSlashes.slice(0, -4)
    : withoutTrailingSlashes;
};

const api = axios.create({
  baseURL: resolveApiBaseURL(),
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Sanitize error text so backend HTML pages, stack traces, or internal details are never exposed
const sanitizeSafeErrorText = (value) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('<') || /\bat\s+\S+\s+\(/.test(trimmed) || trimmed.length > 200) {
    return '';
  }
  return trimmed;
};

// Response interceptor preserving safe status, timeout, cancellation & response metadata for callers
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isCancel(error) ||
      error?.code === 'ERR_CANCELED' ||
      error?.name === 'CanceledError' ||
      error?.name === 'AbortError'
    ) {
      const cancelError = new Error(error?.message || 'Request canceled');
      cancelError.code = error?.code || 'ERR_CANCELED';
      cancelError.name = error?.name || 'CanceledError';
      cancelError.isCanceled = true;
      return Promise.reject(cancelError);
    }

    const status = error?.response?.status;
    console.error('[API Error]', status, error?.message);

    if (error?.response) {
      const rawData = error.response.data;
      const rawMessage =
        rawData && typeof rawData === 'object'
          ? sanitizeSafeErrorText(rawData.error) || sanitizeSafeErrorText(rawData.message)
          : '';

      let message = rawMessage || 'Request failed';
      if (status === 404) {
        message = rawMessage || 'User not found';
      } else if (status === 429) {
        message = rawMessage || 'Too many requests. Please wait a moment.';
      } else if (status >= 500) {
        message = 'Server error. Please try again.';
      }

      const apiError = new Error(message);
      apiError.status = status;
      apiError.isNetworkError = false;
      apiError.isTimeout = false;
      apiError.response = {
        status,
        data:
          status >= 500
            ? { error: message }
            : {
                error: rawMessage || message,
                ...(rawData && typeof rawData === 'object' && rawData.errors
                  ? { errors: rawData.errors }
                  : {}),
              },
      };
      return Promise.reject(apiError);
    }

    const isTimeout =
      error?.code === 'ECONNABORTED' ||
      error?.code === 'ETIMEDOUT' ||
      /\btimeout\b/i.test(error?.message || '');

    if (isTimeout) {
      const timeoutError = new Error('Request timed out. Please try again.');
      timeoutError.status = 0;
      timeoutError.isNetworkError = true;
      timeoutError.isTimeout = true;
      timeoutError.code = error?.code || 'ECONNABORTED';
      return Promise.reject(timeoutError);
    }

    if (error?.request) {
      const netError = new Error('Network error. Please check your connection.');
      netError.status = 0;
      netError.isNetworkError = true;
      netError.isTimeout = false;
      return Promise.reject(netError);
    }

    const fallbackError = new Error(sanitizeSafeErrorText(error?.message) || 'An error occurred');
    fallbackError.isNetworkError = false;
    fallbackError.isTimeout = false;
    return Promise.reject(fallbackError);
  }
);

/**
 * Fetch TikTok user profile and earnings
 * @param {string} username - TikTok username (with or without @)
 * @param {object} params - Query parameters
 * @param {object} config - Optional axios request config (e.g., signal)
 * @returns {Promise} Profile data with earnings
 */
export const fetchTikTokProfile = async (username, params = {}, config = {}) => {
  const cleanUsername = username.replace('@', '');
  const response = await api.get(`/api/tiktok/user/${encodeURIComponent(cleanUsername)}`, {
    params,
    ...config,
  });
  
  // Ensure bio is included in the response
  const data = response.data;
  if (data && data.profile) {
    // Ensure bio is set from multiple possible sources
    if (!data.profile.bio) {
      data.profile.bio = data.bio || data.description || data.profile.description || '';
    }
    // Also set description if missing
    if (!data.profile.description) {
      data.profile.description = data.profile.bio || data.bio || data.description || '';
    }
  }
  
  return data;
};

/**
 * Calculate earnings from views (KalkulatorTik authoritative backend endpoint)
 * @param {number} views - Average views per video
 * @param {number} engagementRate - Engagement rate percentage (optional)
 * @param {number} followers - Follower count (optional)
 * @returns {Promise} Earnings data
 */
export const calculateEarningsFromViews = async (views, engagementRate = 0, followers = 0) => {
  const response = await api.get('/api/tiktok/earnings', {
    params: {
      views,
      engagementRate: engagementRate || undefined,
      followers: followers || undefined,
    },
  });
  return response.data;
};

/**
 * Fetch TikTok user earnings (dedicated endpoint)
 * @param {string} username - TikTok username (with or without @)
 * @param {object} params - Query parameters
 * @returns {Promise} Earnings data
 */
export const fetchTikTokEarnings = async (username, params = {}) => {
  const cleanUsername = username.replace('@', '');
  const url = `/api/tiktok/user/${encodeURIComponent(cleanUsername)}/earnings`;
  const response = await api.get(url, { params });
  return response.data;
};

/**
 * Clear cache for a specific user
 * @param {string} username - TikTok username
 * @returns {Promise}
 */
export const clearTikTokCache = async (username) => {
  const cleanUsername = username.replace('@', '');
  const response = await api.delete(`/api/tiktok/cache/${encodeURIComponent(cleanUsername)}`);
  return response.data;
};

/**
 * Check API health
 * @returns {Promise}
 */
export const checkHealth = async () => {
  const response = await api.get('/api/tiktok/health');
  return response.data;
};

/**
 * Fetch countries data (if needed)
 * @returns {Promise}
 */
export const fetchCountries = async () => {
  const response = await api.get('/api/v1/countries');
  return response.data;
};

/**
 * Save calculation
 * @param {object} payload - Calculation data
 * @returns {Promise}
 */
export const saveCalculation = async (payload) => {
  const response = await api.post('/api/v1/save', payload);
  return response.data;
};

/**
 * Fetch saved calculation
 * @param {string} id - Calculation ID
 * @returns {Promise}
 */
export const fetchSaved = async (id) => {
  const response = await api.get(`/api/v1/saved/${id}`);
  return response.data;
};

/**
 * Fetch contact form availability status
 * @returns {Promise} { success, available }
 */
export const fetchContactStatus = async () => {
  const response = await api.get('/api/v1/contact/status');
  return response.data;
};

/**
 * Submit contact message to backend delivery endpoint
 * @param {object} payload - { name, email, subject, message, website }
 * @returns {Promise} Delivery confirmation payload
 */
export const submitContactMessage = async (payload) => {
  const response = await api.post('/api/v1/contact', payload);
  return response.data;
};

// Backward compatibility
export const fetchTikTokStats = fetchTikTokProfile;

export default api;
