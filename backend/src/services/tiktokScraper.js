/**
 * TikTok Scraper - Universal Implementation
 * Works for ALL TikTok users with robust regex extraction
 * Multiple fallback strategies, no Puppeteer required
 */

const { getNextUserAgent, buildBrowserHeaders } = require('../utils/headers');

class TikTokScraperError extends Error {
    constructor(message, code = 'SCRAPER_ERROR') {
        super(message);
        this.code = code;
        this.name = 'TikTokScraperError';
    }
}

/**
 * Convert string numbers with K/M/B suffixes to integers
 */
const parseNumber = (value) => {
    if (typeof value === 'number') return Math.floor(value);
    if (typeof value !== 'string' && typeof value !== 'number') return 0;

    const cleaned = value.toString().trim().replace(/,/g, '');
    if (!cleaned) return 0;

    const upper = cleaned.toUpperCase();
    if (upper.endsWith('K')) {
        return Math.floor(parseFloat(upper) * 1000);
    }
    if (upper.endsWith('M')) {
        return Math.floor(parseFloat(upper) * 1000000);
    }
    if (upper.endsWith('B')) {
        return Math.floor(parseFloat(upper) * 1000000000);
    }

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.floor(parsed);
};

/**
 * Sanitize and parse JSON safely with multiple attempts
 */
const safeJSONParse = (jsonString) => {
    if (!jsonString || typeof jsonString !== 'string') return null;

    // Try direct parse
    try {
        return JSON.parse(jsonString);
    } catch (err) {
        // Try fixing common issues
        try {
            let fixed = jsonString
                .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
                .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '')  // Remove control chars
                .replace(/\\'/g, "'");  // Fix escaped quotes
            return JSON.parse(fixed);
        } catch (err2) {
            // Try extracting largest JSON object
            try {
                const match = jsonString.match(/({[\s\S]{100,}?})/);
                if (match && match[1]) {
                    return JSON.parse(match[1]);
                }
            } catch (err3) {
                return null;
            }
        }
    }
    return null;
};

/**
 * Extract JSON from HTML using ALL known strategies with robust regex
 */
const extractJSONFromHTML = (html) => {
    if (!html || typeof html !== 'string') return null;

    // Silent mode

    // Strategy 1: <script id="SIGI_STATE" type="application/json"> (MOST COMMON)
    try {
        // More flexible regex - handles variations in attribute order
        const sigiPatterns = [
            /<script[^>]*id\s*=\s*["']SIGI_STATE["'][^>]*type\s*=\s*["']application\/json["'][^>]*>([\s\S]*?)<\/script>/i,
            /<script[^>]*type\s*=\s*["']application\/json["'][^>]*id\s*=\s*["']SIGI_STATE["'][^>]*>([\s\S]*?)<\/script>/i,
            /<script[^>]*id\s*=\s*["']SIGI_STATE["'][^>]*>([\s\S]*?)<\/script>/i,
        ];

        for (const pattern of sigiPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const parsed = safeJSONParse(match[1].trim());
                if (parsed && (parsed.UserModule || parsed.UserPage || parsed['__DEFAULT_SCOPE__'])) {
                    // Found data
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Strategy failed
    }

    // Strategy 2: window['SIGI_STATE'] or window.SIGI_STATE (STRONG REGEX)
    try {
        const windowPatterns = [
            /window\s*\[\s*['"]SIGI_STATE['"]\s*\]\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const|function)/m,
            /window\.SIGI_STATE\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const|function)/m,
            /window\s*\[\s*['"]SIGI_STATE['"]\s*\]\s*=\s*({[\s\S]*?});/m,
            /window\.SIGI_STATE\s*=\s*({[\s\S]*?});/m,
        ];

        for (const pattern of windowPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const parsed = safeJSONParse(match[1].trim());
                if (parsed && (parsed.UserModule || parsed.UserPage || parsed['__DEFAULT_SCOPE__'])) {
                    // Found data
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Strategy failed
    }

    // Strategy 3: __NEXT_DATA__ (NEXT.JS)
    try {
        const nextDataPatterns = [
            /<script[^>]*id\s*=\s*["']__NEXT_DATA__["'][^>]*type\s*=\s*["']application\/json["'][^>]*>([\s\S]*?)<\/script>/i,
            /<script[^>]*id\s*=\s*["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i,
        ];

        for (const pattern of nextDataPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const parsed = safeJSONParse(match[1].trim());
                if (parsed && parsed.props && parsed.props.pageProps) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Strategy failed
    }

    // Strategy 4: window.__UNIVERSAL_DATA__ or __UNIVERSAL_DATA__
    try {
        const universalPatterns = [
            /window\.__UNIVERSAL_DATA__\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const)/m,
            /window\s*\[\s*['"]__UNIVERSAL_DATA__['"]\s*\]\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const)/m,
        ];

        for (const pattern of universalPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const parsed = safeJSONParse(match[1].trim());
                if (parsed && (parsed.UserModule || parsed.UserPage || parsed.userInfo)) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Strategy failed
    }

    // Strategy 5: window.__INIT_PROPS__
    try {
        const initPropsPatterns = [
            /window\.__INIT_PROPS__\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const)/m,
            /window\s*\[\s*['"]__INIT_PROPS__['"]\s*\]\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const)/m,
        ];

        for (const pattern of initPropsPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const parsed = safeJSONParse(match[1].trim());
                if (parsed && (parsed.UserModule || parsed.UserPage || parsed.userInfo)) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Strategy failed
    }

    // Strategy 6: Any <script type="application/json"> containing UserModule/UserPage
    try {
        const scriptTags = html.match(/<script[^>]*type\s*=\s*["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi);
        if (scriptTags) {
            for (const tag of scriptTags) {
                const contentMatch = tag.match(/>([\s\S]*?)<\/script>/i);
                if (contentMatch && contentMatch[1]) {
                    const parsed = safeJSONParse(contentMatch[1].trim());
                    if (parsed && (parsed.UserModule || parsed.UserPage || parsed.userInfo || parsed.props)) {
                        return parsed;
                    }
                }
            }
        }
    } catch (err) {
        // Strategy failed
    }

    // Strategy 7: Find any script tag containing UserModule or UserPage (BROAD SEARCH)
    try {
        const scriptTags = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
        if (scriptTags) {
            for (const tag of scriptTags) {
                if (tag.includes('UserModule') || tag.includes('UserPage') || tag.includes('userInfo')) {
                    // Try to extract JSON object
                    const jsonMatches = [
                        tag.match(/({"UserModule":[\s\S]*?})/),
                        tag.match(/({"UserPage":[\s\S]*?})/),
                        tag.match(/({[\s\S]*?"UserModule"[\s\S]*?})/),
                        tag.match(/({[\s\S]{500,}?})/),
                    ];

                    for (const jsonMatch of jsonMatches) {
                        if (jsonMatch && jsonMatch[1]) {
                            const parsed = safeJSONParse(jsonMatch[1]);
                            if (parsed && (parsed.UserModule || parsed.UserPage || parsed.userInfo)) {
                                return parsed;
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        // Strategy failed
    }

    // Strategy 8: Direct JSON object search (LAST RESORT)
    try {
        const directMatches = [
            html.match(/({"UserModule":[\s\S]{500,}?})/),
            html.match(/({"UserPage":[\s\S]{500,}?})/),
            html.match(/({[\s\S]*?"UserModule"[\s\S]{500,}?})/),
        ];

        for (const match of directMatches) {
            if (match && match[1]) {
                const parsed = safeJSONParse(match[1]);
                if (parsed && (parsed.UserModule || parsed.UserPage)) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Strategy failed
    }

    // All strategies failed - trying direct extraction
    return null;
};

/**
 * Extract values directly from script tags using regex (fallback for incomplete JSON)
 */
const extractDirectValues = (html, username) => {
    if (!html || typeof html !== 'string') return null;

    // Trying direct extraction

    const result = {
        username: username,
        nickname: username,
        avatar: '',
        followers: 0,
        following: 0,
        likes: 0,
        videos: 0,
        verified: false,
        bio: '',
        tiktokId: '',
        region: '',
    };

    try {
        // Extract follower count
        const followerPatterns = [
            /"followerCount"\s*:\s*(\d+)/i,
            /"follower_count"\s*:\s*(\d+)/i,
            /"followers"\s*:\s*(\d+)/i,
            /followerCount["\s]*:[\s]*(\d+)/i,
        ];

        for (const pattern of followerPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.followers = parseNumber(match[1]);
                break;
            }
        }

        // Extract following count
        const followingPatterns = [
            /"followingCount"\s*:\s*(\d+)/i,
            /"following_count"\s*:\s*(\d+)/i,
            /"following"\s*:\s*(\d+)/i,
            /followingCount["\s]*:[\s]*(\d+)/i,
        ];

        for (const pattern of followingPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.following = parseNumber(match[1]);
                break;
            }
        }

        // Extract likes/hearts
        const likesPatterns = [
            /"heartCount"\s*:\s*(\d+)/i,
            /"heart_count"\s*:\s*(\d+)/i,
            /"totalFavorited"\s*:\s*(\d+)/i,
            /"likes"\s*:\s*(\d+)/i,
            /heartCount["\s]*:[\s]*(\d+)/i,
        ];

        for (const pattern of likesPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.likes = parseNumber(match[1]);
                break;
            }
        }

        // Extract video count
        const videoPatterns = [
            /"videoCount"\s*:\s*(\d+)/i,
            /"video_count"\s*:\s*(\d+)/i,
            /"videos"\s*:\s*(\d+)/i,
            /videoCount["\s]*:[\s]*(\d+)/i,
        ];

        for (const pattern of videoPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.videos = parseNumber(match[1]);
                break;
            }
        }

        // Extract TikTok ID
        const idPatterns = [
            /"id"\s*:\s*"(\d+)"/i,
            /"uid"\s*:\s*"(\d+)"/i,
            /"userId"\s*:\s*"(\d+)"/i,
            /"tiktokId"\s*:\s*"(\d+)"/i,
            /"id"\s*:\s*(\d+)/i,
        ];

        for (const pattern of idPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.tiktokId = match[1];
                break;
            }
        }

        // Extract avatar/profile picture - FIX URL ENCODING
        const avatarPatterns = [
            /"avatarLarger"\s*:\s*"([^"]+)"/i,
            /"avatarMedium"\s*:\s*"([^"]+)"/i,
            /"avatarThumb"\s*:\s*"([^"]+)"/i,
            /"avatar"\s*:\s*"([^"]+)"/i,
            /"profilePicture"\s*:\s*"([^"]+)"/i,
        ];

        const fixUrl = (url) => {
            if (!url || typeof url !== 'string') return '';
            return url
                .replace(/\\u002F/g, '/')  // Fix \u002F -> /
                .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
                .replace(/\\\//g, '/')
                .replace(/\\"/g, '"')
                .replace(/\\n/g, '\n')
                .trim();
        };

        for (const pattern of avatarPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.avatar = fixUrl(match[1]);
                // Avatar extracted
                break;
            }
        }

        // Extract nickname
        const nicknamePatterns = [
            /"nickname"\s*:\s*"([^"]+)"/i,
            /"displayName"\s*:\s*"([^"]+)"/i,
            /"name"\s*:\s*"([^"]+)"/i,
        ];

        for (const pattern of nicknamePatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.nickname = match[1].replace(/\\\//g, '/').replace(/\\"/g, '"');
                break;
            }
        }

        // Extract uniqueId/username
        const usernamePatterns = [
            /"uniqueId"\s*:\s*"([^"]+)"/i,
            /"unique_id"\s*:\s*"([^"]+)"/i,
            /"username"\s*:\s*"([^"]+)"/i,
        ];

        for (const pattern of usernamePatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.username = match[1].replace(/\\\//g, '/').replace(/\\"/g, '"');
                break;
            }
        }

        // Extract bio (signature) - IMPROVED with better patterns
        const bioPatterns = [
            /"bio_description"\s*:\s*"([^"]{5,})"/gi,  // TikTok's main bio field - CHECK FIRST
            /"signature"\s*:\s*"([^"]{5,})"/gi,
            /"bio"\s*:\s*"([^"]{5,})"/gi,
            /"description"\s*:\s*"([^"]{5,})"/gi,
            /"bioText"\s*:\s*"([^"]{5,})"/gi,
            /signature["\s]*:[\s]*"([^"]{5,})"/gi,
            /bio["\s]*:[\s]*"([^"]{5,})"/gi,
            /description["\s]*:[\s]*"([^"]{5,})"/gi,
        ];

        let foundBio = '';
        for (const pattern of bioPatterns) {
            try {
                const matches = [...html.matchAll(new RegExp(pattern.source, 'gi'))];
                if (matches && matches.length > 0) {
                    // Get the last match (most likely to be the user's bio)
                    for (let i = matches.length - 1; i >= 0; i--) {
                        const match = matches[i];
                        if (match && match[1]) {
                            let extracted = match[1]
                                .replace(/\\u002F/g, '/')
                                .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
                                .replace(/\\\//g, '/')
                                .replace(/\\"/g, '"')
                                .replace(/\\n/g, '\n')
                                .replace(/\\t/g, '\t')
                                .replace(/\\r/g, '\r')
                                .replace(/&nbsp;/g, ' ')
                                .replace(/&amp;/g, '&')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&quot;/g, '"')
                                .replace(/&#39;/g, "'")
                                .replace(/<[^>]*>/g, '')
                                .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
                                .trim();
                            
                            // Filter out invalid bios - STRICT FILTERING
                            if (extracted && 
                                extracted.length > 5 &&  // Minimum 5 characters
                                extracted !== 'Signature (Required):' &&
                                !extracted.toLowerCase().startsWith('signature') &&
                                !extracted.toLowerCase().includes('tiktok') &&
                                !extracted.toLowerCase().includes('required') &&
                                !extracted.match(/^\d+$/) &&
                                !extracted.match(/^signature\s*\(/i)) {
                                foundBio = extracted;
                                break;
                            }
                        }
                    }
                    if (foundBio) break;
                }
            } catch (err) {
                // Continue to next pattern
                console.warn(`[Scraper] Bio pattern error: ${err.message}`);
            }
        }
        
        if (foundBio) {
            result.bio = foundBio;
        }

        // Check if we got at least some data
        if (result.followers > 0 || result.likes > 0 || result.tiktokId || result.avatar) {
            // Direct extraction successful
            return result;
        }
    } catch (err) {
        // Direct extraction failed
    }

    return null;
};

/**
 * Deep search for values in nested objects
 */
const deepSearch = (obj, keyPatterns, maxDepth = 10, depth = 0) => {
    if (depth > maxDepth || !obj || typeof obj !== 'object') return null;

    for (const pattern of keyPatterns) {
        if (typeof pattern === 'string') {
            if (obj.hasOwnProperty(pattern)) return obj[pattern];
        } else if (pattern instanceof RegExp) {
            for (const key in obj) {
                if (pattern.test(key)) return obj[key];
            }
        }
    }

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (value && typeof value === 'object') {
                const found = deepSearch(value, keyPatterns, maxDepth, depth + 1);
                if (found !== null && found !== undefined) return found;
            }
        }
    }

    return null;
};

/**
 * Extract stats from data object
 */
const extractStats = (data, userId = null) => {
    if (!data || typeof data !== 'object') {
        return { followers: 0, following: 0, likes: 0, videos: 0 };
    }

    let stats = null;

    // Try UserModule.stats[userId]
    if (userId && data.UserModule?.stats?.[userId]) {
        stats = data.UserModule.stats[userId];
    }
    // Try UserModule.stats (first entry)
    else if (data.UserModule?.stats) {
        const statsObj = data.UserModule.stats;
        const firstKey = Object.keys(statsObj)[0];
        if (firstKey) stats = statsObj[firstKey];
    }
    // Try UserPage.userInfo.stats
    else if (data.UserPage?.userInfo?.stats) {
        stats = data.UserPage.userInfo.stats;
    }
    // Try UserPage.stats
    else if (data.UserPage?.stats) {
        stats = data.UserPage.stats;
    }
    // Try props.pageProps
    else if (data.props?.pageProps?.userInfo?.stats) {
        stats = data.props.pageProps.userInfo.stats;
    }
    // Try __DEFAULT_SCOPE__
    else if (data['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo?.stats) {
        stats = data['__DEFAULT_SCOPE__']['webapp.user-detail'].userInfo.stats;
    }
    // Deep search
    else {
        stats = deepSearch(data, ['stats', /stats/i]);
    }

    const extractStat = (statObj, keys) => {
        if (!statObj) return 0;
        for (const key of keys) {
            const value = deepSearch(statObj, [key, new RegExp(key, 'i')]);
            if (value !== null && value !== undefined) {
                return parseNumber(value);
            }
        }
        return 0;
    };

    return {
        followers: extractStat(stats, ['followerCount', 'follower_count', 'followers', 'fans']),
        following: extractStat(stats, ['followingCount', 'following_count', 'following']),
        likes: extractStat(stats, ['heartCount', 'heart_count', 'hearts', 'totalFavorited', 'total_favorited', 'likes']),
        videos: extractStat(stats, ['videoCount', 'video_count', 'videos']),
    };
};

/**
 * Extract latest videos from data object (ItemModule)
 */
const extractLatestVideos = (data) => {
    if (!data || typeof data !== 'object') {
        return [];
    }

    let videoItems = [];

    // Try ItemModule (most common)
    if (data.ItemModule && typeof data.ItemModule === 'object') {
        // ItemModule can be an object with keys, convert to array
        const itemModule = data.ItemModule;
        if (Array.isArray(itemModule)) {
            videoItems = itemModule;
        } else {
            // Convert object to array
            videoItems = Object.values(itemModule).filter(item => item && (item.id || item.aweme_id || item.video));
        }
    }
    // Try UserPage.itemList
    else if (data.UserPage?.itemList && Array.isArray(data.UserPage.itemList)) {
        videoItems = data.UserPage.itemList;
    }
    // Try props.pageProps.itemList
    else if (data.props?.pageProps?.itemList && Array.isArray(data.props.pageProps.itemList)) {
        videoItems = data.props.pageProps.itemList;
    }
    // Try __DEFAULT_SCOPE__
    else if (data['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.itemList) {
        videoItems = Array.isArray(data['__DEFAULT_SCOPE__']['webapp.user-detail'].itemList)
            ? data['__DEFAULT_SCOPE__']['webapp.user-detail'].itemList
            : Object.values(data['__DEFAULT_SCOPE__']['webapp.user-detail'].itemList || {});
    }

    // Map videos to standard format
    const mappedVideos = videoItems
        .filter(item => item && (item.id || item.aweme_id || item.awemeId || item.itemId))
        .slice(0, 30) // Get latest 30 videos
        .map((item) => {
            // Extract views/playCount - try multiple paths
            const views = Number(
                item.stats?.playCount ||
                item.statistics?.playCount ||
                item.statistics?.play_count ||
                item.playCount ||
                item.viewCount ||
                item.views ||
                item.stats?.viewCount ||
                item.stats?.view_count ||
                0
            );

            // Extract likes
            const likes = Number(
                item.stats?.diggCount ||
                item.statistics?.diggCount ||
                item.statistics?.digg_count ||
                item.diggCount ||
                item.likes ||
                0
            );

            // Extract comments
            const comments = Number(
                item.stats?.commentCount ||
                item.statistics?.commentCount ||
                item.statistics?.comment_count ||
                item.commentCount ||
                item.comments ||
                0
            );

            // Extract shares
            const shares = Number(
                item.stats?.shareCount ||
                item.statistics?.shareCount ||
                item.statistics?.share_count ||
                item.shareCount ||
                item.shares ||
                0
            );

            return {
                id: item.id || item.aweme_id || item.awemeId || item.itemId || '',
                cover: item.video?.cover || item.video?.originCover || item.video?.dynamicCover || item.video?.coverUrl || null,
                views: views,
                likes: likes,
                comments: comments,
                shares: shares,
                createdAt: item.createTime ? new Date(item.createTime * 1000).toISOString() : null,
                desc: item.desc || item.title || item.text || '',
                duration: item.video?.duration || item.video?.durationMS || null,
            };
        });

    // Log extraction results
    const videosWithViews = mappedVideos.filter(v => v.views > 0);
    console.log(`[VideoExtract] Mapped ${mappedVideos.length} videos, ${videosWithViews.length} have views > 0`);

    if (videosWithViews.length > 0) {
        const avgViews = videosWithViews.reduce((sum, v) => sum + v.views, 0) / videosWithViews.length;
        console.log(`[VideoExtract] Average views: ${avgViews.toLocaleString()}`);
    }

    // Return all videos (even with 0 views) - let controller handle filtering
    return mappedVideos;
};

/**
 * Extract user info from data object
 */
const extractUserInfo = (data, username) => {
    if (!data || typeof data !== 'object') return null;

    let userInfo = null;

    // Try UserModule.users[username]
    if (data.UserModule?.users) {
        const users = data.UserModule.users;
        const userKey = Object.keys(users).find(k => k.toLowerCase() === username.toLowerCase()) || Object.keys(users)[0];
        if (userKey) userInfo = users[userKey];
    }
    // Try UserPage.userInfo.user
    else if (data.UserPage?.userInfo) {
        userInfo = data.UserPage.userInfo.user || data.UserPage.userInfo;
    }
    // Try props.pageProps
    else if (data.props?.pageProps?.userInfo) {
        userInfo = data.props.pageProps.userInfo.user || data.props.pageProps.userInfo;
    }
    // Try __DEFAULT_SCOPE__
    else if (data['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo) {
        userInfo = data['__DEFAULT_SCOPE__']['webapp.user-detail'].userInfo.user ||
            data['__DEFAULT_SCOPE__']['webapp.user-detail'].userInfo;
    }
    // Deep search
    else {
        userInfo = deepSearch(data, ['user', 'userInfo', 'userDetail']);
    }

    if (!userInfo) return null;

    // Extract user stats from userInfo if available
    const userStats = extractStats({ userInfo }, userInfo.id || userInfo.uid);

    // Extract signature/bio from all possible paths
    const extractSignature = (obj, rootData) => {
        if (!obj || typeof obj !== 'object') return '';
        
        // Try all possible signature/bio paths in userInfo
        const paths = [
            obj.signature,
            obj.bio,
            obj.description,
            obj.bioText,
        ];
        
        for (const path of paths) {
            if (path && typeof path === 'string' && path.trim()) {
                return path.trim();
            }
        }
        
        // Try deep search in root data if userInfo doesn't have it
        if (rootData) {
            const deepSignature = deepSearch(rootData, ['signature', 'bio', 'description', 'bioText']);
            if (deepSignature && typeof deepSignature === 'string' && deepSignature.trim()) {
                return deepSignature.trim();
            }
        }
        
        return '';
    };

    const bio = extractSignature(userInfo, data);

    return {
        username: userInfo.uniqueId || userInfo.unique_id || userInfo.username || userInfo.id || username,
        nickname: userInfo.nickname || userInfo.nicknameName || userInfo.displayName || userInfo.name || username,
        avatar: userInfo.avatarLarger || userInfo.avatarMedium || userInfo.avatarThumb || userInfo.avatar || userInfo.avatarUrl || '',
        verified: Boolean(userInfo.verified || userInfo.isVerified),
        bio: bio,
        tiktokId: userInfo.id || userInfo.uid || userInfo.userId || '',
        region: userInfo.region || userInfo.country || '',
        category: userInfo.category || '',
        joinedAt: userInfo.createTime ? new Date(userInfo.createTime * 1000).toISOString() : null,
        secUid: userInfo.secUid || userInfo.sec_uid || '',
        userStats,
    };
};

/**
 * Parse user data from extracted JSON (never throws - returns defaults)
 */
const parseUserData = (data, username) => {
    if (!data || typeof data !== 'object') {
        console.warn('[Scraper] Invalid data structure, using defaults');
        return {
            username: username,
            nickname: username,
            avatar: '',
            followers: 0,
            following: 0,
            likes: 0,
            videos: 0,
            verified: false,
            bio: '',
            tiktokId: '',
            region: '',
            category: '',
            joinedAt: null,
            secUid: '',
        };
    }

    // Extract user info (never throws)
    const userInfo = extractUserInfo(data, username) || {
        username: username,
        nickname: username,
        avatar: '',
        verified: false,
        bio: '',
        tiktokId: '',
        region: '',
        category: '',
        joinedAt: null,
        secUid: '',
        userStats: { followers: 0, following: 0, likes: 0, videos: 0 },
    };

    // Extract stats (never throws)
    let stats = { followers: 0, following: 0, likes: 0, videos: 0 };
    try {
        stats = extractStats(data, userInfo.tiktokId);
    } catch (err) {
        console.warn('[Scraper] Stats extraction failed, using defaults');
    }

    // Combine stats (prefer data stats, fallback to userInfo stats)
    const finalStats = {
        followers: stats.followers || userInfo.userStats?.followers || 0,
        following: stats.following || userInfo.userStats?.following || 0,
        likes: stats.likes || userInfo.userStats?.likes || 0,
        videos: stats.videos || userInfo.userStats?.videos || 0,
    };

    // Extract bio from userInfo - ensure we get signature
    const bio = (userInfo.bio || '').toString().trim();
    
    // Clean bio - remove "Signature (Required):" prefix if present
    const cleanBio = bio.replace(/^Signature\s*\(Required\)\s*:\s*/i, '').trim();

    return {
        username: (userInfo.username || username).trim(),
        nickname: userInfo.nickname || userInfo.username || username,
        avatar: userInfo.avatar || '',
        followers: Math.max(0, finalStats.followers),
        following: Math.max(0, finalStats.following),
        likes: Math.max(0, finalStats.likes),
        videos: Math.max(0, finalStats.videos),
        verified: userInfo.verified || false,
        bio: cleanBio,
        tiktokId: userInfo.tiktokId || '',
        region: userInfo.region || '',
        category: userInfo.category || '',
        joinedAt: userInfo.joinedAt || null,
        secUid: userInfo.secUid || '',
    };
};

/**
 * Scrape using fetch with retry logic
 */
const scrapeWithFetch = async (username, retryCount = 0) => {
    const MAX_RETRIES = 2; // Reduced to 2 for faster response (4 second target)
    const cleanUsername = username.trim().replace('@', '');
    const url = `https://www.tiktok.com/@${cleanUsername}`;
    const userAgent = getNextUserAgent();
    const headers = buildBrowserHeaders(userAgent, url);

    if (retryCount > 0) {
        // Reduced delay for faster response (4 second target)
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    }

    // Silent mode - only log errors

    try {
        const response = await fetch(url, {
            headers,
            redirect: 'follow',
            signal: AbortSignal.timeout(5000), // Reduced to 5 seconds for faster response
        });

        if (response.status === 429 && retryCount < MAX_RETRIES) {
            console.warn('[Scraper] 429 received, retrying...');
            return scrapeWithFetch(username, retryCount + 1);
        }

        if (response.status === 404) {
            throw new TikTokScraperError(`User '@${cleanUsername}' not found`, 'NOT_FOUND');
        }

        if (!response.ok && retryCount < MAX_RETRIES && response.status >= 500) {
            console.warn(`[Scraper] HTTP ${response.status}, retrying...`);
            return scrapeWithFetch(username, retryCount + 1);
        }

        if (!response.ok) {
            throw new TikTokScraperError(`HTTP ${response.status}`, 'HTTP_ERROR');
        }

        const html = await response.text();

        if (!html || html.length < 1000) {
            if (retryCount < MAX_RETRIES) {
                return scrapeWithFetch(username, retryCount + 1);
            }
            throw new TikTokScraperError('Empty HTML response', 'EMPTY_RESPONSE');
        }

        // Check for captcha
        if (html.toLowerCase().includes('captcha-container') ||
            html.toLowerCase().includes('verify-you-are-human')) {
            throw new TikTokScraperError('Captcha detected', 'CAPTCHA_REQUIRED');
        }

        // Try JSON extraction first
        const jsonData = extractJSONFromHTML(html);
        if (jsonData) {
            const parsed = parseUserData(jsonData, cleanUsername);
            const videos = extractLatestVideos(jsonData);
            // If we got good data, return it with videos
            if (parsed.followers > 0 || parsed.likes > 0 || parsed.tiktokId) {
                return { ...parsed, latestVideos: videos };
            }
        }

        // Try direct value extraction (fallback for incomplete JSON)
        const directData = extractDirectValues(html, cleanUsername);
        if (directData && (directData.followers > 0 || directData.likes > 0 || directData.tiktokId || directData.avatar)) {
            // Merge with JSON data if available
            if (jsonData) {
                const jsonParsed = parseUserData(jsonData, cleanUsername);
                const videos = extractLatestVideos(jsonData);
                return {
                    ...jsonParsed,
                    followers: directData.followers || jsonParsed.followers,
                    following: directData.following || jsonParsed.following,
                    likes: directData.likes || jsonParsed.likes,
                    videos: directData.videos || jsonParsed.videos,
                    tiktokId: directData.tiktokId || jsonParsed.tiktokId,
                    avatar: directData.avatar || jsonParsed.avatar,
                    nickname: directData.nickname || jsonParsed.nickname,
                    username: directData.username || jsonParsed.username,
                    bio: directData.bio || jsonParsed.bio,
                    latestVideos: videos,
                };
            }
            return { ...directData, latestVideos: [] };
        }

        // If we have JSON data but missing fields, use it anyway
        if (jsonData) {
            const jsonParsed = parseUserData(jsonData, cleanUsername);
            const videos = extractLatestVideos(jsonData);
            return { ...jsonParsed, latestVideos: videos };
        }

        // If retries left, try again
        if (retryCount < MAX_RETRIES) {
            console.warn('[Scraper] No data found, retrying...');
            return scrapeWithFetch(username, retryCount + 1);
        }

        throw new TikTokScraperError('Could not extract data from HTML', 'PARSE_ERROR');

    } catch (err) {
        if (err instanceof TikTokScraperError) throw err;
        if (err.name === 'AbortError' || err.name === 'TimeoutError') {
            if (retryCount < MAX_RETRIES) {
                return scrapeWithFetch(username, retryCount + 1);
            }
            throw new TikTokScraperError('Request timeout', 'TIMEOUT');
        }
        if (retryCount < MAX_RETRIES && (
            err.message.includes('ECONNRESET') ||
            err.message.includes('ENOTFOUND') ||
            err.message.includes('ETIMEDOUT')
        )) {
            return scrapeWithFetch(username, retryCount + 1);
        }
        throw new TikTokScraperError(`Network error: ${err.message}`, 'NETWORK_ERROR');
    }
};

/**
 * Fetch user data from TikTok's internal API
 * Primary method: https://www.tiktok.com/api/user/detail/?uniqueId=USERNAME
 */
const fetchFromTikTokAPI = async (username) => {
    const cleanUsername = username.trim().replace('@', '');
    const apiUrl = `https://www.tiktok.com/api/user/detail/?uniqueId=${encodeURIComponent(cleanUsername)}`;
    const userAgent = getNextUserAgent();
    const headers = buildBrowserHeaders(userAgent, 'https://www.tiktok.com/');

    // Update headers for API request
    headers['Accept'] = 'application/json, text/plain, */*';
    headers['X-Requested-With'] = 'XMLHttpRequest';
    headers['Sec-Fetch-Dest'] = 'empty';
    headers['Sec-Fetch-Mode'] = 'cors';
    headers['Sec-Fetch-Site'] = 'same-origin';

    // Fetching from API

    try {
        const response = await fetch(apiUrl, {
            headers,
            redirect: 'follow',
            signal: AbortSignal.timeout(4000), // 4 second timeout for fast response
        });

        if (!response.ok) {
            // API response received
            return null;
        }

        const data = await response.json();

        // Check if API returned valid data
        if (!data || typeof data !== 'object') {
            // Invalid API response
            return null;
        }

        // Extract user data from API response
        // TikTok API structure: { userInfo: { user: {...}, stats: {...} } }
        const userInfo = data.userInfo || data.data?.userInfo || data;
        const user = userInfo.user || userInfo;
        const stats = userInfo.stats || userInfo.statistics || user.stats || user.statistics || {};

        if (!user || !user.uniqueId) {
            // User data not found
            return null;
        }

        // API fetch successful

        // Extract bio (signature) - try ALL possible paths comprehensively
        let bio = '';
        
        // Try direct user object paths first - PRIORITY: bio_description
        const bioPaths = [
            user.bio_description,  // PRIMARY: TikTok's main bio field
            user.signature,
            user.bio,
            user.description,
            user.bioText,
            user.bio_text,
            userInfo.bio_description,
            userInfo.signature,
            userInfo.bio,
            userInfo.description,
            userInfo.user?.bio_description,
            userInfo.user?.signature,
            userInfo.user?.bio,
            userInfo.user?.description,
            data.userInfo?.user?.bio_description,
            data.userInfo?.user?.signature,
            data.userInfo?.user?.bio,
            data.userInfo?.user?.description,
            data.data?.userInfo?.user?.bio_description,
            data.data?.userInfo?.user?.signature,
            data.data?.userInfo?.user?.bio,
            data.data?.userInfo?.user?.description,
        ];

        console.log('[API] Checking bio paths:', {
            'user.bio_description': !!user.bio_description,
            'user.signature': !!user.signature,
            'user.bio': !!user.bio,
        });

        for (const path of bioPaths) {
            if (path && typeof path === 'string' && path.trim() && path.trim() !== 'Signature (Required):') {
                bio = path.trim();
                console.log(`[API] ✓ Found bio from API: "${bio.substring(0, 50)}${bio.length > 50 ? '...' : ''}"`);
                console.log("BIO FOUND:", bio);
                break;
            }
        }

        // If still no bio, try deep search in the entire response
        if (!bio) {
            const deepSearch = (obj, keys, depth = 0) => {
                if (depth > 5 || !obj || typeof obj !== 'object') return null;
                for (const key of keys) {
                    if (obj[key] && typeof obj[key] === 'string' && obj[key].trim()) {
                        return obj[key].trim();
                    }
                }
                for (const key in obj) {
                    if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
                        const found = deepSearch(obj[key], keys, depth + 1);
                        if (found) return found;
                    }
                }
                return null;
            };
            bio = deepSearch(data, ['signature', 'bio', 'description', 'bioText']) || '';
        }

        // Parse numbers
        const parseStat = (value) => {
            if (typeof value === 'number') return Math.floor(value);
            if (typeof value === 'string') {
                const cleaned = value.replace(/,/g, '').trim();
                const parsed = parseFloat(cleaned);
                return isNaN(parsed) ? 0 : Math.floor(parsed);
            }
            return 0;
        };

        // Fix URL encoding - decode escaped characters
        const fixUrl = (url) => {
            if (!url || typeof url !== 'string') return '';
            return url
                .replace(/\\u002F/g, '/')
                .replace(/\\\//g, '/')
                .replace(/\\"/g, '"')
                .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
                .trim();
        };

        return {
            username: user.uniqueId || user.unique_id || user.username || cleanUsername,
            nickname: user.nickname || user.nickName || user.displayName || user.name || cleanUsername,
            avatar: fixUrl(user.avatarLarger || user.avatarMedium || user.avatarThumb || user.avatar || user.avatarUrl || ''),
            followers: parseStat(stats.followerCount || stats.follower_count || stats.followers || user.followerCount || 0),
            following: parseStat(stats.followingCount || stats.following_count || stats.following || user.followingCount || 0),
            likes: parseStat(stats.heartCount || stats.heart_count || stats.hearts || stats.totalFavorited || stats.total_favorited || user.heartCount || 0),
            videos: parseStat(stats.videoCount || stats.video_count || stats.videos || user.videoCount || 0),
            verified: Boolean(user.verified || user.isVerified || user.verificationType),
            bio: bio.trim(),
            tiktokId: (user.id || user.uid || user.userId || '').toString(),
            region: user.region || user.country || '',
            category: user.category || '',
            joinedAt: user.createTime ? new Date(user.createTime * 1000).toISOString() : null,
            secUid: user.secUid || user.sec_uid || '',
        };
    } catch (err) {
        return null;
    }
};

/**
 * Main scraper function - works for ANY username
 * Tries TikTok API first, then falls back to HTML scraping
 */
const scrapeTikTokProfile = async (username) => {
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        throw new TikTokScraperError('Username is required', 'BAD_REQUEST');
    }

    const cleanUsername = username.trim().replace('@', '');

    // STEP 1: Try TikTok's internal API first (PRIMARY METHOD)
    let result = null;
    try {
        result = await fetchFromTikTokAPI(cleanUsername);
        
        if (!result || !(result.followers > 0 || result.likes > 0 || result.tiktokId)) {
            result = null;
        }
    } catch (apiErr) {
        result = null;
    }

    // STEP 2: Fallback to HTML scraping if API failed or returned incomplete data
    if (!result || (!result.bio && (result.followers === 0 && result.likes === 0))) {
        try {
            const htmlResult = await scrapeWithFetch(cleanUsername);
            
            // Fix avatar URL encoding in htmlResult
            const fixUrl = (url) => {
                if (!url || typeof url !== 'string') return '';
                return url
                    .replace(/\\u002F/g, '/')
                    .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
                    .replace(/\\\//g, '/')
                    .replace(/\\"/g, '"')
                    .trim();
            };
            
            if (htmlResult.avatar) {
                htmlResult.avatar = fixUrl(htmlResult.avatar);
            }
            
            // Merge API data with HTML data (prefer API data, but use HTML for missing fields)
            if (result) {
                result = {
                    ...result,
                    // Use HTML data if API data is missing
                    followers: result.followers || htmlResult.followers || 0,
                    following: result.following || htmlResult.following || 0,
                    likes: result.likes || htmlResult.likes || 0,
                    videos: result.videos || htmlResult.videos || 0,
                    bio: result.bio || htmlResult.bio || '', // Prefer API bio, fallback to HTML
                    avatar: fixUrl(result.avatar || htmlResult.avatar || ''),
                    nickname: result.nickname || htmlResult.nickname || cleanUsername,
                    verified: result.verified || htmlResult.verified || false,
                    tiktokId: result.tiktokId || htmlResult.tiktokId || '',
                    region: result.region || htmlResult.region || '',
                    category: result.category || htmlResult.category || '',
                    joinedAt: result.joinedAt || htmlResult.joinedAt || null,
                    secUid: result.secUid || htmlResult.secUid || '',
                    latestVideos: htmlResult.latestVideos || [],
                };
            } else {
                result = htmlResult;
                if (result.avatar) {
                    result.avatar = fixUrl(result.avatar);
                }
            }
        } catch (fetchErr) {
            // Don't retry for NOT_FOUND or BAD_REQUEST
            if (fetchErr.code === 'NOT_FOUND' || fetchErr.code === 'BAD_REQUEST') {
                throw fetchErr;
            }

            // Return minimal data instead of failing
            console.warn(`[Scraper] Fetch failed: ${fetchErr.message}. Returning minimal data.`);
            if (!result) {
                result = {
                    username: cleanUsername,
                    nickname: cleanUsername,
                    avatar: '',
                    followers: 0,
                    following: 0,
                    likes: 0,
                    videos: 0,
                    verified: false,
                    bio: '',
                    tiktokId: '',
                    region: '',
                    category: '',
                    joinedAt: null,
                    secUid: '',
                };
            }
        }
    }

    // Ensure result exists and has all required fields
    if (!result) {
        result = {
            username: cleanUsername,
            nickname: cleanUsername,
            avatar: '',
            followers: 0,
            following: 0,
            likes: 0,
            videos: 0,
            verified: false,
            bio: '',
            tiktokId: '',
            region: '',
            category: '',
            joinedAt: null,
            secUid: '',
        };
    }

    // Ensure username is never empty
    result.username = result.username || cleanUsername;
    result.nickname = result.nickname || result.username || cleanUsername;

    // Ensure all stats are numbers >= 0
    result.followers = Math.max(0, Number(result.followers) || 0);
    result.following = Math.max(0, Number(result.following) || 0);
    result.likes = Math.max(0, Number(result.likes) || 0);
    result.videos = Math.max(0, Number(result.videos) || 0);

    // Extract videos from result if available
    const latestVideos = Array.isArray(result.latestVideos) ? result.latestVideos : [];

    // Fix URL encoding - decode escaped characters in avatar URL
    const fixUrl = (url) => {
        if (!url || typeof url !== 'string') return '';
        return url
            .replace(/\\u002F/g, '/')
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"')
            .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
            .trim();
    };

    // Fix avatar URL encoding
    const fixedAvatar = fixUrl(result.avatar || '');

    // Ensure bio is properly set - FILTER OUT SYSTEM MESSAGES
    let finalBio = (result.bio || '').toString().trim();
    
    // Remove unwanted prefixes and system messages
    finalBio = finalBio
        .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
        .replace(/^Signature\s*\(/i, '')
        .replace(/^signature\s*:/i, '')
        .trim();
    
    // Filter out system messages and invalid bios
    const invalidBioPatterns = [
        /^Your account was set to private/i,
        /^Remind me later/i,
        /^Choose whether you want/i,
        /^switch to public/i,
        /^%s/i,
        /^signature\s*\(/i,
        /^required/i,
    ];
    
    const isInvalidBio = invalidBioPatterns.some(pattern => pattern.test(finalBio));
    
    if (isInvalidBio || 
        finalBio.toLowerCase() === 'signature' || 
        finalBio.toLowerCase().includes('required') ||
        finalBio.length < 5 ||
        finalBio.match(/^%[sd]/)) {
        finalBio = '';
    }
    
    console.log(`[Scraper] Final bio for @${cleanUsername}: "${finalBio.substring(0, 50)}${finalBio.length > 50 ? '...' : ''}"`);
    // Return in required format
    return {
        success: true,
        user: {
            username: result.username,
            nickname: result.nickname,
            avatar: fixedAvatar,
            followers: result.followers,
            following: result.following,
            likes: result.likes,
            videos: result.videos,
            bio: finalBio, // Include bio in user object too
        },
        profile: {
            username: result.username,
            fullName: result.nickname,
            profilePic: fixedAvatar,
            bio: finalBio,
            description: finalBio, // Also include as description
            followers: result.followers,
            following: result.following,
            likes: result.likes,
            videos: result.videos,
            verified: result.verified || false,
            profilePicThumb: fixedAvatar,
            region: result.region || '',
            tiktokId: result.tiktokId || '',
            category: result.category || '',
            joinedAt: result.joinedAt || null,
            secUid: result.secUid || '',
        },
        // Also include bio at root level for easy access
        bio: finalBio,
        description: finalBio,
        latestVideos: latestVideos
    };
};

/**
 * Derive analytics from video data
 */
const deriveAnalytics = (latestVideos, followers, likes, videos) => {
    if (!Array.isArray(latestVideos) || latestVideos.length === 0) {
        return null;
    }

    const sampleSize = latestVideos.length;
    const totalViews = latestVideos.reduce((sum, v) => sum + (Number(v.views) || 0), 0);
    const totalEngagements = latestVideos.reduce(
        (sum, v) => sum + (Number(v.likes) || 0) + (Number(v.comments) || 0) + (Number(v.shares) || 0),
        0
    );

    if (totalViews <= 0) {
        return null;
    }

    const avgViews = totalViews / sampleSize;
    const engagementRate = (totalEngagements / totalViews) * 100;

    return {
        avgViews: Math.round(avgViews),
        engagementRate: Math.round(engagementRate * 100) / 100,
        sampleSize,
    };
};

/**
 * Fetch latest videos with views from TikWM API
 * @param {string} username - TikTok username
 * @param {number} count - Number of videos to fetch (default: 30)
 * @returns {Promise<Array>} Array of video objects with views
 */
const fetchVideosFromTikWM = async (username, count = 30) => {
    const cleanUsername = username.trim().replace('@', '');
    const url = `https://www.tikwm.com/api/user/posts?unique_id=${encodeURIComponent(cleanUsername)}&count=${count}`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(4000), // 4 second timeout for fast response
        });

        if (!response.ok) {
            console.warn(`[TikWM] ❌ API returned status ${response.status}`);
            return [];
        }

        const data = await response.json();

        // Check if API returned success - TikWM uses code: 0 for success
        if (data.code !== 0 && data.code !== 200 && data.code !== undefined) {
            console.warn(`[TikWM] ❌ API returned error code: ${data.code}, msg: ${data.msg || 'Unknown error'}`);
            return [];
        }

        // Extract videos from response - TikWM API structure: { code: 0, data: { videos: [...] } }
        let videos = [];

        // Try data.data.videos first (most common TikWM structure)
        if (data.data?.data?.videos && Array.isArray(data.data.data.videos)) {
            videos = data.data.data.videos;
        }
        // Try data.data.videos
        else if (data.data?.videos && Array.isArray(data.data.videos)) {
            videos = data.data.videos;
        }
        // Try data.data.list
        else if (data.data?.list && Array.isArray(data.data.list)) {
            videos = data.data.list;
        }
        // Try data.videos
        else if (data.videos && Array.isArray(data.videos)) {
            videos = data.videos;
        }
        // Try data.list
        else if (data.list && Array.isArray(data.list)) {
            videos = data.list;
        }
        // Try data.data as array
        else if (data.data && Array.isArray(data.data)) {
            videos = data.data;
        }

        if (!Array.isArray(videos) || videos.length === 0) {
            console.warn(`[TikWM] ❌ No videos found in response`);
            console.log(`[TikWM] Response structure:`, JSON.stringify(data, null, 2).substring(0, 1000));
            return [];
        }

        console.log(`[TikWM] ✓ Found ${videos.length} videos in API response`);

        // Log first video structure for debugging
        if (videos.length > 0) {
            console.log(`[TikWM] First video structure:`, {
                keys: Object.keys(videos[0]),
                play: videos[0].play,
                play_count: videos[0].play_count,
                playCount: videos[0].playCount,
                statistics: videos[0].statistics,
                stats: videos[0].stats,
                allKeys: Object.keys(videos[0]).join(', '),
            });
        }

        // Map to standard format
        const mappedVideos = videos.map((video, index) => {
            // Extract views from TikWM API - PRIMARY: play_count (as per API documentation)
            // Fallback order: play_count -> statistics.play_count -> stats.play_count -> other fields
            let rawViews = 0;
            let viewsSource = 'none';
            
            if (video.play_count !== undefined && video.play_count !== null) {
                rawViews = video.play_count;
                viewsSource = 'play_count';
            } else if (video.statistics?.play_count !== undefined && video.statistics?.play_count !== null) {
                rawViews = video.statistics.play_count;
                viewsSource = 'statistics.play_count';
            } else if (video.stats?.play_count !== undefined && video.stats?.play_count !== null) {
                rawViews = video.stats.play_count;
                viewsSource = 'stats.play_count';
            } else if (video.play !== undefined && video.play !== null) {
                rawViews = video.play;
                viewsSource = 'play';
            } else if (video.playCount !== undefined && video.playCount !== null) {
                rawViews = video.playCount;
                viewsSource = 'playCount';
            } else if (video.statistics?.playCount !== undefined && video.statistics?.playCount !== null) {
                rawViews = video.statistics.playCount;
                viewsSource = 'statistics.playCount';
            } else if (video.stats?.playCount !== undefined && video.stats?.playCount !== null) {
                rawViews = video.stats.playCount;
                viewsSource = 'stats.playCount';
            } else if (video.view_count !== undefined && video.view_count !== null) {
                rawViews = video.view_count;
                viewsSource = 'view_count';
            } else if (video.viewCount !== undefined && video.viewCount !== null) {
                rawViews = video.viewCount;
                viewsSource = 'viewCount';
            } else if (video.views !== undefined && video.views !== null) {
                rawViews = video.views;
                viewsSource = 'views';
            }

            const views = Number(rawViews) || 0;

            // Extract other stats
            const likes = Number(
                video.digg_count ||
                video.diggCount ||
                video.statistics?.digg_count ||
                video.statistics?.diggCount ||
                video.stats?.digg_count ||
                video.stats?.diggCount ||
                video.likes ||
                0
            );

            const comments = Number(
                video.comment_count ||
                video.commentCount ||
                video.statistics?.comment_count ||
                video.statistics?.commentCount ||
                video.stats?.comment_count ||
                video.stats?.commentCount ||
                video.comments ||
                0
            );

            const shares = Number(
                video.share_count ||
                video.shareCount ||
                video.statistics?.share_count ||
                video.statistics?.shareCount ||
                video.stats?.share_count ||
                video.stats?.shareCount ||
                video.shares ||
                0
            );

            return {
                id: video.aweme_id || video.id || video.item_id || '',
                cover: video.cover || video.origin_cover || video.dynamic_cover || null,
                views: views,
                likes: likes,
                comments: comments,
                shares: shares,
                createdAt: video.create_time ? new Date(video.create_time * 1000).toISOString() : null,
                desc: video.description || video.desc || video.title || '',
                duration: video.duration || null,
            };
        }).filter(v => v.views > 0); // Only include videos with views > 0

        return mappedVideos;
    } catch (err) {
        console.error(`[TikWM] Error fetching videos: ${err.message}`);
        return [];
    }
};

module.exports = {
    scrapeTikTokProfile,
    TikTokScraperError,
    deriveAnalytics,
    fetchVideosFromTikWM,
};

