import { useEffect } from 'react';
import { useActiveLang } from '../contexts/LocaleContext';
import { useSEOCollector } from '../contexts/SEOContext';
import {
  BASE_URL,
  OG_LOCALE_BY_LANG,
  buildLocalizedPath,
  getHreflangAlternates,
  parseLocalizedPath,
} from './localeRouting';

const DEFAULT_IMAGE = `${BASE_URL}/og.png`;
const DEFAULT_IMAGE_ALT =
  'KalkulatorTik TikTok Money Calculator – Estimate Brand Sponsorship Value per Video';
const DOMAIN = 'www.kalkulatortik.com';

const setMetaTag = (attr, key, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const syncCanonicalTag = (url, omitCanonical) => {
  const existing = Array.from(document.querySelectorAll('link[rel="canonical"]'));
  if (omitCanonical || !url) {
    existing.forEach((node) => node.remove());
    return;
  }

  let primary = existing[0];
  if (!primary) {
    primary = document.createElement('link');
    primary.setAttribute('rel', 'canonical');
    document.head.appendChild(primary);
  }
  primary.setAttribute('href', url);

  // Deduplicate if multiple canonical tags ever existed
  existing.slice(1).forEach((extra) => extra.remove());
};

const syncHreflangTags = (alternates) => {
  const existing = document.head.querySelectorAll('link[rel="alternate"][hreflang]');
  existing.forEach((node) => node.remove());

  alternates.forEach(({ hreflang, href }) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', hreflang);
    link.setAttribute('href', href);
    link.setAttribute('data-seo-managed', 'hreflang');
    document.head.appendChild(link);
  });
};

/**
 * Custom hook to update document title, robots, locale-aware canonical link, hreflang cluster,
 * Open Graph, Twitter cards, and optional route-scoped JSON-LD structured data.
 * Also reports resolved metadata to SEOContext during static SSR prerendering.
 */
export const useSEO = ({
  title,
  description,
  canonicalPath = '',
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  type = 'website',
  siteName = 'KalkulatorTik',
  locale,
  robots = 'index, follow',
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  structuredData = null,
  omitCanonical = false,
  omitHreflang = false,
}) => {
  const activeLang = useActiveLang();
  const collectSeo = useSEOCollector();
  const { basePath } = parseLocalizedPath(canonicalPath || '/');
  const localizedPath = buildLocalizedPath(basePath, activeLang);
  const fullUrl = `${BASE_URL}${localizedPath}`;
  const resolvedLocale = locale || OG_LOCALE_BY_LANG[activeLang] || 'en_US';
  const isNoIndex = String(robots || '').toLowerCase().includes('noindex');
  const alternates =
    omitCanonical || omitHreflang || isNoIndex ? [] : getHreflangAlternates(basePath);
  const alternatesKey = alternates.map((item) => `${item.hreflang}:${item.href}`).join('|');
  const serializedSchema = structuredData ? JSON.stringify(structuredData) : null;

  if (collectSeo) {
    collectSeo({
      lang: activeLang,
      basePath,
      localizedPath,
      title,
      description,
      robots,
      canonicalUrl: omitCanonical ? null : fullUrl,
      alternates,
      type,
      siteName,
      locale: resolvedLocale,
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description,
      twitterTitle: twitterTitle || ogTitle || title,
      twitterDescription: twitterDescription || ogDescription || description,
      image,
      imageAlt,
      domain: DOMAIN,
      structuredData,
    });
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = activeLang;
    }

    if (title) {
      document.title = title;
    }

    if (description) {
      setMetaTag('name', 'description', description);
    }

    if (robots) {
      setMetaTag('name', 'robots', robots);
    }

    syncCanonicalTag(fullUrl, omitCanonical);
    syncHreflangTags(
      omitCanonical || omitHreflang || isNoIndex ? [] : getHreflangAlternates(basePath)
    );

    // Open Graph
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('property', 'og:locale', resolvedLocale);
    setMetaTag('property', 'og:url', fullUrl);
    setMetaTag('property', 'og:title', ogTitle || title);
    setMetaTag('property', 'og:description', ogDescription || description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:image:alt', imageAlt);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:domain', DOMAIN);
    setMetaTag('name', 'twitter:url', fullUrl);
    setMetaTag('name', 'twitter:title', twitterTitle || ogTitle || title);
    setMetaTag('name', 'twitter:description', twitterDescription || ogDescription || description);
    setMetaTag('name', 'twitter:image', image);
    setMetaTag('name', 'twitter:image:alt', imageAlt);
  }, [
    activeLang,
    basePath,
    localizedPath,
    fullUrl,
    alternatesKey,
    isNoIndex,
    title,
    description,
    image,
    imageAlt,
    type,
    siteName,
    resolvedLocale,
    robots,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    omitCanonical,
    omitHreflang,
  ]);

  useEffect(() => {
    const existing = document.head.querySelector('script[data-seo-managed="page-schema"]');
    if (!serializedSchema) {
      if (existing) existing.remove();
      return undefined;
    }

    let script = existing;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-managed', 'page-schema');
      document.head.appendChild(script);
    }
    script.textContent = serializedSchema;

    return () => {
      const current = document.head.querySelector('script[data-seo-managed="page-schema"]');
      if (current) current.remove();
    };
  }, [serializedSchema]);
};

export default useSEO;
