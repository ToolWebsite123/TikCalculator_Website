import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, '..');
const distDir = path.join(frontendRoot, 'dist');
const ssrOutDir = path.join(frontendRoot, 'dist-ssr');

const PUBLIC_BASE_ROUTES = [
  '/',
  '/calculator',
  '/tiktok-cpm-calculator',
  '/tiktok-engagement-calculator',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
];

const SUPPORTED_LANGS = ['en', 'id', 'de', 'es', 'fr', 'it', 'ms', 'pt'];

const getAllPrerenderRoutes = () => {
  const routes = [];
  SUPPORTED_LANGS.forEach((lang) => {
    PUBLIC_BASE_ROUTES.forEach((basePath) => {
      if (lang === 'en') {
        routes.push(basePath);
      } else if (basePath === '/') {
        routes.push(`/${lang}/`);
      } else {
        routes.push(`/${lang}${basePath}`);
      }
    });
  });
  return routes;
};

const resolveOutputFile = (routeUrl) => {
  if (routeUrl === '/') {
    return path.join(distDir, 'index.html');
  }
  const clean = routeUrl.replace(/^\//, '');
  if (clean.endsWith('/')) {
    return path.join(distDir, clean, 'index.html');
  }
  return path.join(distDir, `${clean}.html`);
};

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeAttr = (value) =>
  escapeHtml(value).replace(/"/g, '&quot;');

const safeJsonForScript = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const replaceOrInsertMeta = (html, attrName, attrKey, content) => {
  if (!content) return html;
  const regex = new RegExp(`<meta\\b[^>]*\\b${attrName}=["']${attrKey}["'][^>]*>`, 'is');
  const tag = `<meta ${attrName}="${attrKey}" content="${escapeAttr(content)}" />`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace('</head>', `    ${tag}\n  </head>`);
};

const updateStaticGraphJsonLd = (html, seo) => {
  const ldRegex = /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/i;
  return html.replace(ldRegex, (full, openTag, rawJson, closeTag) => {
    if (openTag.includes('data-seo-managed')) {
      return full;
    }

    try {
      const parsed = JSON.parse(rawJson.trim());
      if (Array.isArray(parsed['@graph'])) {
        const isNoIndexNoFollow = String(seo.robots || '').includes('noindex, nofollow');
        const isToolOrHome =
          !isNoIndexNoFollow &&
          seo.basePath !== '/404' &&
          (seo.basePath === '/' ||
            seo.basePath === '/calculator' ||
            seo.basePath === '/tiktok-cpm-calculator' ||
            seo.basePath === '/tiktok-engagement-calculator');

        parsed['@graph'] = parsed['@graph']
          .filter((node) => isToolOrHome || node['@type'] !== 'WebApplication')
          .map((node) => {
            if (node['@type'] === 'WebSite') {
              return {
                ...node,
                inLanguage: seo.lang,
                description:
                  seo.basePath === '/' && !isNoIndexNoFollow
                    ? seo.description || node.description
                    : node.description,
              };
            }
            if (node['@type'] === 'WebApplication') {
              return {
                ...node,
                url: seo.canonicalUrl || node.url,
                inLanguage: seo.lang,
                description: seo.description || node.description,
              };
            }
            return node;
          });
      }
      return `${openTag}\n    ${safeJsonForScript(parsed)}\n    ${closeTag}`;
    } catch {
      return full;
    }
  });
};

const injectRouteHtml = (templateHtml, { routeUrl, appHtml, seo, omitAppRoot = false }) => {
  let out = templateHtml;

  out = out.replace(/<html\b([^>]*)\blang=["'][^"']*["']/i, `<html$1lang="${escapeAttr(seo.lang)}"`);

  if (seo.title) {
    out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  }

  out = replaceOrInsertMeta(out, 'name', 'robots', seo.robots || 'index, follow');
  out = replaceOrInsertMeta(out, 'name', 'description', seo.description);

  const hreflangTags = (seo.alternates || [])
    .map(
      ({ hreflang, href }) =>
        `<link rel="alternate" hreflang="${escapeAttr(hreflang)}" href="${escapeAttr(href)}" data-seo-managed="hreflang" />`
    )
    .join('\n    ');

  const canonicalRegex = /<link\b[^>]*rel=["']canonical["'][^>]*>/i;
  if (seo.canonicalUrl) {
    const canonicalTag = `<link rel="canonical" href="${escapeAttr(seo.canonicalUrl)}" />`;
    const replacement = hreflangTags ? `${canonicalTag}\n    ${hreflangTags}` : canonicalTag;
    out = canonicalRegex.test(out)
      ? out.replace(canonicalRegex, replacement)
      : out.replace('</head>', `    ${replacement}\n  </head>`);
  } else {
    out = out.replace(canonicalRegex, '');
  }

  // Open Graph & Twitter tags
  out = replaceOrInsertMeta(out, 'property', 'og:locale', seo.locale);
  if (seo.canonicalUrl) {
    out = replaceOrInsertMeta(out, 'property', 'og:url', seo.canonicalUrl);
    out = replaceOrInsertMeta(out, 'name', 'twitter:url', seo.canonicalUrl);
  } else {
    out = out.replace(/<meta\b[^>]*property=["']og:url["'][^>]*>\s*/gi, '');
    out = out.replace(/<meta\b[^>]*name=["']twitter:url["'][^>]*>\s*/gi, '');
  }
  out = replaceOrInsertMeta(out, 'property', 'og:title', seo.ogTitle || seo.title);
  out = replaceOrInsertMeta(out, 'property', 'og:description', seo.ogDescription || seo.description);
  out = replaceOrInsertMeta(out, 'name', 'twitter:title', seo.twitterTitle || seo.title);
  out = replaceOrInsertMeta(
    out,
    'name',
    'twitter:description',
    seo.twitterDescription || seo.description
  );

  // Update base structured data language/tool context cleanly
  out = updateStaticGraphJsonLd(out, seo);

  // Inject route-scoped JSON-LD (e.g. localized FAQPage on Homepage) without creating duplicates on hydration
  if (seo.structuredData) {
    const schemaTag = `<script type="application/ld+json" data-seo-managed="page-schema">${safeJsonForScript(
      seo.structuredData
    )}</script>`;
    out = out.replace('</head>', `    ${schemaTag}\n  </head>`);
  }

  // Replace root container with prerendered SSR HTML
  const rootMarker = routeUrl || '*';
  const rootContent = omitAppRoot
    ? '<div id="root"></div>'
    : `<div id="root" data-ssr-route="${escapeAttr(rootMarker)}">${appHtml}</div>`;

  out = out.replace(/<div id="root"><\/div>/i, rootContent);

  return out;
};

const prerender = async () => {
  const baseTemplatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(baseTemplatePath)) {
    throw new Error('dist/index.html not found. Run Vite client build before prerendering.');
  }

  const spaTemplateHtml = fs.readFileSync(baseTemplatePath, 'utf8');

  try {
    await build({
      root: frontendRoot,
      logLevel: 'silent',
      build: {
        ssr: 'src/entry-server.jsx',
        outDir: 'dist-ssr',
        emptyOutDir: true,
        rollupOptions: {
          output: {
            format: 'es',
            entryFileNames: 'entry-server.mjs',
          },
        },
      },
    });

    const serverEntryUrl = pathToFileURL(path.join(ssrOutDir, 'entry-server.mjs')).href;
    const { renderRoute } = await import(serverEntryUrl);

    const routes = getAllPrerenderRoutes();

    for (const routeUrl of routes) {
      const { html, seo } = await renderRoute(routeUrl);
      if (!seo) {
        throw new Error(`Missing SEO metadata collection while prerendering ${routeUrl}`);
      }
      if (!/<h1[\s>]/i.test(html)) {
        throw new Error(`Missing <h1> in prerendered HTML for ${routeUrl}`);
      }
      if (html.includes('Loading page...')) {
        throw new Error(`Suspense fallback leaked into prerendered HTML for ${routeUrl}`);
      }

      const finalHtml = injectRouteHtml(spaTemplateHtml, {
        routeUrl,
        appHtml: html,
        seo,
      });

      const targetPath = resolveOutputFile(routeUrl);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, finalHtml, 'utf8');
    }

    // Generate branded prerendered 404.html served natively by Vercel with HTTP 404 on unknown URLs
    const { html: notFoundHtml, seo: notFoundSeo } = await renderRoute('/404-not-found');
    if (!notFoundHtml || !notFoundSeo || !notFoundHtml.includes('404')) {
      throw new Error('Failed to render branded 404.html template.');
    }

    const fallbackHtml = injectRouteHtml(spaTemplateHtml, {
      routeUrl: '*',
      appHtml: notFoundHtml,
      omitAppRoot: false,
      seo: notFoundSeo,
    });
    fs.writeFileSync(path.join(distDir, '404.html'), fallbackHtml, 'utf8');

    console.log(`Prerendered ${routes.length} static localized pages + 404.html into dist/`);
  } finally {
    fs.rmSync(ssrOutDir, { recursive: true, force: true });
  }
};

prerender().catch((err) => {
  console.error('[Prerender Error]', err);
  process.exit(1);
});
