import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import i18n from './i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { SEOProvider } from './contexts/SEOContext';
import { AppShell } from './App';
import { loadAllHomeLocalePacks } from './locales/homeContentRegistry';
import { parseLocalizedPath } from './utils/localeRouting';

import Home from './pages/Home';
import Calculator from './pages/Calculator';
import About from './pages/About';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import TikTokCPMCalculator from './pages/TikTokCPMCalculator';
import TikTokEngagementCalculator from './pages/TikTokEngagementCalculator';
import NotFound from './pages/NotFound';

import deTranslations from './locales/de/translation.json';
import esTranslations from './locales/es/translation.json';
import frTranslations from './locales/fr/translation.json';
import idTranslations from './locales/id/translation.json';
import itTranslations from './locales/it/translation.json';
import msTranslations from './locales/ms/translation.json';
import ptTranslations from './locales/pt/translation.json';

const SSR_TRANSLATIONS = {
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations,
  id: idTranslations,
  it: itTranslations,
  ms: msTranslations,
  pt: ptTranslations,
};

const EAGER_ROUTE_COMPONENTS = {
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

let resourcesPrepared = false;

export const prepareSSRResources = async () => {
  if (resourcesPrepared) return;

  await loadAllHomeLocalePacks();

  Object.entries(SSR_TRANSLATIONS).forEach(([langCode, data]) => {
    if (!i18n.hasResourceBundle(langCode, 'translation')) {
      i18n.addResourceBundle(langCode, 'translation', data, true, true);
    }
  });

  resourcesPrepared = true;
};

/**
 * Synchronously render a route URL into HTML plus collected head SEO metadata for static build output.
 */
export const renderRoute = async (url = '/') => {
  await prepareSSRResources();

  const { lang } = parseLocalizedPath(url);
  await i18n.changeLanguage(lang);

  let collectedSeo = null;
  const html = renderToString(
    <ThemeProvider>
      <SEOProvider
        onCollect={(payload) => {
          collectedSeo = payload;
        }}
      >
        <StaticRouter location={url}>
          <AppShell routeComponents={EAGER_ROUTE_COMPONENTS} />
        </StaticRouter>
      </SEOProvider>
    </ThemeProvider>
  );

  return { html, seo: collectedSeo };
};

