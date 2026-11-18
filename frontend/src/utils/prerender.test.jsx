import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'node:fs';
import path from 'node:path';
import i18n from '../i18n';
import { AppShell, preloadRouteForPath } from '../App';
import { ThemeProvider } from '../contexts/ThemeContext';
import { loadHomeLocalePack } from '../locales/homeContentRegistry';
import {
  BASE_URL,
  PUBLIC_PAGE_PATHS,
  SUPPORTED_LANGS,
  buildLocalizedPath,
} from './localeRouting';
import * as api from './api';

import Home from '../pages/Home';
import Calculator from '../pages/Calculator';
import About from '../pages/About';
import Faq from '../pages/Faq';
import Contact from '../pages/Contact';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';
import TikTokCPMCalculator from '../pages/TikTokCPMCalculator';
import TikTokEngagementCalculator from '../pages/TikTokEngagementCalculator';
import NotFound from '../pages/NotFound';

const EAGER_COMPONENTS = {
  Home,
  Calculator,
  About,
  Faq,
  Contact,
  PrivacyPolicy,
  TermsAndConditions,
  TikTokCPMCalculator,
  TikTokEngagementCalculator,
  NotFound,
};

const distDir = path.resolve(__dirname, '../../dist');

const resolveDistFile = (routeUrl) => {
  if (routeUrl === '/') return path.join(distDir, 'index.html');
  const clean = routeUrl.replace(/^\//, '');
  return clean.endsWith('/')
    ? path.join(distDir, clean, 'index.html')
    : path.join(distDir, `${clean}.html`);
};

const extractRootInnerHtml = (fullHtml) => {
  const match = fullHtml.match(
    /<div id="root" data-ssr-route="[^"]*">([\s\S]*?)<\/div>\s*<\/body>/i
  );
  return match ? match[1] : null;
};

describe('Production Prerendered HTML & Hydration Validation (KHK-07)', () => {
  let hydratedRoot = null;
  let containerEl = null;

  afterEach(async () => {
    vi.restoreAllMocks();
    if (hydratedRoot) {
      await act(async () => {
        hydratedRoot.unmount();
      });
      hydratedRoot = null;
    }
    if (containerEl && containerEl.parentNode) {
      containerEl.parentNode.removeChild(containerEl);
      containerEl = null;
    }
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  const routeMatrix = SUPPORTED_LANGS.flatMap((lang) =>
    PUBLIC_PAGE_PATHS.map((basePath) => ({
      lang,
      basePath,
      routeUrl: buildLocalizedPath(basePath, lang),
    }))
  );

  it.each(routeMatrix)(
    'validates built static HTML for $routeUrl ($lang / $basePath)',
    ({ lang, basePath, routeUrl }) => {
      const htmlPath = resolveDistFile(routeUrl);
      expect(fs.existsSync(htmlPath)).toBe(true);

      const html = fs.readFileSync(htmlPath, 'utf8');
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      expect(doc.documentElement.getAttribute('lang')).toBe(lang);

      const title = doc.querySelector('title')?.textContent?.trim();
      expect(title).toBeTruthy();

      const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
      expect(metaDesc).toBeTruthy();

      const canonicals = doc.querySelectorAll('link[rel="canonical"]');
      expect(canonicals).toHaveLength(1);
      expect(canonicals[0].getAttribute('href')).toBe(`${BASE_URL}${routeUrl}`);

      const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content');
      const alternates = doc.querySelectorAll('link[rel="alternate"][hreflang]');

      if (basePath === '/calculator') {
        expect(robots).toBe('noindex, follow');
        expect(alternates).toHaveLength(0);
      } else {
        expect(robots).toBe('index, follow');
        expect(alternates).toHaveLength(9);
      }

      // Structured data scripts parse validly
      const ldScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
      expect(ldScripts.length).toBeGreaterThanOrEqual(1);
      ldScripts.forEach((script) => {
        expect(() => JSON.parse(script.textContent)).not.toThrow();
      });

      const rootEl = doc.getElementById('root');
      expect(rootEl).not.toBeNull();
      expect(rootEl.getAttribute('data-ssr-route')).toBe(routeUrl);

      // Must contain H1 and real visible body content, never loading spinner fallback
      const h1 = rootEl.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1.textContent.trim().length).toBeGreaterThan(3);
      expect(rootEl.textContent).not.toContain('Loading page...');

      if (basePath === '/' && lang === 'en') {
        expect(h1.textContent.trim()).toBe('TikTok Money Calculator');
      }

      if (basePath === '/') {
        const faqSchemaScript = doc.querySelector('script[data-seo-managed="page-schema"]');
        expect(faqSchemaScript).not.toBeNull();
        const faqSchema = JSON.parse(faqSchemaScript.textContent);
        expect(faqSchema['@type']).toBe('FAQPage');
        expect(faqSchema.inLanguage).toBe(lang);
        expect(faqSchema.mainEntity).toHaveLength(12);
      }

      // Calculator routes must NOT hardcode fake estimation output in static HTML
      if (basePath === '/' || basePath === '/calculator') {
        expect(html).not.toContain('ESTIMATED SPONSORSHIP VALUE PER VIDEO');
      }
    }
  );

  it('generates branded noindex 404.html page without canonical or homepage content and hydrates cleanly on unknown English routes', async () => {
    const fallbackPath = path.join(distDir, '404.html');
    expect(fs.existsSync(fallbackPath)).toBe(true);

    const html = fs.readFileSync(fallbackPath, 'utf8');
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const robotsMeta = doc.querySelector('meta[name="robots"]');
    expect(robotsMeta).not.toBeNull();
    expect(robotsMeta.getAttribute('content')).toBe('noindex, nofollow');
    expect(doc.querySelector('link[rel="canonical"]')).toBeNull();
    expect(doc.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(0);
    expect(doc.querySelector('meta[property="og:url"]')).toBeNull();
    expect(doc.querySelector('meta[name="twitter:url"]')).toBeNull();

    const rootEl = doc.getElementById('root');
    expect(rootEl.getAttribute('data-ssr-route')).toBe('*');
    expect(rootEl.querySelector('h1')?.textContent?.trim()).toBe('Page not found');
    expect(rootEl.textContent).toContain('404');
    expect(rootEl.textContent).toContain('Go back home');

    const rootInner = extractRootInnerHtml(html);
    expect(rootInner).toBeTruthy();

    containerEl = document.createElement('div');
    containerEl.id = 'root';
    containerEl.innerHTML = rootInner;
    document.body.appendChild(containerEl);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      hydratedRoot = hydrateRoot(
        containerEl,
        <ThemeProvider>
          <MemoryRouter initialEntries={['/this-page-does-not-exist']}>
            <AppShell routeComponents={EAGER_COMPONENTS} />
          </MemoryRouter>
        </ThemeProvider>
      );
    });

    const hydrationWarnings = consoleErrorSpy.mock.calls.filter((call) =>
      call.some((arg) => /hydrat|did not match/i.test(String(arg)))
    );
    expect(hydrationWarnings).toHaveLength(0);
  });

  it('configures vercel.json without catch-all HTTP 200 rewrite while preserving cleanUrls, subpage redirects, and /api proxy', () => {
    const vercelConfig = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../vercel.json'), 'utf8')
    );

    expect(vercelConfig.cleanUrls).toBe(true);
    expect(vercelConfig.rewrites).toEqual([
      {
        source: '/api/:path*',
        destination: 'https://tik-calculator-website-ljy6.vercel.app/api/:path*',
      },
    ]);
    expect(vercelConfig.rewrites.some((r) => r.source === '/(.*)')).toBe(false);
    expect(vercelConfig.redirects.length).toBeGreaterThanOrEqual(4);
  });

  it('hydrates built Homepage HTML without hydration warnings and preserves live calculator & FAQ interactivity', async () => {
    const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    const rootInner = extractRootInnerHtml(html);
    expect(rootInner).toBeTruthy();

    containerEl = document.createElement('div');
    containerEl.id = 'root';
    containerEl.innerHTML = rootInner;
    document.body.appendChild(containerEl);

    vi.spyOn(api, 'fetchTikTokStats').mockResolvedValueOnce({
      profile: {
        username: 'hydrated_creator',
        fullName: 'Hydrated Creator',
        followers: 150000,
        following: 90,
        likes: 3200000,
        videos: 110,
      },
      earningsData: {
        avgViews: 45000,
        engagementRate: 7.5,
        cpm: 29.0,
        cpmMin: 21.0,
        cpmMax: 41.0,
        estimatedEarnings: 1305.0,
        earningsMin: 945.0,
        earningsMax: 1845.0,
        analytics: { sampleSize: 20 },
      },
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      hydratedRoot = hydrateRoot(
        containerEl,
        <ThemeProvider>
          <MemoryRouter initialEntries={['/']}>
            <AppShell routeComponents={EAGER_COMPONENTS} />
          </MemoryRouter>
        </ThemeProvider>
      );
    });

    const hydrationWarnings = consoleErrorSpy.mock.calls.filter((call) =>
      call.some((arg) => /hydrat|did not match/i.test(String(arg)))
    );
    expect(hydrationWarnings).toHaveLength(0);

    // Interactive FAQ accordion still toggles cleanly after hydration
    const faq3Btn = screen.getByRole('button', {
      name: /Toggle answer for: 3\. How is a TikTok sponsorship estimate calculated/i,
    });
    expect(faq3Btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(faq3Btn);
    expect(faq3Btn).toHaveAttribute('aria-expanded', 'true');

    // Interactive TikTok calculator form still works after hydration
    const input = screen.getByLabelText(/TikTok username input/i);
    const submitBtn = screen.getByRole('button', { name: /^Calculate Sponsorship Value$/i });
    fireEvent.change(input, { target: { value: '@hydrated_creator' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Results for @hydrated_creator/i)).toBeInTheDocument();
      expect(screen.getByText('$1,305.00')).toBeInTheDocument();
    });
  }, 15000);

  it.each(['/about', '/id', '/de/calculator'])(
    'hydrates prerendered route "%s" cleanly with zero hydration mismatch errors',
    async (routeUrl) => {
      const lang = routeUrl.startsWith('/id')
        ? 'id'
        : routeUrl.startsWith('/de')
        ? 'de'
        : 'en';

      await act(async () => {
        if (lang !== 'en') {
          await Promise.all([i18n.changeLanguage(lang), loadHomeLocalePack(lang)]);
        } else {
          await i18n.changeLanguage('en');
        }
      });

      const html = fs.readFileSync(resolveDistFile(routeUrl), 'utf8');
      const rootInner = extractRootInnerHtml(html);
      expect(rootInner).toBeTruthy();

      containerEl = document.createElement('div');
      containerEl.id = 'root';
      containerEl.innerHTML = rootInner;
      document.body.appendChild(containerEl);

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await act(async () => {
        hydratedRoot = hydrateRoot(
          containerEl,
          <ThemeProvider>
            <MemoryRouter initialEntries={[routeUrl]}>
              <AppShell routeComponents={EAGER_COMPONENTS} />
            </MemoryRouter>
          </ThemeProvider>
        );
      });

      const hydrationWarnings = consoleErrorSpy.mock.calls.filter((call) =>
        call.some((arg) => /hydrat|did not match/i.test(String(arg)))
      );
      expect(hydrationWarnings).toHaveLength(0);
    }
  );

  it('hydrates prerendered lazy subpage (/about) via preloadRouteForPath just like main.jsx with zero mismatch errors', async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
      await preloadRouteForPath('/about');
    });

    const html = fs.readFileSync(resolveDistFile('/about'), 'utf8');
    const rootInner = extractRootInnerHtml(html);
    expect(rootInner).toBeTruthy();

    containerEl = document.createElement('div');
    containerEl.id = 'root';
    containerEl.innerHTML = rootInner;
    document.body.appendChild(containerEl);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      hydratedRoot = hydrateRoot(
        containerEl,
        <ThemeProvider>
          <MemoryRouter initialEntries={['/about']}>
            <AppShell />
          </MemoryRouter>
        </ThemeProvider>
      );
    });

    const hydrationWarnings = consoleErrorSpy.mock.calls.filter((call) =>
      call.some((arg) => /hydrat|did not match/i.test(String(arg)))
    );
    expect(hydrationWarnings).toHaveLength(0);
    expect(screen.getByRole('heading', { level: 1, name: /About Us – KalkulatorTik/i })).toBeInTheDocument();
  });
});
