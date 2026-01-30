const crypto = require('crypto');
const xBogus = require('xbogus');

const DEFAULT_USER_AGENTS = [
  // Desktop Chrome - most common browser
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  // Desktop Edge
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
  // Mobile Chrome
  'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
];

class TikTokApiError extends Error {
  constructor(message, code = 'API_ERROR') {
    super(message);
    this.code = code;
    this.name = 'TikTokApiError';
  }
}

const USER_AGENT_POOL = [
  ...(process.env.SCRAPER_USER_AGENT ? [process.env.SCRAPER_USER_AGENT] : []),
  ...(process.env.TIKTOK_USER_AGENTS
    ? process.env.TIKTOK_USER_AGENTS.split(/[\n,]+/).map((ua) => ua.trim()).filter(Boolean)
    : []),
  ...DEFAULT_USER_AGENTS,
];

const pickUserAgent = () => USER_AGENT_POOL[0] || DEFAULT_USER_AGENTS[0];

// Environment variables and constants
const BASE_SID_TT = process.env.TIKTOK_SID_TT || '';
const BASE_UID_TT = process.env.TIKTOK_UID_TT || '';
const BASE_TTWID = process.env.TIKTOK_TTWID || '';
const XLADON_SECRET = process.env.TIKTOK_X_LADON_SECRET || '';

const randomString = (length) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let output = '';
  for (let i = 0; i < length; i += 1) {
    output += alphabet[crypto.randomInt(0, alphabet.length)];
  }
  return output;
};

const generateMsToken = () => {
  // Use env token if provided, otherwise generate a valid format
  if (process.env.TIKTOK_MS_TOKEN) {
    return process.env.TIKTOK_MS_TOKEN;
  }
  // Generate a valid msToken format (107 characters)
  return randomString(107);
};

const generateTtWebId = () => {
  if (BASE_TTWID) {
    return BASE_TTWID;
  }
  // Generate tt_webid format: timestamp + random
  return `${Date.now()}${crypto.randomInt(100000, 999999)}`;
};

const generateSWebId = () => {
  // Generate s_v_web_id format
  return `verify_${randomString(24)}`;
};

const generateDeviceId = () => {
  // Generate device_id format
  return `${Date.now()}${crypto.randomInt(1000, 9999)}`;
};

const buildCookie = ({ msToken, ttWebId, sWebId }) => {
  const parts = [];
  if (msToken) parts.push(`msToken=${msToken}`);
  if (ttWebId) parts.push(`tt_webid=${ttWebId}`);
  if (sWebId) parts.push(`s_v_web_id=${sWebId}`);
  if (BASE_SID_TT) parts.push(`sid_tt=${BASE_SID_TT}`);
  if (BASE_UID_TT) parts.push(`uid_tt=${BASE_UID_TT}`);
  if (BASE_TTWID) parts.push(`ttwid=${BASE_TTWID}`);
  return parts.join('; ');
};

const appendXBogus = (urlString, userAgent) => {
  try {
    const sig = xBogus(urlString, userAgent);
    if (sig) {
      const url = new URL(urlString);
      url.searchParams.set('X-Bogus', sig);
      return url.toString();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('x-bogus generation failed, using unsigned url:', err.message);
  }
  return urlString;
};

const buildHeaders = ({ userAgent, referer, cookie, xLadon }) => {
  const headers = {
    'User-Agent': userAgent,
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': referer || 'https://www.tiktok.com/',
    'Origin': 'https://www.tiktok.com',
    'Cookie': cookie,
    'Sec-Ch-Ua': '"Chromium";v="125", "Google Chrome";v="125", "Not.A/Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Secsdk-Csrf-Token': '00000000000000000000000000000000',
  };

  if (xLadon) {
    headers['X-Ladon'] = xLadon;
  }

  return headers;
};

// Generate X-Ladon signature for TikTok API requests
// X-Ladon is TikTok's anti-bot signature
const generateXLadon = (url, msToken, userAgent) => {
  try {
    const ts = Math.floor(Date.now() / 1000);
    const urlObj = new URL(url);

    // Build signature: path+query|msToken|timestamp|userAgent
    const path = urlObj.pathname + urlObj.search;
    const msTokenValue = msToken || '';
    const uaValue = userAgent || '';
    const base = `${path}|${msTokenValue}|${ts}|${uaValue}`;

    // Use provided secret or default
    const secret = XLADON_SECRET || 'tiktok-ladon-secret-key-2024';
    const hmac = crypto.createHmac('sha256', secret).update(base).digest('hex');

    // X-Ladon format: first 32 chars of HMAC + timestamp
    return `${hmac.substring(0, 32)}.${ts}`;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('X-Ladon generation failed:', err.message);
    // Return a fallback signature
    const ts = Math.floor(Date.now() / 1000);
    return `${crypto.randomBytes(16).toString('hex')}.${ts}`;
  }
};

const isUserNotFound = (data) =>
  data?.statusCode === 10202 ||
  data?.status_code === 10202 ||
  data?.data?.statusCode === 10202 ||
  data?.data?.status_code === 10202;

/**
 * Clean response text to extract valid JSON
 * TikTok sometimes returns HTML mixed with JSON
 */
const cleanJsonFromResponse = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Remove leading/trailing whitespace
  let cleaned = text.trim();

  // Try to find JSON object/array in the response
  // Look for first { or [ which indicates JSON start
  const jsonStart = Math.max(
    cleaned.indexOf('{'),
    cleaned.indexOf('[')
  );

  if (jsonStart > 0) {
    cleaned = cleaned.substring(jsonStart);
  }

  // Find the matching closing brace/bracket
  // This handles trailing HTML or other garbage
  let braceCount = 0;
  let bracketCount = 0;
  let lastValidPos = -1;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '{') braceCount++;
    if (char === '}') {
      braceCount--;
      if (braceCount === 0 && bracketCount === 0) {
        lastValidPos = i + 1;
        break;
      }
    }
    if (char === '[') bracketCount++;
    if (char === ']') {
      bracketCount--;
      if (braceCount === 0 && bracketCount === 0) {
        lastValidPos = i + 1;
        break;
      }
    }
  }

  // If we found a valid end position, truncate there
  if (lastValidPos > 0 && lastValidPos < cleaned.length) {
    cleaned = cleaned.substring(0, lastValidPos);
  }

  // Remove any remaining HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Remove control characters (except newlines/tabs which are valid in JSON strings)
  cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  return cleaned;
};

const requestTikTok = async ({ url, label, username, userAgent, cookie, msToken }) => {
  const signedUrl = appendXBogus(url, userAgent);
  const xLadon = generateXLadon(signedUrl, msToken, userAgent);

  let response;
  try {
    response = await fetch(signedUrl, {
      headers: buildHeaders({
        userAgent,
        cookie,
        referer: `https://www.tiktok.com/@${encodeURIComponent(username || '')}`,
        xLadon,
      }),
      redirect: 'manual',
    });
  } catch (err) {
    throw new TikTokApiError(`Network error while fetching ${label}: ${err.message}`, 'NETWORK_ERROR');
  }

  const contentType = response.headers.get('content-type') || '';
  let text = await response.text();

  // Clean the response to extract JSON
  text = cleanJsonFromResponse(text);

  // Validate that we have something that looks like JSON
  if (!text.trim().match(/^[{\[]/)) {
    // Try one more aggressive extraction
    const jsonMatch = text.match(/([{\[][\s\S]*[}\]])/);
    if (jsonMatch) {
      text = jsonMatch[1];
    } else {
      throw new TikTokApiError(`${label} returned non-JSON response (possible block)`, 'API_ERROR');
    }
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    // Try one more time with regex extraction
    try {
      const match = text.match(/([{\[][\s\S]*[}\]])/);
      if (match) {
        data = JSON.parse(match[1]);
      } else {
        throw err;
      }
    } catch (secondErr) {
      // Log first 500 chars for debugging
      // eslint-disable-next-line no-console
      console.error(`JSON parse failed for ${label}. Response preview:`, text.substring(0, 500));
      throw new TikTokApiError(`Invalid JSON from ${label}: ${err.message}`, 'API_ERROR');
    }
  }

  const statusCode = data?.statusCode ?? data?.status_code;

  if (response.status === 401 || response.status === 403 || [1008, 2150, 2155].includes(statusCode)) {
    const err = new TikTokApiError('Cookies expired', 'AUTH_EXPIRED');
    err.code = 'AUTH_EXPIRED';
    throw err;
  }

  if (response.status === 404 || isUserNotFound(data)) {
    throw new TikTokApiError(`User '${username}' not found`, 'NOT_FOUND');
  }

  if (!response.ok) {
    throw new TikTokApiError(
      data?.statusMsg || data?.message || `${label} request failed (${response.status})`,
      'API_ERROR'
    );
  }

  // Log raw for debugging
  // eslint-disable-next-line no-console
  console.log(`RAW ${label}:`, JSON.stringify(data).slice(0, 2000));

  return { data };
};

const mapLatestVideos = (items = []) =>
  items.map((item) => ({
    id: item.id || item.aweme_id || item.awemeId || item.itemId,
    cover:
      item.video?.cover ||
      item.video?.originCover ||
      item.video?.dynamicCover ||
      item.video?.coverUrl ||
      null,
    views: Number(item.stats?.playCount || item.statistics?.playCount || item.statistics?.play_count || 0),
    likes: Number(item.stats?.diggCount || item.statistics?.diggCount || item.statistics?.digg_count || 0),
    comments: Number(
      item.stats?.commentCount || item.statistics?.commentCount || item.statistics?.comment_count || 0
    ),
    shares: Number(item.stats?.shareCount || item.statistics?.shareCount || item.statistics?.share_count || 0),
    createdAt: item.createTime ? new Date(item.createTime * 1000).toISOString() : null,
    desc: item.desc || item.title || '',
    duration: item.video?.duration || item.video?.durationMS || null,
  }));

// Calculate analytics from real video data only - NO FALLBACKS
const deriveAnalytics = (latestVideos, followers, likes, videos) => {
  if (!Array.isArray(latestVideos) || latestVideos.length === 0) {
    // Return null to indicate no analytics available - controller will handle
    return null;
  }

  const sampleSize = latestVideos.length;
  const totalViews = latestVideos.reduce((sum, v) => sum + (Number(v.views) || 0), 0);
  const totalEngagements = latestVideos.reduce(
    (sum, v) => sum + (Number(v.likes) || 0) + (Number(v.comments) || 0) + (Number(v.shares) || 0),
    0
  );

  if (totalViews <= 0) {
    return null; // No valid views - cannot calculate
  }

  const avgViews = totalViews / sampleSize;

  // Engagement rate = (total engagements / total views) * 100
  const engagementRate = (totalEngagements / totalViews) * 100;

  return {
    avgViews: Math.round(avgViews),
    engagementRate: Math.round(engagementRate * 100) / 100,
    sampleSize,
  };
};

const parseSigiState = (html) => {
  const marker = '<script id="SIGI_STATE" type="application/json">';
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const jsonStart = start + marker.length;
  const end = html.indexOf('</script>', jsonStart);
  if (end === -1) return null;
  const jsonString = html.slice(jsonStart, end);
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('SIGI_STATE JSON parse failed:', err.message);
    return null;
  }
};

const scrapeFromWebpage = async (username, { userAgent, cookie }) => {
  const url = `https://www.tiktok.com/@${encodeURIComponent(username)}`;
  let html;
  try {
    const res = await fetch(url, {
      headers: {
        ...buildHeaders({ userAgent, cookie }),
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
      },
    });
    html = await res.text();
  } catch (err) {
    throw new TikTokApiError(`Network error while fetching profile page: ${err.message}`, 'NETWORK_ERROR');
  }

  const sigi = parseSigiState(html);
  if (!sigi) {
    throw new TikTokApiError('Unable to parse TikTok profile page', 'API_ERROR');
  }

  const users = sigi?.UserModule?.users || {};
  const statsMap = sigi?.UserModule?.stats || {};
  const userKey =
    Object.keys(users).find((key) => key.toLowerCase() === username.toLowerCase()) || Object.keys(users)[0];
  const user = users[userKey] || {};
  const stats = statsMap[userKey] || {};

  // ItemModule can have keyed objects; flatten everything to an array of video objects
  const itemModule = sigi?.ItemModule || {};
  const videoObjects = Object.values(itemModule || {}).filter((v) => v?.id || v?.video);
  const latestVideos = mapLatestVideos(videoObjects);

  // Extract and validate numeric values - must be valid numbers
  const followers = Number(stats.followerCount || stats.fans || 0);
  const following = Number(stats.followingCount || stats.following || 0);
  const likes = Number(stats.heartCount || stats.heart || 0);
  const videoCount = Number(stats.videoCount || stats.video || 0);

  // Validate that we have real data
  if (!Number.isFinite(followers) || followers < 0) {
    throw new TikTokApiError('Invalid follower count in scraped data', 'API_ERROR');
  }
  if (!Number.isFinite(following) || following < 0) {
    throw new TikTokApiError('Invalid following count in scraped data', 'API_ERROR');
  }
  if (!Number.isFinite(likes) || likes < 0) {
    throw new TikTokApiError('Invalid likes count in scraped data', 'API_ERROR');
  }
  if (!Number.isFinite(videoCount) || videoCount < 0) {
    throw new TikTokApiError('Invalid video count in scraped data', 'API_ERROR');
  }

  // Extract bio from multiple possible fields and clean HTML
  let bioText = user.signature || user.bio || user.description || user.bioText || '';
  if (bioText && typeof bioText === 'string') {
    // Clean HTML tags and entities
    bioText = bioText
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/^Signature\s*\(Required\)\s*:\s*/i, '') // Remove prefix
      .trim();
  } else {
    bioText = '';
  }

  const profile = {
    username: user.uniqueId || user.unique_id || username,
    fullName: user.nickname || '',
    profilePic: user.avatarLarger || user.avatarThumb || user.avatarMedium || '',
    bio: bioText,
    followers,
    following,
    likes,
    videos: videoCount,
    verified: Boolean(user.verified || user.isVerified || user.customVerify),
    profilePicThumb: user.avatarThumb || null,
    region: user.region || user.country || '',
    tiktokId: user.id || user.uid || '',
    category: user.category || '',
    joinedAt: user.createTime ? new Date(user.createTime * 1000).toISOString() : null,
    secUid: user.secUid || user.sec_uid,
  };

  const analytics = deriveAnalytics(latestVideos, profile.followers, profile.likes, profile.videos);

  return { profile, analytics, latestVideos };
};

const normalizeProfile = (userDetail, videoList) => {
  const user = userDetail?.userInfo?.user || userDetail?.user || userDetail?.data?.user || userDetail || {};
  const stats = userDetail?.userInfo?.stats || userDetail?.stats || user?.stats || {};
  const videos = videoList?.itemList || videoList?.item_list || videoList?.items || [];

  const latestVideos = mapLatestVideos(videos);

  // Extract and validate numeric values - must be valid numbers
  const followers = Number(stats.followerCount || user.followerCount || 0);
  const following = Number(stats.followingCount || user.followingCount || 0);
  const likes = Number(
    stats.heartCount || stats.heart || stats.diggCount || user.heartCount || user.total_favorited || 0
  );
  const videoCount = Number(stats.videoCount || user.videoCount || user.awemeCount || 0);

  // Validate that we have real data
  if (!Number.isFinite(followers) || followers < 0) {
    throw new TikTokApiError('Invalid follower count in API response', 'API_ERROR');
  }
  if (!Number.isFinite(following) || following < 0) {
    throw new TikTokApiError('Invalid following count in API response', 'API_ERROR');
  }
  if (!Number.isFinite(likes) || likes < 0) {
    throw new TikTokApiError('Invalid likes count in API response', 'API_ERROR');
  }
  if (!Number.isFinite(videoCount) || videoCount < 0) {
    throw new TikTokApiError('Invalid video count in API response', 'API_ERROR');
  }

  // Extract bio from multiple possible fields and clean HTML
  let bioText = user.signature || user.bio || user.description || user.bioText || '';
  if (bioText && typeof bioText === 'string') {
    // Clean HTML tags and entities
    bioText = bioText
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/^Signature\s*\(Required\)\s*:\s*/i, '') // Remove prefix
      .trim();
  } else {
    bioText = '';
  }

  const profile = {
    username: user.uniqueId || user.unique_id || user.username || '',
    fullName: user.nickname || user.nicknameName || '',
    profilePic:
      user.avatarLarger ||
      user.avatarThumb ||
      user.avatarMedium ||
      user.avatarUrl ||
      user.avatar ||
      '',
    bio: bioText,
    followers,
    following,
    likes,
    videos: videoCount,
    verified: Boolean(user.verified || user.isVerified || user.customVerify),
    profilePicThumb: user.avatarThumb || null,
    region: user.region || user.country || user.regionCode || user.region_name || '',
    tiktokId: user.id || user.userId || user.uid || '',
    category: user.category || user.businessCategory || user.business_category || '',
    joinedAt: user.createTime ? new Date(user.createTime * 1000).toISOString() : null,
    secUid: user.secUid || user.sec_uid || '',
  };

  const analytics = deriveAnalytics(latestVideos, profile.followers, profile.likes, profile.videos);

  return { profile, analytics, latestVideos };
};

const buildUserDetailUrl = (username, region, deviceId, msToken) => {
  const params = new URLSearchParams({
    uniqueId: username,
    aid: '1988',
    device_platform: 'web',
    region: region,
    browser_region: region,
    priority_region: region,
    device_id: deviceId,
    msToken: msToken,
    versionCode: '180800',
    versionName: '18.8.0',
    cookie_enabled: 'true',
    screen_width: '1920',
    screen_height: '1080',
    browser_language: 'en-US',
    browser_platform: 'Win32',
    browser_name: 'Mozilla',
    browser_version: '5.0',
    browser_online: 'true',
    timezone_name: 'America/New_York',
  });
  return `https://www.tiktok.com/api/user/detail/?${params.toString()}`;
};

const buildItemListUrl = (secUid, region, deviceId, msToken) => {
  const params = new URLSearchParams({
    secUid: secUid,
    count: '30',
    cursor: '0',
    aid: '1988',
    device_platform: 'web',
    region: region,
    browser_region: region,
    priority_region: region,
    device_id: deviceId,
    msToken: msToken,
    versionCode: '180800',
    versionName: '18.8.0',
    cookie_enabled: 'true',
    screen_width: '1920',
    screen_height: '1080',
    browser_language: 'en-US',
    browser_platform: 'Win32',
    browser_name: 'Mozilla',
    browser_version: '5.0',
    browser_online: 'true',
    timezone_name: 'America/New_York',
  });
  return `https://www.tiktok.com/api/post/item_list/?${params.toString()}`;
};

const fetchTikTokProfile = async (username) => {
  if (!username) {
    throw new TikTokApiError('Username is required', 'BAD_REQUEST');
  }

  const userAgent = pickUserAgent();
  const msToken = generateMsToken();
  const ttWebId = generateTtWebId();
  const sWebId = generateSWebId();
  const deviceId = generateDeviceId();
  const cookie = buildCookie({ msToken, ttWebId, sWebId });

  const regions = ['US', 'SG', 'IN'];
  const regionErrors = [];

  // Try each region in sequence
  for (const region of regions) {
    try {
      // eslint-disable-next-line no-console
      console.log(`Attempting region ${region} for user ${username}`);

      // Build URL with all required parameters
      const detailUrl = buildUserDetailUrl(username, region, deviceId, msToken);

      let userDetailRes;
      try {
        userDetailRes = await requestTikTok({
          url: detailUrl,
          label: `user detail (${region})`,
          username,
          userAgent,
          cookie,
          msToken,
        });
      } catch (detailErr) {
        // If auth expired or not found, don't try other regions
        if (detailErr.code === 'AUTH_EXPIRED' || detailErr.code === 'NOT_FOUND') {
          throw detailErr;
        }
        // Log and continue to next region
        regionErrors.push({ region, step: 'user detail', error: detailErr.message });
        // eslint-disable-next-line no-console
        console.warn(`Region ${region} failed at user detail: ${detailErr.message}`);
        continue;
      }

      // Extract user data
      const user = userDetailRes.data?.userInfo?.user || userDetailRes.data?.user || userDetailRes.data;
      const secUid = user?.secUid || user?.sec_uid;

      if (!secUid) {
        regionErrors.push({ region, step: 'secUid resolution', error: 'Unable to resolve secUid' });
        // eslint-disable-next-line no-console
        console.warn(`Region ${region} failed: Unable to resolve secUid`);
        continue;
      }

      // Fetch item list
      const itemUrl = buildItemListUrl(secUid, region, deviceId, msToken);

      let itemListRes;
      try {
        itemListRes = await requestTikTok({
          url: itemUrl,
          label: `item list (${region})`,
          username,
          userAgent,
          cookie,
          msToken,
        });
      } catch (itemErr) {
        // If auth expired, don't try other regions
        if (itemErr.code === 'AUTH_EXPIRED') {
          throw itemErr;
        }
        // Log and continue to next region
        regionErrors.push({ region, step: 'item list', error: itemErr.message });
        // eslint-disable-next-line no-console
        console.warn(`Region ${region} failed at item list: ${itemErr.message}`);
        continue;
      }

      // Normalize profile data
      let profile, analytics, latestVideos;
      try {
        const normalized = normalizeProfile(userDetailRes.data, itemListRes.data);
        profile = normalized.profile;
        analytics = normalized.analytics;
        latestVideos = normalized.latestVideos;
      } catch (normalizeErr) {
        regionErrors.push({ region, step: 'normalization', error: normalizeErr.message });
        // eslint-disable-next-line no-console
        console.warn(`Region ${region} failed at normalization: ${normalizeErr.message}`);
        continue;
      }

      if (!profile.username) {
        regionErrors.push({ region, step: 'profile validation', error: 'Empty profile data' });
        // eslint-disable-next-line no-console
        console.warn(`Region ${region} failed: TikTok returned empty profile data`);
        continue;
      }

      let bestProfile = profile;
      let bestAnalytics = analytics;
      let bestVideos = latestVideos;

      // Attempt HTML scrape as a sanity check; prefer scraped stats if API looks inflated or missing
      try {
        const scraped = await scrapeFromWebpage(username, { userAgent, cookie });
        if (scraped?.profile) {
          const scrapedFollowers = scraped.profile.followers || 0;
          const bestFollowers = bestProfile.followers || 0;
          const ratio = scrapedFollowers && bestFollowers ? bestFollowers / scrapedFollowers : 0;

          const preferScraped =
            scrapedFollowers &&
            (!bestFollowers ||
              ratio > 1.5 || // API way bigger than scrape (likely wrong)
              ratio < 0.66 || // API way smaller than scrape
              Math.abs(bestFollowers - scrapedFollowers) > 1_000_000); // big absolute gap

          if (preferScraped) {
            bestProfile = {
              ...scraped.profile,
              // keep secUid if API had it
              secUid: bestProfile.secUid || scraped.profile.secUid,
            };
            bestAnalytics = scraped.analytics || bestAnalytics;
            bestVideos = scraped.latestVideos?.length ? scraped.latestVideos : bestVideos;
          } else {
            // Even if we keep API stats, fill missing media fields from scrape
            bestProfile = {
              ...bestProfile,
              profilePic: bestProfile.profilePic || scraped.profile.profilePic,
              profilePicThumb: bestProfile.profilePicThumb || scraped.profile.profilePicThumb,
            };
            if (!bestVideos?.length && scraped.latestVideos?.length) {
              bestVideos = scraped.latestVideos;
            }
          }
        }
      } catch (scrapeErr) {
        // eslint-disable-next-line no-console
        console.warn('HTML scrape fallback failed:', scrapeErr.message);
      }

      // Validate that we have real data
      if (!bestProfile.followers || bestProfile.followers <= 0) {
        regionErrors.push({ region, step: 'validation', error: 'Invalid follower count' });
        // eslint-disable-next-line no-console
        console.warn(`Region ${region} failed: Invalid follower count`);
        continue;
      }
      if (!bestProfile.videos || bestProfile.videos < 0) {
        regionErrors.push({ region, step: 'validation', error: 'Invalid video count' });
        // eslint-disable-next-line no-console
        console.warn(`Region ${region} failed: Invalid video count`);
        continue;
      }
      if (bestProfile.likes === undefined || bestProfile.likes < 0) {
        regionErrors.push({ region, step: 'validation', error: 'Invalid likes count' });
        // eslint-disable-next-line no-console
        console.warn(`Region ${region} failed: Invalid likes count`);
        continue;
      }

      // Success! Return the data
      // eslint-disable-next-line no-console
      console.log(`Successfully fetched data from region ${region}`);
      return {
        profile: bestProfile,
        analytics: bestAnalytics,
        latestVideos: bestVideos,
        raw: {
          userDetail: userDetailRes.data,
          itemList: itemListRes.data,
        },
      };
    } catch (err) {
      // If it's auth expired or not found, don't try other regions
      if (err.code === 'AUTH_EXPIRED' || err.code === 'NOT_FOUND') {
        throw err;
      }
      // Log the error and continue to next region
      regionErrors.push({ region, step: 'general', error: err.message });
      // eslint-disable-next-line no-console
      console.warn(`Region ${region} failed: ${err.message}`);
    }
  }

  // All regions failed - try HTML scrape as final fallback
  // eslint-disable-next-line no-console
  console.warn(`All regions failed, attempting HTML scrape fallback. Errors:`, regionErrors);

  try {
    const fallback = await scrapeFromWebpage(username, { userAgent, cookie });

    // Validate scraped data - must have real values
    if (!fallback.profile.followers || fallback.profile.followers <= 0) {
      throw new TikTokApiError('Scraped profile has invalid follower count', 'API_ERROR');
    }
    if (fallback.profile.videos === undefined || fallback.profile.videos < 0) {
      throw new TikTokApiError('Scraped profile has invalid video count', 'API_ERROR');
    }

    // eslint-disable-next-line no-console
    console.log('Successfully fetched data from HTML scrape fallback');
    return {
      profile: fallback.profile,
      analytics: fallback.analytics,
      latestVideos: fallback.latestVideos,
      raw: { source: 'html' },
    };
  } catch (fallbackErr) {
    // If fallback also fails, throw comprehensive error
    const errorMessage = `Failed to fetch TikTok profile from all sources. Region errors: ${regionErrors.map(e => `${e.region} (${e.step}): ${e.error}`).join('; ')}. Fallback error: ${fallbackErr.message}`;
    throw new TikTokApiError(errorMessage, 'API_ERROR');
  }
};

module.exports = {
  fetchTikTokProfile,
  TikTokApiError,
};