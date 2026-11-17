import React from 'react';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import i18n from '../i18n';
import { AppShell } from '../App';
import { ThemeProvider } from '../contexts/ThemeContext';
import {
  BASE_URL,
  INDEXABLE_PAGE_PATHS,
  LANGUAGES,
  NON_DEFAULT_LANGS,
  PUBLIC_PAGE_PATHS,
  SUPPORTED_LANGS,
  buildLocalizedPath,
  getHreflangAlternates,
  getInitialLanguageFromBrowser,
  getLanguageSwitchTarget,
  parseLocalizedPath,
} from './localeRouting';
import { generateSitemapXml } from './sitemap';

const renderAppAt = (initialEntries) => {
  let routerNavigate = null;
  const NavSpy = () => {
    routerNavigate = useNavigate();
    return null;
  };

  const view = render(
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <NavSpy />
        <AppShell />
      </MemoryRouter>
    </ThemeProvider>
  );

  return {
    ...view,
    go: async (deltaOrTo) => {
      await act(async () => {
        routerNavigate(deltaOrTo);
      });
    },
  };
};

describe('Multilingual URL Routing, Language Switcher, Hreflang & Sitemap (KHK-06)', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.head
      .querySelectorAll('link[rel="alternate"][hreflang], link[rel="canonical"], script[data-seo-managed]')
      .forEach((el) => el.remove());
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  describe('URL path helpers', () => {
    it('builds and parses localized URLs consistently across all 8 languages', () => {
      expect(buildLocalizedPath('/', 'en')).toBe('/');
      NON_DEFAULT_LANGS.forEach((lang) => {
        expect(buildLocalizedPath('/', lang)).toBe(`/${lang}/`);
        expect(buildLocalizedPath('/calculator', lang)).toBe(`/${lang}/calculator`);
        expect(buildLocalizedPath('/tiktok-cpm-calculator', lang)).toBe(
          `/${lang}/tiktok-cpm-calculator`
        );
      });

      expect(parseLocalizedPath('/id/')).toEqual({
        lang: 'id',
        basePath: '/',
        hasLangPrefix: true,
        isKnownRoute: true,
        normalizedPath: '/id/',
      });
      expect(parseLocalizedPath('/id')).toEqual({
        lang: 'id',
        basePath: '/',
        hasLangPrefix: true,
        isKnownRoute: true,
        normalizedPath: '/id/',
      });
      expect(parseLocalizedPath('/de/calculator/')).toEqual({
        lang: 'de',
        basePath: '/calculator',
        hasLangPrefix: true,
        isKnownRoute: true,
        normalizedPath: '/de/calculator',
      });
      expect(parseLocalizedPath('/es/unknown-page')).toEqual({
        lang: 'es',
        basePath: '/unknown-page',
        hasLangPrefix: true,
        isKnownRoute: false,
        normalizedPath: '/es/unknown-page',
      });
    });

    it('computes safe language switch targets and never lets stale localStorage override root URL language', () => {
      expect(getLanguageSwitchTarget('/tiktok-cpm-calculator', 'de', '?curr=EUR', '#top')).toBe(
        '/de/tiktok-cpm-calculator?curr=EUR#top'
      );
      expect(getLanguageSwitchTarget('/de/about', 'en')).toBe('/about');
      expect(getLanguageSwitchTarget('/id/', 'pt')).toBe('/pt/');
      expect(getLanguageSwitchTarget('/id/', 'en')).toBe('/');
      expect(getLanguageSwitchTarget('/de/nonexistent', 'fr')).toBe('/fr/');
      expect(getLanguageSwitchTarget('/nonexistent', 'id')).toBe('/id/');

      localStorage.setItem('i18nextLng', 'fr');
      window.history.pushState({}, '', '/');
      expect(getInitialLanguageFromBrowser()).toBe('en');

      window.history.pushState({}, '', '/de/calculator');
      expect(getInitialLanguageFromBrowser()).toBe('de');

      window.history.pushState({}, '', '/');
    });
  });

  describe('All 8 Language Homepages & Direct URL Access', () => {
    it.each(SUPPORTED_LANGS)(
      'renders homepage directly for language "%s" with self-referencing canonical, hreflang cluster, and localized metadata',
      async (lang) => {
        localStorage.setItem('i18nextLng', lang === 'en' ? 'id' : 'en');
        const entry = buildLocalizedPath('/', lang);
        renderAppAt([entry]);

        await waitFor(() => {
          expect(document.documentElement.lang).toBe(lang);
          expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
            'href',
            `${BASE_URL}${entry}`
          );
        });

        expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
        expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
          'content',
          'index, follow'
        );

        const alternates = Array.from(
          document.head.querySelectorAll('link[rel="alternate"][hreflang]')
        );
        expect(alternates).toHaveLength(9);
        const altMap = Object.fromEntries(
          alternates.map((el) => [el.getAttribute('hreflang'), el.getAttribute('href')])
        );
        expect(altMap['x-default']).toBe(`${BASE_URL}/`);
        SUPPORTED_LANGS.forEach((code) => {
          expect(altMap[code]).toBe(`${BASE_URL}${buildLocalizedPath('/', code)}`);
        });

        const faqSchema = document.querySelector('script[data-seo-managed="page-schema"]');
        expect(faqSchema).not.toBeNull();
        expect(JSON.parse(faqSchema.textContent).inLanguage).toBe(lang);

        // Internal nav & footer links remain scoped to the active locale
        const linkHrefs = screen.getAllByRole('link').map((el) => el.getAttribute('href'));
        expect(linkHrefs).toContain(buildLocalizedPath('/about', lang));
        expect(linkHrefs).toContain(buildLocalizedPath('/faq', lang));
        expect(linkHrefs).toContain(buildLocalizedPath('/tiktok-cpm-calculator', lang));
        expect(linkHrefs).toContain(buildLocalizedPath('/tiktok-engagement-calculator', lang));
      }
    );
  });

  describe('All Existing Public Routes in Every Supported Language', () => {
    const routeCases = SUPPORTED_LANGS.flatMap((lang) =>
      PUBLIC_PAGE_PATHS.map((basePath) => ({
        lang,
        basePath,
        url: buildLocalizedPath(basePath, lang),
      }))
    );

    it.each(routeCases)(
      'renders $url ($lang / $basePath) with exact canonical, robots, and hreflang directives',
      async ({ lang, basePath, url }) => {
        renderAppAt([url]);

        await waitFor(() => {
          expect(document.documentElement.lang).toBe(lang);
          expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
            'href',
            `${BASE_URL}${url}`
          );
          expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        });

        const robotsContent = document
          .querySelector('meta[name="robots"]')
          ?.getAttribute('content');
        const altNodes = document.head.querySelectorAll('link[rel="alternate"][hreflang]');

        if (basePath === '/calculator') {
          expect(robotsContent).toBe('noindex, follow');
          expect(altNodes).toHaveLength(0);
        } else {
          expect(robotsContent).toBe('index, follow');
          expect(altNodes).toHaveLength(9);
          expect(
            document.head.querySelector('link[rel="alternate"][hreflang="x-default"]')
          ).toHaveAttribute('href', `${BASE_URL}${buildLocalizedPath(basePath, 'en')}`);
        }
      },
      15000
    );

    it('normalizes missing trailing slashes on localized homepages (/id -> /id/) and extra slashes on subpages (/de/about/ -> /de/about)', async () => {
      renderAppAt(['/id']);
      await waitFor(() => {
        expect(document.documentElement.lang).toBe('id');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${BASE_URL}/id/`
        );
      });

      renderAppAt(['/de/about/']);
      await waitFor(() => {
        expect(document.documentElement.lang).toBe('de');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${BASE_URL}/de/about`
        );
      });
    });
  });

  describe('Language Switcher, Back/Forward Navigation & Unknown Routes', () => {
    it('preserves the current route across language switches and handles Back/Forward navigation cleanly', async () => {
      const { go } = renderAppAt(['/about']);

      await waitFor(() => {
        expect(document.documentElement.lang).toBe('en');
        expect(document.title).toContain('About KalkulatorTik');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${BASE_URL}/about`
        );
      });

      // Open switcher in navbar desktop view and switch to Deutsch -> /de/about
      const trigger = screen.getAllByRole('button', { name: /Language/i })[0];
      fireEvent.click(trigger);
      const deOption = screen.getByRole('option', { name: /Deutsch/i });
      await act(async () => {
        fireEvent.click(deOption);
      });

      await waitFor(() => {
        expect(document.documentElement.lang).toBe('de');
        expect(document.title).toContain('Über KalkulatorTik');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${BASE_URL}/de/about`
        );
      });

      // Switch again to Español -> /es/about
      const triggerEs = screen.getAllByRole('button', { name: /Sprache/i })[0];
      fireEvent.click(triggerEs);
      const esOption = screen.getByRole('option', { name: /Español/i });
      await act(async () => {
        fireEvent.click(esOption);
      });

      await waitFor(() => {
        expect(document.documentElement.lang).toBe('es');
        expect(document.title).toContain('Sobre KalkulatorTik');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${BASE_URL}/es/about`
        );
      });

      // Browser Back -> /de/about
      await go(-1);
      await waitFor(() => {
        expect(document.documentElement.lang).toBe('de');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${BASE_URL}/de/about`
        );
      });

      // Browser Forward -> /es/about
      await go(1);
      await waitFor(() => {
        expect(document.documentElement.lang).toBe('es');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${BASE_URL}/es/about`
        );
      });
    });

    it('renders clean noindex 404 without stale canonical/hreflang tags and uses safe homepage fallback when switching languages on unknown routes', async () => {
      // First load /de/ to verify 404 clears prior SEO canonical + hreflang + FAQ schema
      const { go } = renderAppAt(['/de/']);
      await waitFor(() => {
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${BASE_URL}/de/`
        );
        expect(document.head.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(9);
      });

      await go('/de/unknown-page-404');
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Page not found/i })).toBeInTheDocument();
      });

      expect(document.documentElement.lang).toBe('de');
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow'
      );
      expect(document.querySelector('link[rel="canonical"]')).toBeNull();
      expect(document.head.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(0);
      expect(document.querySelector('script[data-seo-managed="page-schema"]')).toBeNull();

      // Switch language on unknown 404 page -> safe fallback to /fr/
      const trigger = screen.getAllByRole('button', { name: /Sprache/i })[0];
      fireEvent.click(trigger);
      const frOption = screen.getByRole('option', { name: /Français/i });
      await act(async () => {
        fireEvent.click(frOption);
      });

      await waitFor(() => {
        expect(document.documentElement.lang).toBe('fr');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${BASE_URL}/fr/`
        );
        expect(
          screen.getByRole('heading', { level: 1, name: /^Calculateur d'Argent TikTok$/i })
        ).toBeInTheDocument();
      });
    });

    it('treats /en/ and unsupported prefixes like /jp/ as unknown noindex 404 routes', async () => {
      renderAppAt(['/en/']);
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Page not found/i })).toBeInTheDocument();
        expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
          'content',
          'noindex, nofollow'
        );
        expect(document.querySelector('link[rel="canonical"]')).toBeNull();
      });

      renderAppAt(['/jp/about']);
      await waitFor(() => {
        expect(screen.getAllByRole('heading', { level: 1, name: /Page not found/i }).length).toBeGreaterThanOrEqual(1);
        expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
          'content',
          'noindex, nofollow'
        );
      });
    });
  });

  describe('Sitemap Validity', () => {
    it('contains all 64 indexable localized URLs with reciprocal hreflang alternates and excludes noindex /calculator', () => {
      const sitemapPath = path.resolve(__dirname, '../../public/sitemap.xml');
      const xmlContent = fs.readFileSync(sitemapPath, 'utf8');

      expect(xmlContent).toBe(generateSitemapXml());

      const locs = Array.from(xmlContent.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);
      expect(locs).toHaveLength(INDEXABLE_PAGE_PATHS.length * SUPPORTED_LANGS.length);
      expect(new Set(locs).size).toBe(locs.length);

      // Must NOT include noindex /calculator pages
      expect(locs.some((u) => u.endsWith('/calculator'))).toBe(false);

      // Verify all 8 language homepages and localized equivalents
      LANGUAGES.forEach(({ code }) => {
        expect(locs).toContain(`${BASE_URL}${buildLocalizedPath('/', code)}`);
        expect(locs).toContain(`${BASE_URL}${buildLocalizedPath('/about', code)}`);
        expect(locs).toContain(`${BASE_URL}${buildLocalizedPath('/tiktok-cpm-calculator', code)}`);
      });

      // Every <url> block has all 8 languages + x-default
      const urlBlocks = xmlContent.split('<url>').slice(1);
      expect(urlBlocks).toHaveLength(64);
      urlBlocks.forEach((block) => {
        const links = Array.from(block.matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"/g)).map(
          (m) => m[1]
        );
        expect(links).toHaveLength(9);
        expect(links).toContain('x-default');
        SUPPORTED_LANGS.forEach((code) => expect(links).toContain(code));
      });

      // Hreflang generator never emits alternates for /calculator or unknown routes
      expect(getHreflangAlternates('/calculator')).toEqual([]);
      expect(getHreflangAlternates('/unknown-page')).toEqual([]);
    });
  });
});
