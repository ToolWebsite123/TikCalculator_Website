import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PREVIEW_SUBPAGE_SLUGS = new Set([
  'calculator',
  'about',
  'faq',
  'contact',
  'privacy',
  'terms',
  'tiktok-cpm-calculator',
  'tiktok-engagement-calculator',
]);

const PREVIEW_LANGS = new Set(['id', 'de', 'es', 'fr', 'it', 'ms', 'pt']);

// Mirrors vercel.json static routing, cleanUrls, slash normalization, and genuine HTTP 404 responses during `vite preview`
const previewVercelParityPlugin = () => ({
  name: 'preview-vercel-parity',
  configurePreviewServer(server) {
    const distDir = path.resolve(__dirname, 'dist');

    server.middlewares.use((req, res, next) => {
      if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) {
        return next();
      }

      const [rawPathname, rawSearch] = req.url.split('?');
      let pathname = rawPathname || '/';
      try {
        pathname = decodeURIComponent(pathname);
      } catch {
        res.statusCode = 400;
        res.end('Bad Request');
        return undefined;
      }
      const querySuffix = rawSearch ? `?${rawSearch}` : '';

      if (pathname === '/api' || pathname.startsWith('/api/')) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          req.method === 'HEAD'
            ? ''
            : JSON.stringify({ success: false, error: `API endpoint not found: ${pathname}` })
        );
        return undefined;
      }

      const segments = pathname.split('/').filter(Boolean);
      if (segments.length === 1 && PREVIEW_LANGS.has(segments[0]) && !pathname.endsWith('/')) {
        res.statusCode = 308;
        res.setHeader('Location', `/${segments[0]}/${querySuffix}`);
        res.end();
        return undefined;
      }
      if (pathname.length > 1 && pathname.endsWith('/')) {
        if (segments.length === 1 && PREVIEW_SUBPAGE_SLUGS.has(segments[0])) {
          res.statusCode = 308;
          res.setHeader('Location', `/${segments[0]}${querySuffix}`);
          res.end();
          return undefined;
        }
        if (
          segments.length === 2 &&
          PREVIEW_LANGS.has(segments[0]) &&
          PREVIEW_SUBPAGE_SLUGS.has(segments[1])
        ) {
          res.statusCode = 308;
          res.setHeader('Location', `/${segments[0]}/${segments[1]}${querySuffix}`);
          res.end();
          return undefined;
        }
      }

      const cleanRel = pathname.replace(/^\/+/, '');
      const candidatePaths =
        pathname === '/'
          ? [path.resolve(distDir, 'index.html')]
          : pathname.endsWith('/')
          ? [path.resolve(distDir, cleanRel, 'index.html')]
          : [
              path.resolve(distDir, cleanRel),
              path.resolve(distDir, `${cleanRel}.html`),
            ];

      const matchesStaticFile = candidatePaths.some(
        (candidate) =>
          (candidate === distDir || candidate.startsWith(`${distDir}${path.sep}`)) &&
          fs.existsSync(candidate) &&
          fs.statSync(candidate).isFile()
      );

      if (matchesStaticFile) {
        return next();
      }

      res.statusCode = 404;
      const notFoundPath = path.join(distDir, '404.html');
      const wantsHtml = (req.headers.accept || '').includes('text/html') || !path.extname(pathname);
      if (wantsHtml && fs.existsSync(notFoundPath)) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.end(req.method === 'HEAD' ? '' : fs.readFileSync(notFoundPath, 'utf8'));
      } else {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(req.method === 'HEAD' ? '' : '404 Not Found');
      }
      return undefined;
    });
  },
});

export default defineConfig({
  plugins: [react(), previewVercelParityPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    fileParallelism: false,
  },
  server: {
    host: true, // Expose on network (0.0.0.0)
    port: 5173,
  },
});
