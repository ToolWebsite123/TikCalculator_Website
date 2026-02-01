import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en/translation.json';
import deTranslations from './locales/de/translation.json';
import esTranslations from './locales/es/translation.json';
import frTranslations from './locales/fr/translation.json';
import itTranslations from './locales/it/translation.json';
import ptTranslations from './locales/pt/translation.json';
import msTranslations from './locales/ms/translation.json';
import idTranslations from './locales/id/translation.json';

i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        resources: {
            en: {
                translation: enTranslations,
            },
            de: {
                translation: deTranslations,
            },
            es: {
                translation: esTranslations,
            },
            fr: {
                translation: frTranslations,
            },
            it: {
                translation: itTranslations,
            },
            pt: {
                translation: ptTranslations,
            },
            ms: {
                translation: msTranslations,
            },
            id: {
                translation: idTranslations,
            },
        },
        lng: localStorage.getItem('i18nextLng') || 'en', // Default language
        fallbackLng: 'en', // Fallback language if translation is missing
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
    });

export default i18n;

