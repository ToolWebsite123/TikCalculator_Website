import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { getHomeLocalePack, loadHomeLocalePack } from './locales/homeContentRegistry';
import { NON_DEFAULT_LANGS, normalizeLang, parseLocalizedPath } from './utils/localeRouting';
import { scrollToTop } from './utils/scrollHelper';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

const lazyWithPreload = (factory) => {
  let Loaded = null;
  let preloadPromise = null;

  const load = () => {
    if (!preloadPromise) {
      preloadPromise = factory().then((mod) => {
        Loaded = mod.default || mod;
        return mod;
      });
    }
    return preloadPromise;
  };

  const LazyComp = lazy(load);
  const PreloadableComponent = (props) =>
    Loaded ? <Loaded {...props} /> : <LazyComp {...props} />;
  PreloadableComponent.preload = load;
  return PreloadableComponent;
};

// Lazy-load secondary routes on client so initial homepage bundle remains fast and compact
const Calculator = lazyWithPreload(() => import('./pages/Calculator'));
const About = lazyWithPreload(() => import('./pages/About'));
const Faq = lazyWithPreload(() => import('./pages/Faq'));
const Contact = lazyWithPreload(() => import('./pages/Contact'));
const PrivacyPolicy = lazyWithPreload(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazyWithPreload(() => import('./pages/TermsAndConditions'));
const TikTokCPMCalculator = lazyWithPreload(() => import('./pages/TikTokCPMCalculator'));
const TikTokEngagementCalculator = lazyWithPreload(() => import('./pages/TikTokEngagementCalculator'));
const NotFound = lazyWithPreload(() => import('./pages/NotFound'));

const CLIENT_SECONDARY_ROUTES = [
  { path: 'calculator', key: 'Calculator', Component: Calculator },
  { path: 'about', key: 'About', Component: About },
  { path: 'faq', key: 'Faq', Component: Faq },
  { path: 'contact', key: 'Contact', Component: Contact },
  { path: 'privacy', key: 'PrivacyPolicy', Component: PrivacyPolicy },
  { path: 'terms', key: 'TermsAndConditions', Component: TermsAndConditions },
  { path: 'tiktok-cpm-calculator', key: 'TikTokCPMCalculator', Component: TikTokCPMCalculator },
  {
    path: 'tiktok-engagement-calculator',
    key: 'TikTokEngagementCalculator',
    Component: TikTokEngagementCalculator,
  },
];

/**
 * Preload the matching lazy route module before client hydration on prerendered subpages.
 */
export const preloadRouteForPath = async (pathname = '/') => {
  const { basePath, isKnownRoute } = parseLocalizedPath(pathname);
  if (!isKnownRoute) {
    if (typeof NotFound.preload === 'function') {
      await NotFound.preload();
    }
    return;
  }

  const matched = CLIENT_SECONDARY_ROUTES.find(({ path }) => `/${path}` === basePath);
  if (matched && typeof matched.Component.preload === 'function') {
    await matched.Component.preload();
  }
};

export const RouteFallback = () => (
  <div
    role="status"
    aria-live="polite"
    className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center px-4 py-16"
  >
    <div className="h-8 w-8 animate-spin motion-reduce:animate-none rounded-full border-2 border-slate-200 border-t-teal-600" />
    <span className="sr-only">Loading page...</span>
  </div>
);

const isLangReadyInMemory = (i18n, lang) => {
  const active = normalizeLang(i18n.resolvedLanguage || i18n.language);
  if (active !== lang || !i18n.hasResourceBundle(lang, 'translation')) {
    return false;
  }
  return lang === 'en' || Boolean(getHomeLocalePack(lang));
};

export const AppRoutes = ({ routeComponents = null }) => {
  const HomeComp = routeComponents?.Home || Home;
  const NotFoundComp = routeComponents?.NotFound || NotFound;

  const secondaryDefs = CLIENT_SECONDARY_ROUTES.map(({ path, key, Component }) => ({
    path,
    Component: routeComponents?.[key] || Component,
  }));

  return (
    <Routes>
      <Route path="/" element={<HomeComp />} />
      {secondaryDefs.map(({ path, Component }) => (
        <Route key={`en-${path}`} path={`/${path}`} element={<Component />} />
      ))}

      {NON_DEFAULT_LANGS.map((lang) => (
        <Route key={lang} path={`/${lang}`}>
          <Route index element={<HomeComp />} />
          {secondaryDefs.map(({ path, Component }) => (
            <Route key={`${lang}-${path}`} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<NotFoundComp />} />
        </Route>
      ))}

      <Route path="*" element={<NotFoundComp />} />
    </Routes>
  );
};

export const AppShell = ({ routeComponents = null }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const parsed = parseLocalizedPath(location.pathname);
  const routeLang = parsed.lang;

  const [readyLang, setReadyLang] = useState(() =>
    isLangReadyInMemory(i18n, routeLang) ? routeLang : null
  );

  useEffect(() => {
    let cancelled = false;

    const syncLocale = async () => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = routeLang;
      }

      try {
        localStorage.setItem('i18nextLng', routeLang);
      } catch {
        // Ignore storage access errors
      }

      if (!isLangReadyInMemory(i18n, routeLang)) {
        if (routeLang !== 'en') {
          await Promise.all([i18n.changeLanguage(routeLang), loadHomeLocalePack(routeLang)]);
        } else {
          await i18n.changeLanguage('en');
        }
      }

      if (!cancelled) {
        setReadyLang(routeLang);
      }
    };

    syncLocale();
    return () => {
      cancelled = true;
    };
  }, [i18n, routeLang]);

  useEffect(() => {
    if (!location.hash) {
      scrollToTop(true);
    }
  }, [location.pathname]);

  // Normalize missing trailing slashes on localized homepages (/id -> /id/) and extra slashes on subpages (/de/about/ -> /de/about)
  if (parsed.isKnownRoute && location.pathname !== parsed.normalizedPath) {
    return (
      <Navigate
        to={`${parsed.normalizedPath}${location.search}${location.hash}`}
        replace
      />
    );
  }

  const canRenderRoute = readyLang === routeLang || isLangReadyInMemory(i18n, routeLang);

  return (
    <LocaleProvider lang={routeLang}>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          {t('common.skipToContent', 'Skip to main content')}
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {canRenderRoute ? (
            <Suspense fallback={<RouteFallback />}>
              <AppRoutes routeComponents={routeComponents} />
            </Suspense>
          ) : (
            <RouteFallback />
          )}
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
};

const App = () => (
  <ThemeProvider>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppShell />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
