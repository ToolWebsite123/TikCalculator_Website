import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en/translation.json';
import { loadHomeLocalePack, resolveLangCode } from './locales/homeContentRegistry';
import { getInitialLanguageFromBrowser } from './utils/localeRouting';

const TRANSLATION_LOADERS = {
  de: () => import('./locales/de/translation.json'),
  es: () => import('./locales/es/translation.json'),
  fr: () => import('./locales/fr/translation.json'),
  id: () => import('./locales/id/translation.json'),
  it: () => import('./locales/it/translation.json'),
  ms: () => import('./locales/ms/translation.json'),
  pt: () => import('./locales/pt/translation.json'),
};

const lazyLocaleBackend = {
  type: 'backend',
  init() {},
  read(language, _namespace, callback) {
    const code = resolveLangCode(language);
    if (code === 'en') {
      callback(null, enTranslations);
      return;
    }

    const loader = TRANSLATION_LOADERS[code];
    if (!loader) {
      callback(null, enTranslations);
      return;
    }

    // Load translation JSON and localized homepage content pack concurrently before languageChanged fires
    Promise.all([loader(), loadHomeLocalePack(code)])
      .then(([mod]) => {
        callback(null, mod.default || mod);
      })
      .catch((err) => {
        callback(err, null);
      });
  },
};

const initialUrlLng = getInitialLanguageFromBrowser();

i18n
  .use(lazyLocaleBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
    },
    partialBundledLanguages: true,
    lng: initialUrlLng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

const syncHtmlLang = (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = resolveLangCode(lng);
  }
};

i18n.on('languageChanged', syncHtmlLang);
syncHtmlLang(i18n.resolvedLanguage || i18n.language || initialUrlLng);

export default i18n;
