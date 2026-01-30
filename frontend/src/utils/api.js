import axios from 'axios';

// API base configuration - FIXED: Use VITE_API_BASE_URL instead of VITE_API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('[API] Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.status, error.message);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 404) {
        throw new Error(data.error || 'User not found');
      }
      if (status === 429) {
        throw new Error(data.error || 'Too many requests. Please wait a moment.');
      }
      if (status === 500) {
        throw new Error(data.error || 'Server error. Please try again.');
      }
      
      throw new Error(data.error || data.message || 'Request failed');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An error occurred');
    }
  }
);

/**
 * Fetch TikTok user profile and earnings
 * @param {string} username - TikTok username (with or without @)
 * @param {object} params - Query parameters
 * @returns {Promise} Profile data with earnings
 */
export const fetchTikTokProfile = async (username, params = {}) => {
  try {
    const cleanUsername = username.replace('@', '');
    const response = await api.get(`/api/tiktok/user/${encodeURIComponent(cleanUsername)}`, { 
      params 
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
  } catch (error) {
    throw error;
  }
};

/**
 * Calculate earnings from views (TikCalculator.com style)
 * @param {number} views - Average views per video
 * @param {number} engagementRate - Engagement rate percentage (optional)
 * @param {number} followers - Follower count (optional)
 * @returns {Promise} Earnings data
 */
export const calculateEarningsFromViews = async (views, engagementRate = 0, followers = 0) => {
  try {
    const response = await api.get('/api/tiktok/earnings', {
      params: {
        views: views,
        engagementRate: engagementRate || undefined,
        followers: followers || undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error('[API] Error calculating earnings from views:', error);
    // Return safe fallback
    const cpm = views >= 5_000_000 ? 3.5 : views >= 1_000_000 ? 2.5 : views >= 500_000 ? 1.8 : views >= 100_000 ? 1.2 : views >= 10_000 ? 1.0 : 0.8;
    const platformFactor = 1.0;
    const earnings = (views / 1000) * cpm * platformFactor;
    return {
      success: true,
      earnings: earnings,
      earningPerVideo: earnings,
      estimatedEarnings: earnings,
      avgViews: views,
      engagementRate: engagementRate || 5.0,
      cpm: cpm,
      platformFactor: platformFactor,
    };
  }
};

/**
 * Fetch TikTok user earnings (dedicated endpoint)
 * @param {string} username - TikTok username (with or without @)
 * @param {object} params - Query parameters
 * @returns {Promise} Earnings data
 */
export const fetchTikTokEarnings = async (username, params = {}) => {
  try {
    const cleanUsername = username.replace('@', '');
    const url = `/api/tiktok/user/${encodeURIComponent(cleanUsername)}/earnings`;
    console.log('[API] ========================================');
    console.log('[API] Calling earnings endpoint:', url);
    console.log('[API] Params:', params);
    
    const response = await api.get(url, { params });
    
    console.log('[API] ========================================');
    console.log('[API] Earnings response received:');
    console.log('[API]   - Status:', response.status);
    console.log('[API]   - Has data:', !!response.data);
    console.log('[API]   - Success:', response.data?.success);
    console.log('[API]   - avgViews:', response.data?.avgViews, '(type:', typeof response.data?.avgViews, ')');
    console.log('[API]   - engagementRate:', response.data?.engagementRate, '(type:', typeof response.data?.engagementRate, ')');
    console.log('[API]   - cpm:', response.data?.cpm, '(type:', typeof response.data?.cpm, ')');
    console.log('[API]   - platformFactor:', response.data?.platformFactor, '(type:', typeof response.data?.platformFactor, ')');
    console.log('[API]   - estimatedEarnings:', response.data?.estimatedEarnings, '(type:', typeof response.data?.estimatedEarnings, ')');
    console.log('[API]   - All keys:', Object.keys(response.data || {}));
    console.log('[API]   - Full response:', JSON.stringify(response.data, null, 2));
    console.log('[API] ========================================');
    
    return response.data;
  } catch (error) {
    console.error('[API] ========================================');
    console.error('[API] ❌ Earnings endpoint ERROR:');
    console.error('[API]   - Message:', error.message);
    console.error('[API]   - Status:', error.response?.status);
    console.error('[API]   - Response data:', error.response?.data);
    console.error('[API]   - URL:', error.config?.url);
    console.error('[API] ========================================');
    
    // CRITICAL: Return safe fallback object instead of throwing
    // This ensures earningsData is never null/undefined
    const cleanUsername = username.replace('@', '');
    console.warn('[API] ⚠ Returning safe fallback object for earnings');
    return {
      success: true,
      estimatedEarnings: 0,
      earningPerVideo: 0,
      avgViews: 0,
      engagementRate: 0,
      cpm: 0,
      platformFactor: 1.0,
      username: cleanUsername,
      followers: 0,
      likes: 0,
      following: 0,
      videos: 0,
      monthlyEarning: 0,
      source: 'error',
      error: error.message || 'Failed to fetch earnings',
    };
  }
};

/**
 * Clear cache for a specific user
 * @param {string} username - TikTok username
 * @returns {Promise}
 */
export const clearTikTokCache = async (username) => {
  try {
    const cleanUsername = username.replace('@', '');
    const response = await api.delete(`/api/tiktok/cache/${encodeURIComponent(cleanUsername)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check API health
 * @returns {Promise}
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/tiktok/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch countries data (if needed)
 * @returns {Promise}
 */
export const fetchCountries = async () => {
  try {
    const response = await api.get('/api/v1/countries');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Save calculation
 * @param {object} payload - Calculation data
 * @returns {Promise}
 */
export const saveCalculation = async (payload) => {
  try {
    const response = await api.post('/api/v1/save', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch saved calculation
 * @param {string} id - Calculation ID
 * @returns {Promise}
 */
export const fetchSaved = async (id) => {
  try {
    const response = await api.get(`/api/v1/saved/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Backward compatibility
export const fetchTikTokStats = fetchTikTokProfile;

export default api;