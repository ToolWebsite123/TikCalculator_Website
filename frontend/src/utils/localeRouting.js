export const BASE_URL = 'https://www.kalkulatortik.com';

export const DEFAULT_LANG = 'en';

export const NON_DEFAULT_LANGS = ['id', 'de', 'es', 'fr', 'it', 'ms', 'pt'];

export const SUPPORTED_LANGS = [DEFAULT_LANG, ...NON_DEFAULT_LANGS];

export const LANGUAGES = [
  { code: 'en', name: 'English', flagSrc: 'https://flagcdn.com/gb.svg', ogLocale: 'en_US' },
  { code: 'id', name: 'Bahasa Indonesia', flagSrc: 'https://flagcdn.com/id.svg', ogLocale: 'id_ID' },
  { code: 'de', name: 'Deutsch', flagSrc: 'https://flagcdn.com/de.svg', ogLocale: 'de_DE' },
  { code: 'es', name: 'Español', flagSrc: 'https://flagcdn.com/es.svg', ogLocale: 'es_ES' },
  { code: 'fr', name: 'Français', flagSrc: 'https://flagcdn.com/fr.svg', ogLocale: 'fr_FR' },
  { code: 'it', name: 'Italiano', flagSrc: 'https://flagcdn.com/it.svg', ogLocale: 'it_IT' },
  { code: 'pt', name: 'Português (Brasil)', flagSrc: 'https://flagcdn.com/br.svg', ogLocale: 'pt_BR' },
  { code: 'ms', name: 'Malaysian', flagSrc: 'https://flagcdn.com/my.svg', ogLocale: 'ms_MY' },
];

export const OG_LOCALE_BY_LANG = LANGUAGES.reduce((acc, item) => {
  acc[item.code] = item.ogLocale;
  return acc;
}, {});

export const PUBLIC_PAGE_PATHS = [
  '/',
  '/calculator',
  '/about',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
  '/tiktok-cpm-calculator',
  '/tiktok-engagement-calculator',
];

// Indexable public routes (excludes /calculator which carries noindex, follow)
export const INDEXABLE_PAGE_PATHS = [
  '/',
  '/tiktok-cpm-calculator',
  '/tiktok-engagement-calculator',
  '/faq',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

/**
 * Normalize an arbitrary locale tag (e.g. "de-DE", "pt_BR", "unknown") to a supported language code.
 */
export const normalizeLang = (lang) => {
  const base = String(lang || DEFAULT_LANG)
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];
  return SUPPORTED_LANGS.includes(base) ? base : DEFAULT_LANG;
};

/**
 * Check whether an unprefixed base route exists in the application.
 */
export const hasLocalizedRoute = (basePath, lang = DEFAULT_LANG) => {
  const normalized = normalizeLang(lang);
  return SUPPORTED_LANGS.includes(normalized) && PUBLIC_PAGE_PATHS.includes(basePath);
};

/**
 * Parse any URL pathname into its resolved language, unprefixed base path, and validity flags.
 */
export const parseLocalizedPath = (pathname = '/') => {
  const cleanPathname = String(pathname || '/').split(/[?#]/)[0] || '/';
  const segments = cleanPathname.split('/').filter(Boolean);

  let lang = DEFAULT_LANG;
  let hasLangPrefix = false;
  let baseSegments = segments;

  if (segments.length > 0) {
    const firstLower = segments[0].toLowerCase();
    if (NON_DEFAULT_LANGS.includes(firstLower)) {
      lang = firstLower;
      hasLangPrefix = true;
      baseSegments = segments.slice(1);
    }
  }

  const basePath = baseSegments.length === 0 ? '/' : `/${baseSegments.join('/')}`;
  const isKnownRoute = PUBLIC_PAGE_PATHS.includes(basePath);

  const normalizedPath = isKnownRoute
    ? basePath === '/'
      ? lang === DEFAULT_LANG
        ? '/'
        : `/${lang}/`
      : lang === DEFAULT_LANG
      ? basePath
      : `/${lang}${basePath}`
    : cleanPathname;

  return {
    lang,
    basePath,
    hasLangPrefix,
    isKnownRoute,
    normalizedPath,
  };
};

/**
 * Build the canonical localized path for a target route while preserving any query or hash suffix.
 * Default English uses unprefixed paths ("/", "/about"); localized homepages use "/{lang}/".
 */
export const buildLocalizedPath = (targetPath = '/', lang = DEFAULT_LANG) => {
  const raw = String(targetPath || '/');
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(raw)) {
    return raw;
  }

  const match = raw.match(/^([^?#]*)(.*)$/);
  const pathPart = match ? match[1] || '/' : '/';
  const suffix = match ? match[2] || '' : '';

  const { basePath } = parseLocalizedPath(pathPart);
  const targetLang = normalizeLang(lang);

  let localized;
  if (basePath === '/') {
    localized = targetLang === DEFAULT_LANG ? '/' : `/${targetLang}/`;
  } else {
    localized = targetLang === DEFAULT_LANG ? basePath : `/${targetLang}${basePath}`;
  }

  return `${localized}${suffix}`;
};

/**
 * Compute the target URL when switching languages from the current location.
 * Preserves current known page (+ search/hash), falling back safely to the target homepage on unknown routes.
 */
export const getLanguageSwitchTarget = (
  currentPathname = '/',
  targetLang = DEFAULT_LANG,
  search = '',
  hash = ''
) => {
  const nextLang = normalizeLang(targetLang);
  const { basePath, isKnownRoute } = parseLocalizedPath(currentPathname);

  if (!isKnownRoute || !hasLocalizedRoute(basePath, nextLang)) {
    return buildLocalizedPath('/', nextLang);
  }

  return `${buildLocalizedPath(basePath, nextLang)}${search || ''}${hash || ''}`;
};

/**
 * Determine initial language strictly from the current browser URL rather than stale localStorage.
 */
export const getInitialLanguageFromBrowser = () => {
  if (typeof window === 'undefined' || !window.location) {
    return DEFAULT_LANG;
  }
  const { lang, hasLangPrefix } = parseLocalizedPath(window.location.pathname);
  return hasLangPrefix ? lang : DEFAULT_LANG;
};

/**
 * Check whether an unprefixed base path is indexable (and thus eligible for sitemap/hreflang clusters).
 */
export const isIndexableBasePath = (basePath) => INDEXABLE_PAGE_PATHS.includes(basePath);

/**
 * Build full canonical URL for an indexable/public base path and language.
 */
export const buildCanonicalUrl = (basePath = '/', lang = DEFAULT_LANG) =>
  `${BASE_URL}${buildLocalizedPath(basePath, lang)}`;

/**
 * Return all valid alternate hreflang link descriptors (+ x-default) for an indexable page.
 * Returns [] for non-indexable or unknown paths so broken/noindex URLs never enter hreflang clusters.
 */
export const getHreflangAlternates = (basePath) => {
  const { basePath: cleanBase } = parseLocalizedPath(basePath || '/');
  if (!isIndexableBasePath(cleanBase)) {
    return [];
  }

  const alternates = SUPPORTED_LANGS.map((lang) => ({
    hreflang: lang,
    href: buildCanonicalUrl(cleanBase, lang),
  }));

  alternates.push({
    hreflang: 'x-default',
    href: buildCanonicalUrl(cleanBase, DEFAULT_LANG),
  });

  return alternates;
};
