import {
  INDEXABLE_PAGE_PATHS,
  SUPPORTED_LANGS,
  buildCanonicalUrl,
} from './localeRouting.js';

export const SITEMAP_ROUTE_META = {
  '/': { changefreq: 'daily', priority: '1.0' },
  '/tiktok-cpm-calculator': { changefreq: 'weekly', priority: '0.8' },
  '/tiktok-engagement-calculator': { changefreq: 'weekly', priority: '0.8' },
  '/faq': { changefreq: 'monthly', priority: '0.7' },
  '/about': { changefreq: 'monthly', priority: '0.6' },
  '/contact': { changefreq: 'monthly', priority: '0.5' },
  '/privacy': { changefreq: 'monthly', priority: '0.4' },
  '/terms': { changefreq: 'monthly', priority: '0.4' },
};

const DEFAULT_LASTMOD = '2026-11-17T00:00:00+00:00';

const escapeXml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * Generate standards-compliant XML sitemap entries for all indexable localized routes.
 */
export const generateSitemapXml = (lastmod = DEFAULT_LASTMOD) => {
  const urlBlocks = [];

  INDEXABLE_PAGE_PATHS.forEach((basePath) => {
    const meta = SITEMAP_ROUTE_META[basePath] || { changefreq: 'monthly', priority: '0.5' };

    SUPPORTED_LANGS.forEach((lang) => {
      const loc = buildCanonicalUrl(basePath, lang);
      const priority =
        basePath === '/' && lang !== 'en' ? '0.9' : meta.priority;

      urlBlocks.push(
        [
          '  <url>',
          `    <loc>${escapeXml(loc)}</loc>`,
          `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
          `    <changefreq>${escapeXml(meta.changefreq)}</changefreq>`,
          `    <priority>${escapeXml(priority)}</priority>`,
          '  </url>',
        ].join('\n')
      );
    });
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlBlocks,
    '</urlset>',
    '',
  ].join('\n');
};
