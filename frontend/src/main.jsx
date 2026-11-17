import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from './i18n';
import App, { preloadRouteForPath } from './App';
import { loadHomeLocalePack } from './locales/homeContentRegistry';
import { parseLocalizedPath } from './utils/localeRouting';
import './index.css';

const bootstrap = async () => {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const { lang, isKnownRoute, normalizedPath } = parseLocalizedPath(pathname);
  const ssrRoute = rootEl.getAttribute('data-ssr-route');
  const matchesStaticRoute = Boolean(ssrRoute) && ssrRoute === normalizedPath;
  const matchesWildcard404 = ssrRoute === '*' && !isKnownRoute && lang === 'en';
  const canHydrate =
    (matchesStaticRoute || matchesWildcard404) && rootEl.hasChildNodes();

  if (canHydrate) {
    // Preload active locale pack + lazy route chunk so first hydration pass matches SSR DOM synchronously
    await Promise.all([
      lang !== 'en'
        ? Promise.all([i18n.changeLanguage(lang), loadHomeLocalePack(lang)])
        : i18n.changeLanguage('en'),
      preloadRouteForPath(pathname),
    ]);

    ReactDOM.hydrateRoot(rootEl, <App />);
    return;
  }

  ReactDOM.createRoot(rootEl).render(<App />);
};

bootstrap();
