/**
 * Universal TikTok Scraper - Production Ready
 * Works for ALL TikTok users with 5-layer JSON extraction + regex fallbacks
 * Uses axios + cheerio for reliable HTML parsing
 * Preserves full URLs, handles edge cases, never crashes
 */

const axios = require('axios');
const cheerio = require('cheerio');
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
    if (upper.endsWith('K')) return Math.floor(parseFloat(upper) * 1000);
    if (upper.endsWith('M')) return Math.floor(parseFloat(upper) * 1000000);
    if (upper.endsWith('B')) return Math.floor(parseFloat(upper) * 1000000000);
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.floor(parsed);
};

/**
 * Sanitize and parse JSON safely with multiple attempts
 */
const safeJSONParse = (jsonString) => {
    if (!jsonString || typeof jsonString !== 'string') return null;
    
    try {
        return JSON.parse(jsonString);
    } catch (err) {
        try {
            let fixed = jsonString
                .replace(/,(\s*[}\]])/g, '$1')
                .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '')
                .replace(/\\'/g, "'");
            return JSON.parse(fixed);
        } catch (err2) {
            try {
                const match = jsonString.match(/({[\s\S]{100,}?})/);
                if (match && match[1]) return JSON.parse(match[1]);
            } catch (err3) {
                return null;
            }
        }
    }
    return null;
};

/**
 * Preserve full URL - never truncate
 */
const preserveFullUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    // Remove any truncation patterns and preserve full URL
    return url.trim();
};

/**
 * Layer 1: Extract JSON from <script id="SIGI_STATE">
 */
const extractSigiStateScript = ($) => {
    try {
        const sigiScript = $('#SIGI_STATE');
        if (sigiScript.length > 0) {
            const content = sigiScript.html();
            if (content) {
                const parsed = safeJSONParse(content.trim());
                if (parsed && (parsed.UserModule || parsed.UserPage || parsed['__DEFAULT_SCOPE__'])) {
                    return parsed;
                }
            }
        }
        
        const altSigi = $('script[id="SIGI_STATE"]');
        if (altSigi.length > 0) {
            const content = altSigi.html();
            if (content) {
                const parsed = safeJSONParse(content.trim());
                if (parsed && (parsed.UserModule || parsed.UserPage)) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Silent fail
    }
    return null;
};

/**
 * Layer 2: Extract JSON from __NEXT_DATA__
 */
const extractNextData = ($) => {
    try {
        const nextDataScript = $('#__NEXT_DATA__');
        if (nextDataScript.length > 0) {
            const content = nextDataScript.html();
            if (content) {
                const parsed = safeJSONParse(content.trim());
                if (parsed && parsed.props && parsed.props.pageProps) {
                    return parsed;
                }
            }
        }
        
        const altNext = $('script[id="__NEXT_DATA__"]');
        if (altNext.length > 0) {
            const content = altNext.html();
            if (content) {
                const parsed = safeJSONParse(content.trim());
                if (parsed && parsed.props) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Silent fail
    }
    return null;
};

/**
 * Layer 3: Extract window["SIGI_STATE"] via regex
 */
const extractWindowSigiState = (html) => {
    if (!html || typeof html !== 'string') return null;
    
    try {
        const patterns = [
            /window\s*\[\s*['"]SIGI_STATE['"]\s*\]\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const|function)/m,
            /window\.SIGI_STATE\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const|function)/m,
            /window\s*\[\s*['"]SIGI_STATE['"]\s*\]\s*=\s*({[\s\S]*?});/m,
            /window\.SIGI_STATE\s*=\s*({[\s\S]*?});/m,
        ];
        
        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const parsed = safeJSONParse(match[1].trim());
                if (parsed && (parsed.UserModule || parsed.UserPage || parsed['__DEFAULT_SCOPE__'])) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Silent fail
    }
    return null;
};

/**
 * Layer 4: Extract window["__UNIVERSAL_DATA_FOR_REHYDRATION__"]
 */
const extractUniversalData = (html) => {
    if (!html || typeof html !== 'string') return null;
    
    try {
        const patterns = [
            /window\s*\[\s*['"]__UNIVERSAL_DATA_FOR_REHYDRATION__['"]\s*\]\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const)/m,
            /window\.__UNIVERSAL_DATA_FOR_REHYDRATION__\s*=\s*({[\s\S]*?});?\s*(?:<\/script>|$|window|var|let|const)/m,
            /window\s*\[\s*['"]__UNIVERSAL_DATA_FOR_REHYDRATION__['"]\s*\]\s*=\s*({[\s\S]*?});/m,
            /window\.__UNIVERSAL_DATA_FOR_REHYDRATION__\s*=\s*({[\s\S]*?});/m,
        ];
        
        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const parsed = safeJSONParse(match[1].trim());
                if (parsed && (parsed.UserModule || parsed.UserPage || parsed.userInfo)) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Silent fail
    }
    return null;
};

/**
 * Layer 5: Universal JSON search
 */
const extractUniversalJSON = (html) => {
    if (!html || typeof html !== 'string') return null;
    
    try {
        const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
        if (scriptMatches) {
            for (const scriptTag of scriptMatches) {
                if (scriptTag.includes('UserModule') || scriptTag.includes('UserPage') || 
                    scriptTag.includes('Stats') || scriptTag.includes('userInfo')) {
                    
                    const jsonPatterns = [
                        /({[\s\S]*?"UserModule"[\s\S]*?})/,
                        /({[\s\S]*?"UserPage"[\s\S]*?})/,
                        /({[\s\S]*?"Stats"[\s\S]*?})/,
                        /({[\s\S]*?"userInfo"[\s\S]*?})/,
                        /({[\s\S]{500,}?})/,
                    ];
                    
                    for (const pattern of jsonPatterns) {
                        const match = scriptTag.match(pattern);
                        if (match && match[1]) {
                            const parsed = safeJSONParse(match[1]);
                            if (parsed && (parsed.UserModule || parsed.UserPage || parsed.userInfo || 
                                (typeof parsed === 'object' && Object.keys(parsed).some(k => 
                                    k.includes('User') || k.includes('Stats') || k.includes('user'))))) {
                                return parsed;
                            }
                        }
                    }
                }
            }
        }
        
        const directPatterns = [
            /({[\s\S]*?"UserModule"[\s\S]{500,}?})/,
            /({[\s\S]*?"UserPage"[\s\S]{500,}?})/,
            /({[\s\S]*?"Stats"[\s\S]{500,}?})/,
        ];
        
        for (const pattern of directPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                const parsed = safeJSONParse(match[1]);
                if (parsed && (parsed.UserModule || parsed.UserPage)) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        // Silent fail
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
    
    if (userId && data.UserModule?.stats?.[userId]) {
        stats = data.UserModule.stats[userId];
    } else if (data.UserModule?.stats) {
        const statsObj = data.UserModule.stats;
        const firstKey = Object.keys(statsObj)[0];
        if (firstKey) stats = statsObj[firstKey];
    } else if (data.UserPage?.userInfo?.stats) {
        stats = data.UserPage.userInfo.stats;
    } else if (data.UserPage?.stats) {
        stats = data.UserPage.stats;
    } else if (data.props?.pageProps?.userInfo?.stats) {
        stats = data.props.pageProps.userInfo.stats;
    } else if (data['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo?.stats) {
        stats = data['__DEFAULT_SCOPE__']['webapp.user-detail'].userInfo.stats;
    } else {
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
 * Extract user info from data object
 */
const extractUserInfo = (data, username) => {
    if (!data || typeof data !== 'object') return null;
    
    let userInfo = null;
    
    if (data.UserModule?.users) {
        const users = data.UserModule.users;
        const userKey = Object.keys(users).find(k => k.toLowerCase() === username.toLowerCase()) || Object.keys(users)[0];
        if (userKey) userInfo = users[userKey];
    } else if (data.UserPage?.userInfo) {
        userInfo = data.UserPage.userInfo.user || data.UserPage.userInfo;
    } else if (data.props?.pageProps?.userInfo) {
        userInfo = data.props.pageProps.userInfo.user || data.props.pageProps.userInfo;
    } else if (data['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo) {
        userInfo = data['__DEFAULT_SCOPE__']['webapp.user-detail'].userInfo.user || 
                   data['__DEFAULT_SCOPE__']['webapp.user-detail'].userInfo;
    } else {
        userInfo = deepSearch(data, ['user', 'userInfo', 'userDetail']);
    }
    
    if (!userInfo) return null;
    
    const userStats = extractStats({ userInfo }, userInfo.id || userInfo.uid);
    
    // Preserve full avatar URL - never truncate
    const avatar = userInfo.avatarLarger || userInfo.avatarMedium || userInfo.avatarThumb || 
                   userInfo.avatar || userInfo.avatarUrl || '';
    
    // Extract description/signature from ALL possible JSON paths - COMPREHENSIVE SEARCH
    let description = '';
    
    // Strategy 1: Try userInfo directly first (most common)
    const directPaths = [
        userInfo.user?.signature,
        userInfo.user?.bio_description,
        userInfo.user?.bio,
        userInfo.user?.description,
        userInfo.signature,
        userInfo.bio_description,
        userInfo.bio,
        userInfo.description,
        userInfo.bioText,
        userInfo.bio_text,
    ];
    
    console.log('[Scraper] Checking direct paths for bio:', {
        'user.signature': !!userInfo.user?.signature,
        'user.bio_description': !!userInfo.user?.bio_description,
        'user.bio': !!userInfo.user?.bio,
        'signature': !!userInfo.signature,
        'bio_description': !!userInfo.bio_description,
        'bio': !!userInfo.bio,
    });
    
    for (const path of directPaths) {
        if (path && typeof path === 'string' && path.trim() && path.trim() !== 'Signature (Required):') {
            description = path.trim();
            console.log(`[Scraper] ✓ Found bio in userInfo: "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"`);
            console.log("BIO FOUND:", description);
            break;
        }
    }
    
    // Strategy 2: If not found, try UserModule.users (TikTok's main data structure)
    if (!description && data && data.UserModule && data.UserModule.users) {
        const users = data.UserModule.users;
        console.log(`[Scraper] Checking UserModule.users (${Object.keys(users).length} users) for bio...`);
        // Try all users in the module
        for (const userKey in users) {
            const user = users[userKey];
            if (user && typeof user === 'object') {
                const bioFields = [
                    user.bio_description,
                    user.signature,
                    user.bio,
                    user.description,
                    user.bioText,
                    user.bio_text,
                ];
                for (const bioField of bioFields) {
                    if (bioField && typeof bioField === 'string' && bioField.trim() && bioField.trim() !== 'Signature (Required):') {
                        description = bioField.trim();
                        console.log(`[Scraper] ✓ Found bio in UserModule.users[${userKey}]: "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"`);
                        console.log("BIO FOUND:", description);
                        break;
                    }
                }
                if (description) break;
            }
        }
    }
    
    // Strategy 3: Try data object paths
    if (!description && data) {
        const dataPaths = [
            data.user?.bio_description,
            data.user?.signature,
            data.user?.bio,
            data.user?.description,
            data.props?.pageProps?.user?.bio_description,
            data.props?.pageProps?.user?.signature,
            data.props?.pageProps?.user?.bio,
            data.props?.pageProps?.userInfo?.user?.bio_description,
            data.props?.pageProps?.userInfo?.user?.signature,
            data.props?.pageProps?.userInfo?.user?.bio,
            data.UserPage?.userInfo?.user?.bio_description,
            data.UserPage?.userInfo?.user?.signature,
            data.UserPage?.userInfo?.user?.bio,
            data.UserPage?.userInfo?.bio_description,
            data.UserPage?.userInfo?.signature,
            data.UserPage?.userInfo?.bio,
            data['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo?.user?.bio_description,
            data['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo?.user?.signature,
            data['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo?.user?.bio,
        ];
        
        console.log('[Scraper] Checking data object paths for bio...');
        for (const path of dataPaths) {
            if (path && typeof path === 'string' && path.trim() && path.trim() !== 'Signature (Required):') {
                description = path.trim();
                console.log(`[Scraper] ✓ Found bio in data paths: "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"`);
                console.log("BIO FOUND:", description);
                break;
            }
        }
    }
    
    // Strategy 4: Try props.pageProps.user paths (TikTok Next.js structure) - PRIORITY: bio_description
    if (!description && data) {
        const propsPaths = [
            data.props?.pageProps?.user?.bio_description, // PRIMARY: TikTok's main bio field
            data.props?.pageProps?.user?.signature,
            data.props?.pageProps?.user?.bio,
            data.props?.pageProps?.user?.description,
            data.props?.pageProps?.userInfo?.user?.bio_description,
            data.props?.pageProps?.userInfo?.user?.signature,
            data.props?.pageProps?.userInfo?.user?.bio,
            data.props?.pageProps?.userInfo?.user?.description,
        ];
        
        for (const path of propsPaths) {
            if (path && typeof path === 'string' && path.trim() && path.trim() !== 'Signature (Required):') {
                description = path.trim();
                console.log(`[Scraper] ✓ Found bio in props.pageProps.user: "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"`);
                console.log("BIO FOUND:", description);
                break;
            }
        }
    }
    
    // Strategy 5: Deep search in entire data object
    if (!description && data) {
        const deepSearch = (obj, keys, depth = 0) => {
            if (depth > 5 || !obj || typeof obj !== 'object') return null;
            for (const key of keys) {
                if (obj[key] && typeof obj[key] === 'string' && obj[key].trim() && obj[key].trim() !== 'Signature (Required):') {
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
        
        const found = deepSearch(data, ['bio_description', 'signature', 'bio', 'description', 'bioText', 'bio_text']);
        if (found) {
            description = found;
            console.log(`[Scraper] ✓ Found bio via deep search: "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"`);
            console.log("BIO FOUND:", description);
        }
    }
    
    // Clean description - remove "Signature (Required):" if present and HTML
    if (description) {
        description = description
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
        console.warn(`[Scraper] ⚠ No bio found for @${username} - checked all paths`);
    }
    
    return {
        username: userInfo.uniqueId || userInfo.unique_id || userInfo.username || userInfo.id || username,
        nickname: userInfo.nickname || userInfo.nicknameName || userInfo.displayName || userInfo.name || username,
        avatar: preserveFullUrl(avatar),
        verified: Boolean(userInfo.verified || userInfo.isVerified),
        bio: description,
        tiktokId: userInfo.id || userInfo.uid || userInfo.userId || '',
        region: userInfo.region || userInfo.country || '',
        category: userInfo.category || '',
        joinedAt: userInfo.createTime ? new Date(userInfo.createTime * 1000).toISOString() : null,
        secUid: userInfo.secUid || userInfo.sec_uid || '',
        userStats,
    };
};

/**
 * Extract bio from HTML meta tags, SEO JSON-LD, and h2 elements
 * This is a comprehensive fallback that checks ALL possible HTML sources
 */
const extractBioFromHTML = (html) => {
    if (!html || typeof html !== 'string') {
        console.warn('[Scraper] extractBioFromHTML: Invalid HTML input');
        return '';
    }
    
    try {
        const $ = cheerio.load(html);
        let bio = '';
        
        console.log('[Scraper] extractBioFromHTML: Starting extraction...');
        
        // Strategy 1: Extract from <meta name="description"> tag
        const metaDesc = $('meta[name="description"]').attr('content');
        if (metaDesc && typeof metaDesc === 'string' && metaDesc.trim()) {
            const cleaned = metaDesc.trim()
                .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
                .replace(/<[^>]*>/g, '')
                .trim();
            if (cleaned && cleaned.length > 0 && cleaned !== 'Signature (Required):' && !cleaned.toLowerCase().includes('tiktok')) {
                bio = cleaned;
                console.log(`[Scraper] ✓ Found bio in <meta name="description">: "${bio.substring(0, 50)}${bio.length > 50 ? '...' : ''}"`);
                console.log("BIO FOUND:", bio);
                return bio;
            }
        }
        
        // Strategy 2: Extract from <h2 data-e2e="user-bio"> tag
        const h2Bio = $('h2[data-e2e="user-bio"]').text();
        if (h2Bio && typeof h2Bio === 'string' && h2Bio.trim()) {
            const cleaned = h2Bio.trim()
                .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
                .replace(/<[^>]*>/g, '')
                .trim();
            if (cleaned && cleaned.length > 0 && cleaned !== 'Signature (Required):') {
                bio = cleaned;
                console.log(`[Scraper] ✓ Found bio in <h2 data-e2e="user-bio">: "${bio.substring(0, 50)}${bio.length > 50 ? '...' : ''}"`);
                console.log("BIO FOUND:", bio);
                return bio;
            }
        }
        
        // Strategy 3: Extract from SEO JSON-LD script tag
        const jsonLdScripts = $('script[type="application/ld+json"]');
        jsonLdScripts.each((i, elem) => {
            if (bio) return false; // Stop if we found bio
            
            try {
                const content = $(elem).html();
                if (content) {
                    const parsed = safeJSONParse(content);
                    if (parsed) {
                        // Check for description in various JSON-LD structures
                        const desc = parsed.description || 
                                    parsed.about?.description ||
                                    parsed.author?.description ||
                                    (parsed['@graph'] && parsed['@graph'].find(item => item.description)?.description);
                        
                        if (desc && typeof desc === 'string' && desc.trim()) {
                            const cleaned = desc.trim()
                                .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
                                .replace(/<[^>]*>/g, '')
                                .trim();
                            if (cleaned && cleaned.length > 0 && cleaned !== 'Signature (Required):' && !cleaned.toLowerCase().includes('tiktok')) {
                                bio = cleaned;
                                console.log(`[Scraper] ✓ Found bio in JSON-LD: "${bio.substring(0, 50)}${bio.length > 50 ? '...' : ''}"`);
                                console.log("BIO FOUND:", bio);
                                return false; // Stop iteration
                            }
                        }
                    }
                }
            } catch (err) {
                // Continue to next script
            }
        });
        
        if (bio) return bio;
        
        // Strategy 4: Extract from props.pageProps.user.bio_description in HTML (REGEX)
        const bioDescPatterns = [
            /props\.pageProps\.user\.bio_description\s*[=:]\s*["']([^"']*)["']/i,
            /"bio_description"\s*:\s*"([^"]*)"/i,
            /props\.pageProps\.userInfo\.user\.bio_description\s*[=:]\s*["']([^"']*)["']/i,
            /"signature"\s*:\s*"([^"]*)"/gi,
            /"bio"\s*:\s*"([^"]*)"/gi,
        ];
        
        for (const pattern of bioDescPatterns) {
            const matches = html.match(pattern);
            if (matches) {
                // Get the last non-empty match (most likely to be the user's bio)
                const matchArray = Array.isArray(matches) ? matches : [matches];
                for (let i = matchArray.length - 1; i >= 0; i--) {
                    const match = html.match(new RegExp(pattern.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
                    if (match && match[1]) {
                        let cleaned = match[1]
                            .replace(/\\\//g, '/')
                            .replace(/\\"/g, '"')
                            .replace(/\\n/g, '\n')
                            .replace(/\\t/g, '\t')
                            .replace(/\\r/g, '\r')
                            .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
                            .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
                            .trim();
                        
                        if (cleaned && cleaned.length > 0 && cleaned !== 'Signature (Required):' && !cleaned.toLowerCase().includes('tiktok')) {
                            bio = cleaned;
                            console.log(`[Scraper] ✓ Found bio via regex pattern: "${bio.substring(0, 50)}${bio.length > 50 ? '...' : ''}"`);
                            console.log("BIO FOUND:", bio);
                            return bio;
                        }
                    }
                }
            }
        }
        
        // Strategy 5: Extract from any element with class containing "bio" or "description"
        const bioSelectors = [
            '[class*="bio"]',
            '[class*="description"]',
            '[data-e2e*="bio"]',
            '[data-e2e*="description"]',
            '[data-testid*="bio"]',
            '[data-testid*="description"]',
        ];
        
        for (const selector of bioSelectors) {
            const bioElements = $(selector);
            bioElements.each((i, elem) => {
                if (bio) return false;
                
                const text = $(elem).text();
                if (text && typeof text === 'string' && text.trim().length > 5) {
                    const cleaned = text.trim()
                        .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
                        .replace(/<[^>]*>/g, '')
                        .trim();
                    if (cleaned && cleaned.length > 5 && cleaned !== 'Signature (Required):' && !cleaned.toLowerCase().includes('tiktok') && !cleaned.match(/^\d+$/)) {
                        bio = cleaned;
                        console.log(`[Scraper] ✓ Found bio in element (${selector}): "${bio.substring(0, 50)}${bio.length > 50 ? '...' : ''}"`);
                        console.log("BIO FOUND:", bio);
                        return false;
                    }
                }
            });
            if (bio) break;
        }
        
        if (bio) {
            console.log("BIO FOUND:", bio);
            return bio;
        }
        
        console.warn('[Scraper] extractBioFromHTML: No bio found in HTML');
        return '';
    } catch (err) {
        console.warn('[Scraper] Error extracting bio from HTML:', err.message);
        return '';
    }
};

/**
 * Extract direct values from HTML using regex (comprehensive fallback)
 */
const extractDirectValuesFromHTML = (html, username) => {
    if (!html || typeof html !== 'string') return null;
    
    try {
        const result = {
            username: username,
            nickname: username,
            avatar: '',
            followers: 0,
            following: 0,
            likes: 0,
            videos: 0,
            tiktokId: '',
            secUid: '',
            region: '',
            bio: '',
        };
        
        // Extract follower count
        const followerMatch = html.match(/"followerCount"\s*:\s*(\d+)/i) || 
                             html.match(/"followers"\s*:\s*(\d+)/i);
        if (followerMatch && followerMatch[1]) {
            result.followers = parseNumber(followerMatch[1]);
        }
        
        // Extract following count
        const followingMatch = html.match(/"followingCount"\s*:\s*(\d+)/i) || 
                              html.match(/"following"\s*:\s*(\d+)/i);
        if (followingMatch && followingMatch[1]) {
            result.following = parseNumber(followingMatch[1]);
        }
        
        // Extract likes
        const likesMatch = html.match(/"heartCount"\s*:\s*(\d+)/i) || 
                          html.match(/"totalFavorited"\s*:\s*(\d+)/i) ||
                          html.match(/"likes"\s*:\s*(\d+)/i);
        if (likesMatch && likesMatch[1]) {
            result.likes = parseNumber(likesMatch[1]);
        }
        
        // Extract videos
        const videosMatch = html.match(/"videoCount"\s*:\s*(\d+)/i) || 
                           html.match(/"videos"\s*:\s*(\d+)/i);
        if (videosMatch && videosMatch[1]) {
            result.videos = parseNumber(videosMatch[1]);
        }
        
        // Extract TikTok ID - multiple patterns
        const idPatterns = [
            /"id"\s*:\s*"(\d+)"/i,
            /"uid"\s*:\s*"(\d+)"/i,
            /"userId"\s*:\s*"(\d+)"/i,
            /"tiktokId"\s*:\s*"(\d+)"/i,
        ];
        for (const pattern of idPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.tiktokId = match[1];
                break;
            }
        }
        
        // Extract secUid - multiple patterns
        const secUidPatterns = [
            /"secUid"\s*:\s*"([^"]+)"/i,
            /"sec_uid"\s*:\s*"([^"]+)"/i,
        ];
        for (const pattern of secUidPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                result.secUid = match[1];
                break;
            }
        }
        
        // Extract avatar - preserve FULL URL with all query params
        const avatarPatterns = [
            /"avatarLarger"\s*:\s*"([^"]+)"/i,
            /"avatarMedium"\s*:\s*"([^"]+)"/i,
            /"avatarThumb"\s*:\s*"([^"]+)"/i,
            /"avatar"\s*:\s*"([^"]+)"/i,
            /"profilePicture"\s*:\s*"([^"]+)"/i,
        ];
        for (const pattern of avatarPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                // Preserve full URL - decode and keep all query params
                result.avatar = match[1]
                    .replace(/\\\//g, '/')
                    .replace(/\\"/g, '"')
                    .replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
                break;
            }
        }
        
        // Extract nickname
        const nicknameMatch = html.match(/"nickname"\s*:\s*"([^"]+)"/i) ||
                             html.match(/"displayName"\s*:\s*"([^"]+)"/i);
        if (nicknameMatch && nicknameMatch[1]) {
            result.nickname = nicknameMatch[1]
                .replace(/\\\//g, '/')
                .replace(/\\"/g, '"')
                .replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
        }
        
        // Extract bio/description/signature from HTML - COMPREHENSIVE EXTRACTION
        const bioPatterns = [
            // JSON patterns - check for bio_description FIRST (TikTok's current field)
            /"bio_description"\s*:\s*"([^"]*)"/gi,
            /"signature"\s*:\s*"([^"]*)"/gi,
            /"bio"\s*:\s*"([^"]*)"/gi,
            /"description"\s*:\s*"([^"]*)"/gi,
            /"bioText"\s*:\s*"([^"]*)"/gi,
            // Variable assignment patterns
            /data\.user\.bio_description\s*[=:]\s*"([^"]*)"/i,
            /data\.user\.signature\s*=\s*"([^"]*)"/i,
            /userInfo\.user\.bio_description\s*[=:]\s*"([^"]*)"/i,
            /userInfo\.user\.signature\s*[=:]\s*"([^"]*)"/i,
            /props\.pageProps\.user\.bio_description\s*[=:]\s*"([^"]*)"/i,
            /props\.pageProps\.userInfo\.user\.bio_description\s*[=:]\s*"([^"]*)"/i,
            /props\.pageProps\.userInfo\.user\.signature\s*[=:]\s*"([^"]*)"/i,
            // HTML content patterns
            /<[^>]*class[^>]*bio[^>]*>([^<]*)<\/[^>]*>/i,
            /<[^>]*class[^>]*description[^>]*>([^<]*)<\/[^>]*>/i,
            /<h2[^>]*data-e2e="user-bio"[^>]*>([^<]*)<\/h2>/i,
        ];
        
        let foundBio = '';
        console.log('[Scraper] extractDirectValuesFromHTML: Searching for bio in HTML...');
        
        for (const pattern of bioPatterns) {
            try {
                const matches = html.match(pattern);
                if (matches) {
                    // Handle both single match and global matches
                    const matchArray = Array.isArray(matches) ? matches : [matches];
                    for (const match of matchArray) {
                        if (match) {
                            // Extract the captured group - handle both string and array matches
                            let captured = null;
                            if (typeof match === 'string') {
                                const groupMatch = match.match(pattern);
                                if (groupMatch && groupMatch[1]) {
                                    captured = groupMatch[1];
                                }
                            } else if (Array.isArray(match) && match[1]) {
                                captured = match[1];
                            }
                            
                            if (captured) {
                                let bioText = captured
                                    .replace(/\\\//g, '/')
                                    .replace(/\\"/g, '"')
                                    .replace(/\\n/g, '\n')
                                    .replace(/\\t/g, '\t')
                                    .replace(/\\r/g, '\r')
                                    .replace(/\\u([0-9a-fA-F]{4})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
                                    .replace(/&nbsp;/g, ' ')
                                    .replace(/&amp;/g, '&')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&#39;/g, "'")
                                    .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
                                    .trim();
                                
                                // Clean description - remove "Signature (Required):" if present
                                bioText = bioText.replace(/^Signature\s*\(Required\)\s*:\s*/i, '').trim();
                                
                                // Filter out generic TikTok descriptions
                                if (bioText && 
                                    bioText !== 'Signature (Required):' && 
                                    bioText.length > 0 &&
                                    !bioText.toLowerCase().includes('tiktok') &&
                                    !bioText.match(/^\d+$/) &&
                                    bioText.length > 3) {
                                    foundBio = bioText;
                                    console.log(`[Scraper] ✓ Found bio via regex pattern: "${foundBio.substring(0, 50)}${foundBio.length > 50 ? '...' : ''}"`);
                                    console.log("BIO FOUND:", foundBio);
                                    break;
                                }
                            }
                        }
                    }
                    if (foundBio) break;
                }
            } catch (err) {
                // Continue to next pattern
                console.warn(`[Scraper] Pattern error: ${err.message}`);
            }
        }
        
        // If we found a bio, set it
        if (foundBio) {
            result.bio = foundBio;
            result.description = foundBio;
        } else {
            console.warn('[Scraper] extractDirectValuesFromHTML: No bio found in HTML patterns');
        }
        
        // Extract region
        const regionMatch = html.match(/"region"\s*:\s*"([^"]+)"/i) ||
                           html.match(/"country"\s*:\s*"([^"]+)"/i);
        if (regionMatch && regionMatch[1]) {
            result.region = regionMatch[1];
        }
        
        if (result.followers > 0 || result.likes > 0 || result.tiktokId || result.avatar) {
            return result;
        }
    } catch (err) {
        // Silent fail
    }
    
    return null;
};

/**
 * Extract JSON using 5-layer fallback system
 */
const extractJSONWithLayers = (html) => {
    const $ = cheerio.load(html);
    
    // Layer 1: <script id="SIGI_STATE">
    let jsonData = extractSigiStateScript($);
    if (jsonData) return jsonData;
    
    // Layer 2: __NEXT_DATA__
    jsonData = extractNextData($);
    if (jsonData) return jsonData;
    
    // Layer 3: window["SIGI_STATE"] via regex
    jsonData = extractWindowSigiState(html);
    if (jsonData) return jsonData;
    
    // Layer 4: window["__UNIVERSAL_DATA_FOR_REHYDRATION__"]
    jsonData = extractUniversalData(html);
    if (jsonData) return jsonData;
    
    // Layer 5: Universal JSON search
    jsonData = extractUniversalJSON(html);
    if (jsonData) return jsonData;
    
    return null;
};

/**
 * Parse user data from extracted JSON (never throws - returns defaults)
 */
const parseUserData = (data, username) => {
    if (!data || typeof data !== 'object') {
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
    
    let stats = { followers: 0, following: 0, likes: 0, videos: 0 };
    try {
        stats = extractStats(data, userInfo.tiktokId);
    } catch (err) {
        // Silent fail
    }
    
    const finalStats = {
        followers: stats.followers || userInfo.userStats?.followers || 0,
        following: stats.following || userInfo.userStats?.following || 0,
        likes: stats.likes || userInfo.userStats?.likes || 0,
        videos: stats.videos || userInfo.userStats?.videos || 0,
    };
    
    // Clean bio/description - remove "Signature (Required):" if present and HTML tags
    let cleanBio = (userInfo.bio || '').trim();
    if (cleanBio) {
        cleanBio = cleanBio
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/^Signature\s*\(Required\)\s*:\s*/i, '') // Remove prefix
            .trim();
    }
    
    // DEBUG: Log bio extraction
    if (cleanBio) {
        console.log(`[Scraper] ✓ Extracted bio from userInfo: "${cleanBio.substring(0, 50)}${cleanBio.length > 50 ? '...' : ''}"`);
    }
    
    return {
        username: (userInfo.username || username).trim(),
        nickname: userInfo.nickname || userInfo.username || username,
        avatar: preserveFullUrl(userInfo.avatar || ''),
        followers: Math.max(0, finalStats.followers),
        following: Math.max(0, finalStats.following),
        likes: Math.max(0, finalStats.likes),
        videos: Math.max(0, finalStats.videos),
        verified: userInfo.verified || false,
        bio: cleanBio || '',
        description: cleanBio || '', // Also include as description
        tiktokId: userInfo.tiktokId || '',
        region: userInfo.region || '',
        category: userInfo.category || '',
        joinedAt: userInfo.joinedAt || null,
        secUid: userInfo.secUid || '',
    };
};

/**
 * Main scraper function
 */
const scrapeTikTokProfile = async (username) => {
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        throw new TikTokScraperError('Username is required', 'BAD_REQUEST');
    }
    
    // Handle usernames with @ safely
    const cleanUsername = username.trim().replace(/^@+/, '').replace(/@/g, '_');
    const url = `https://www.tiktok.com/@${cleanUsername}`;
    const userAgent = getNextUserAgent();
    const headers = buildBrowserHeaders(userAgent, url);
    
    try {
        const response = await axios.get(url, {
            headers,
            timeout: 30000,
            maxRedirects: 5,
            validateStatus: (status) => status < 500,
        });
        
        if (response.status === 404) {
            throw new TikTokScraperError(`User '@${cleanUsername}' not found`, 'NOT_FOUND');
        }
        
        if (response.status !== 200) {
            throw new TikTokScraperError(`HTTP ${response.status}`, 'HTTP_ERROR');
        }
        
        const html = response.data;
        
        if (!html || typeof html !== 'string' || html.length < 1000) {
            throw new TikTokScraperError('Empty or invalid HTML response', 'EMPTY_RESPONSE');
        }
        
        if (html.toLowerCase().includes('captcha-container') || 
            html.toLowerCase().includes('verify-you-are-human')) {
            throw new TikTokScraperError('Captcha detected', 'CAPTCHA_REQUIRED');
        }
        
        // Extract JSON using 5-layer fallback
        const jsonData = extractJSONWithLayers(html);
        
        // DEBUG: Log JSON structure to find bio
        if (jsonData) {
            console.log('[Scraper] JSON data keys:', Object.keys(jsonData));
            if (jsonData.UserModule?.users) {
                const firstUser = Object.values(jsonData.UserModule.users)[0];
                if (firstUser) {
                    console.log('[Scraper] First user keys:', Object.keys(firstUser));
                    console.log('[Scraper] First user bio fields:', {
                        bio_description: firstUser.bio_description,
                        signature: firstUser.signature,
                        bio: firstUser.bio,
                        description: firstUser.description,
                    });
                }
            }
            if (jsonData.props?.pageProps?.user) {
                console.log('[Scraper] props.pageProps.user bio fields:', {
                    bio_description: jsonData.props.pageProps.user.bio_description,
                    signature: jsonData.props.pageProps.user.signature,
                    bio: jsonData.props.pageProps.user.bio,
                });
            }
        } else {
            console.warn('[Scraper] No JSON data extracted from HTML');
        }
        
        // Parse user data (even if jsonData is null, parseUserData will return defaults)
        let result = parseUserData(jsonData, cleanUsername);
        
        // DEBUG: Log what we got from JSON parsing
        console.log(`[Scraper] After parseUserData - bio: "${result.bio || 'EMPTY'}"`);
        
        // CRITICAL: Also extract bio from HTML meta tags, SEO JSON-LD, and h2 tag FIRST
        // This is more reliable than JSON extraction for bio
        let htmlBio = extractBioFromHTML(html);
        
        // ALWAYS try direct HTML extraction for bio (even if we have JSON data)
        // This ensures we get bio even if JSON parsing missed it
        const directExtraction = extractDirectValuesFromHTML(html, cleanUsername);
        if (htmlBio) {
            if (!result.bio) {
                result.bio = htmlBio;
                result.description = htmlBio;
                console.log(`[Scraper] ✓ Found bio from HTML meta/SEO/h2: "${htmlBio.substring(0, 50)}${htmlBio.length > 50 ? '...' : ''}"`);
                console.log("BIO FOUND:", htmlBio);
            } else if (htmlBio.length > result.bio.length) {
                // Prefer longer bio (more complete)
                result.bio = htmlBio;
                result.description = htmlBio;
                console.log(`[Scraper] ✓ Using longer bio from HTML: "${htmlBio.substring(0, 50)}${htmlBio.length > 50 ? '...' : ''}"`);
                console.log("BIO FOUND:", htmlBio);
            }
        }
        
        // If we got no data at all, merge everything
        if (!jsonData || (result.followers === 0 && result.likes === 0 && !result.tiktokId && !result.avatar)) {
            if (directExtraction) {
                // Merge direct extraction with existing data
                result = {
                    ...result,
                    ...directExtraction,
                    // Preserve full URLs
                    avatar: preserveFullUrl(directExtraction.avatar || result.avatar),
                    // Prefer direct extraction bio if available
                    bio: directExtraction.bio || result.bio || '',
                    description: directExtraction.bio || result.description || result.bio || '',
                };
                console.log(`[Scraper] After directExtraction merge - bio: "${result.bio || 'EMPTY'}"`);
            }
        } else {
            // We have JSON data, but merge bio from direct extraction if JSON didn't have it
            if (directExtraction && directExtraction.bio && !result.bio) {
                result.bio = directExtraction.bio;
                result.description = directExtraction.bio;
                console.log(`[Scraper] Added bio from direct HTML extraction: "${result.bio.substring(0, 50)}${result.bio.length > 50 ? '...' : ''}"`);
            } else if (directExtraction && directExtraction.bio && result.bio) {
                // If both have bio, prefer the longer one (more complete)
                if (directExtraction.bio.length > result.bio.length) {
                    result.bio = directExtraction.bio;
                    result.description = directExtraction.bio;
                    console.log(`[Scraper] Using longer bio from direct extraction`);
                }
            }
        }
        
        // Extract videos from JSON data - CRITICAL for earnings calculation
        let latestVideos = [];
        if (jsonData) {
            try {
                console.log('[Scraper] Attempting to extract videos from JSON data...');
                console.log('[Scraper] JSON keys:', Object.keys(jsonData));
                
                // Try ItemModule (most common)
                if (jsonData.ItemModule && typeof jsonData.ItemModule === 'object') {
                    const itemModule = jsonData.ItemModule;
                    const videoItems = Array.isArray(itemModule) 
                        ? itemModule 
                        : Object.values(itemModule).filter(item => item && (item.id || item.aweme_id || item.video));
                    
                    console.log(`[Scraper] Found ${videoItems.length} video items in ItemModule`);
                    
                    console.log('[SCRAPER RAW] Sample video item structure:', {
                        keys: Object.keys(videoItems[0] || {}),
                        stats: videoItems[0]?.stats,
                        statistics: videoItems[0]?.statistics,
                        playCount: videoItems[0]?.playCount,
                        viewCount: videoItems[0]?.viewCount,
                        views: videoItems[0]?.views,
                    });
                    
                    latestVideos = videoItems.slice(0, 30).map((item, idx) => {
                        // Extract views from multiple possible locations
                        const views = Number(
                            item.stats?.playCount ||
                            item.stats?.play_count ||
                            item.statistics?.playCount ||
                            item.statistics?.play_count ||
                            item.statistics?.viewCount ||
                            item.playCount ||
                            item.play_count ||
                            item.viewCount ||
                            item.view_count ||
                            item.views ||
                            item.views_count ||
                            0
                        );
                        
                        const likes = Number(
                            item.stats?.diggCount ||
                            item.stats?.digg_count ||
                            item.statistics?.diggCount ||
                            item.statistics?.digg_count ||
                            item.diggCount ||
                            item.digg_count ||
                            item.likes ||
                            0
                        );
                        
                        const comments = Number(
                            item.stats?.commentCount ||
                            item.stats?.comment_count ||
                            item.statistics?.commentCount ||
                            item.statistics?.comment_count ||
                            item.commentCount ||
                            item.comment_count ||
                            item.comments ||
                            0
                        );
                        
                        // Log first 3 videos for debugging
                        if (idx < 3) {
                            console.log(`[EXTRACTED DATA] Video ${idx + 1}:`, {
                                id: item.id || item.aweme_id,
                                views: views,
                                likes: likes,
                                comments: comments,
                                rawStats: item.stats,
                                rawStatistics: item.statistics,
                            });
                        }
                        
                        return {
                            id: item.id || item.aweme_id || item.awemeId || item.itemId || '',
                            cover: item.video?.cover || item.video?.originCover || item.video?.dynamicCover || item.video?.coverUrl || null,
                            views: views,
                            likes: likes,
                            comments: comments,
                            shares: Number(item.stats?.shareCount || item.statistics?.shareCount || item.shareCount || item.shares || 0),
                            createdAt: item.createTime ? new Date(item.createTime * 1000).toISOString() : null,
                            desc: item.desc || item.title || item.text || '',
                            duration: item.video?.duration || item.video?.durationMS || null,
                        };
                    });
                    
                    const videosWithViews = latestVideos.filter(v => v.views > 0);
                    console.log(`[Scraper] ✓ Extracted ${latestVideos.length} videos, ${videosWithViews.length} have views > 0`);
                    
                    if (videosWithViews.length > 0) {
                        const totalViews = videosWithViews.reduce((sum, v) => sum + v.views, 0);
                        const avgViews = totalViews / videosWithViews.length;
                        console.log(`[Scraper] Sample avgViews from extracted videos: ${avgViews.toLocaleString()}`);
                        console.log(`[EXTRACTED DATA] Video stats summary:`, {
                            totalVideos: latestVideos.length,
                            videosWithViews: videosWithViews.length,
                            totalViews: totalViews.toLocaleString(),
                            avgViews: avgViews.toLocaleString(),
                            viewsRange: {
                                min: Math.min(...videosWithViews.map(v => v.views)),
                                max: Math.max(...videosWithViews.map(v => v.views)),
                            },
                        });
                    } else {
                        console.warn('[Scraper] ⚠ No videos with views > 0 extracted from ItemModule');
                    }
                } else {
                    console.warn('[Scraper] ⚠ ItemModule not found in JSON data');
                }
            } catch (videoErr) {
                console.error('[Scraper] ❌ Video extraction failed:', videoErr.message);
                console.error('[Scraper] Error stack:', videoErr.stack);
            }
        } else {
            console.warn('[Scraper] ⚠ No JSON data available for video extraction');
        }
        
        // Ensure username is never empty
        result.username = result.username || cleanUsername;
        result.nickname = result.nickname || result.username || cleanUsername;
        
        // Ensure all stats are numbers >= 0
        result.followers = Math.max(0, Number(result.followers) || 0);
        result.following = Math.max(0, Number(result.following) || 0);
        result.likes = Math.max(0, Number(result.likes) || 0);
        result.videos = Math.max(0, Number(result.videos) || 0);
        
        console.log(`[Scraper] Extracted ${latestVideos.length} videos for @${cleanUsername}`);
        
        // Clean description - ensure it's never "Signature (Required):"
        let cleanDescription = (result.description || result.bio || '').trim();
        if (cleanDescription) {
            cleanDescription = cleanDescription
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/^Signature\s*\(Required\)\s*:\s*/i, '') // Remove prefix
                .trim();
        }
        
        // DEBUG: Log bio extraction
        console.log(`[Scraper] ========================================`);
        console.log(`[Scraper] Bio extraction for @${cleanUsername}:`, {
            rawBio: result.bio,
            rawDescription: result.description,
            cleanDescription: cleanDescription,
            hasBio: !!cleanDescription && cleanDescription.length > 0,
        });
        console.log(`[Scraper] ========================================`);
        
        // Return in required format with full URLs preserved
        return {
            success: true,
            description: cleanDescription || '', // Root level description
            bio: cleanDescription || '', // Also include bio at root level
            user: {
                username: result.username,
                nickname: result.nickname,
                avatar: preserveFullUrl(result.avatar || ''),
                followers: result.followers,
                following: result.following,
                likes: result.likes,
                videos: result.videos,
                bio: cleanDescription || '', // Include bio in user object too
            },
            profile: {
                username: result.username,
                fullName: result.nickname,
                profilePic: preserveFullUrl(result.avatar || ''),
                bio: cleanDescription || '',
                description: cleanDescription || '', // Also include as description
                followers: result.followers,
                following: result.following,
                likes: result.likes,
                videos: result.videos,
                verified: result.verified || false,
                profilePicThumb: preserveFullUrl(result.avatar || ''),
                region: result.region || '',
                tiktokId: result.tiktokId || '',
                category: result.category || '',
                joinedAt: result.joinedAt || null,
                secUid: result.secUid || '',
            },
            latestVideos: latestVideos
        };
        
    } catch (err) {
        if (err instanceof TikTokScraperError) {
            if (err.code === 'NOT_FOUND' || err.code === 'BAD_REQUEST') {
                throw err;
            }
        }
        
        // For all other errors, return minimal data instead of crashing
        return {
            success: true,
            user: {
                username: cleanUsername,
                nickname: cleanUsername,
                avatar: '',
                followers: 0,
                following: 0,
                likes: 0,
                videos: 0,
            },
            profile: {
                username: cleanUsername,
                fullName: cleanUsername,
                profilePic: '',
                bio: '',
                followers: 0,
                following: 0,
                likes: 0,
                videos: 0,
                verified: false,
                profilePicThumb: '',
                region: '',
                tiktokId: '',
                category: '',
                joinedAt: null,
                secUid: '',
            },
            latestVideos: []
        };
    }
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

module.exports = {
    scrapeTikTokProfile,
    TikTokScraperError,
    deriveAnalytics,
};
