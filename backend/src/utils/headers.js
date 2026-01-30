/**
 * Headers utility for TikTok scraping
 * Provides rotating User-Agents and realistic browser headers
 * Strong anti-block headers including TikTok mobile browser UA
 */

const USER_AGENT_POOL = [
  // TikTok Mobile Browser (Android) - Most realistic
  'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  // TikTok Mobile Browser (iOS) - Most realistic
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  // Chrome Desktop - Windows (most common)
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  // Chrome Desktop - macOS
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  // Edge Desktop
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
  // Firefox Desktop
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
  // Chrome Mobile - Android (alternative)
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  // Safari Mobile - iOS (alternative)
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
];

// Add custom user agents from environment
const CUSTOM_USER_AGENTS = process.env.SCRAPER_USER_AGENT
  ? [process.env.SCRAPER_USER_AGENT]
  : [];

const ALL_USER_AGENTS = [
  ...CUSTOM_USER_AGENTS,
  ...(process.env.TIKTOK_USER_AGENTS
    ? process.env.TIKTOK_USER_AGENTS.split(/[\n,]+/).map((ua) => ua.trim()).filter(Boolean)
    : []),
  ...USER_AGENT_POOL,
];

let currentUserAgentIndex = 0;

/**
 * Get a random User-Agent from the pool
 */
const getRandomUserAgent = () => {
  const index = Math.floor(Math.random() * ALL_USER_AGENTS.length);
  return ALL_USER_AGENTS[index] || USER_AGENT_POOL[0];
};

/**
 * Get the next User-Agent in rotation
 */
const getNextUserAgent = () => {
  const ua = ALL_USER_AGENTS[currentUserAgentIndex % ALL_USER_AGENTS.length];
  currentUserAgentIndex += 1;
  return ua || USER_AGENT_POOL[0];
};

/**
 * Build realistic browser headers for TikTok requests
 * Strong anti-block headers with proper TikTok mobile browser simulation
 */
const buildBrowserHeaders = (userAgent, referer = 'https://www.tiktok.com/') => {
  const isMobile = userAgent.includes('Mobile') || userAgent.includes('iPhone') || userAgent.includes('Android');
  const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
  const isEdge = userAgent.includes('Edg');
  const isFirefox = userAgent.includes('Firefox');
  const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
  const isAndroid = userAgent.includes('Android');
  const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad');

  // Base headers - always include these
  const headers = {
    'User-Agent': userAgent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Referer': referer || 'https://www.tiktok.com/',
    'Origin': 'https://www.tiktok.com',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': referer.includes('tiktok.com') ? 'same-origin' : 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'DNT': '1',
  };

  // Chrome-specific headers (most common)
  if (isChrome) {
    if (isMobile) {
      // Mobile Chrome
      headers['Sec-Ch-Ua'] = '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"';
      headers['Sec-Ch-Ua-Mobile'] = '?1';
      headers['Sec-Ch-Ua-Platform'] = isAndroid ? '"Android"' : '"iOS"';
    } else {
      // Desktop Chrome
      headers['Sec-Ch-Ua'] = '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"';
      headers['Sec-Ch-Ua-Mobile'] = '?0';
      headers['Sec-Ch-Ua-Platform'] = '"Windows"';
    }
    headers['Sec-Ch-Ua-Platform-Version'] = isAndroid ? '"13.0.0"' : isIOS ? '"17.0"' : '"15.0.0"';
  }

  // Edge-specific headers
  if (isEdge) {
    headers['Sec-Ch-Ua'] = '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"';
    headers['Sec-Ch-Ua-Mobile'] = '?0';
    headers['Sec-Ch-Ua-Platform'] = '"Windows"';
    headers['Sec-Ch-Ua-Platform-Version'] = '"15.0.0"';
  }

  // Firefox-specific headers
  if (isFirefox) {
    headers['DNT'] = '1';
    headers['Sec-Fetch-Dest'] = 'document';
    headers['Sec-Fetch-Mode'] = 'navigate';
    headers['Sec-Fetch-Site'] = 'same-origin';
    headers['Sec-Fetch-User'] = '?1';
  }

  // Safari-specific headers (iOS/macOS)
  if (isSafari) {
    headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    if (isIOS) {
      headers['Sec-Fetch-Site'] = 'none';
      headers['Sec-Fetch-Mode'] = 'navigate';
      headers['Sec-Fetch-User'] = '?1';
      headers['Sec-Fetch-Dest'] = 'document';
    }
  }

  // Additional TikTok-specific headers for mobile
  if (isMobile) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
    // Some TikTok mobile requests include these
    if (isAndroid) {
      headers['X-Tt-Token'] = '';
    }
  }

  return headers;
};

/**
 * Get proxy configuration from environment
 */
const getProxyConfig = () => {
  const proxyUrl = process.env.PROXY_URL;
  if (!proxyUrl) return null;

  try {
    const url = new URL(proxyUrl);
    return {
      protocol: url.protocol.replace(':', ''),
      host: url.hostname,
      port: parseInt(url.port, 10),
      auth: url.username && url.password
        ? {
            username: url.username,
            password: url.password,
          }
        : undefined,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Invalid PROXY_URL format:', err.message);
    return null;
  }
};

module.exports = {
  getRandomUserAgent,
  getNextUserAgent,
  buildBrowserHeaders,
  getProxyConfig,
  USER_AGENT_POOL,
};
