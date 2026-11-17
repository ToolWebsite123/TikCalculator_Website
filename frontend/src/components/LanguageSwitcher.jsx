import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useActiveLang } from '../contexts/LocaleContext';
import {
  LANGUAGES,
  getLanguageSwitchTarget,
  normalizeLang,
} from '../utils/localeRouting';

const LanguageSwitcher = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();
  const activeCode = useActiveLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === activeCode) || LANGUAGES[0];

  const changeLanguage = async (langCode) => {
    const nextLang = normalizeLang(langCode);
    setIsOpen(false);
    if (typeof onLanguageChange === 'function') {
      onLanguageChange(nextLang);
    }

    try {
      localStorage.setItem('i18nextLng', nextLang);
    } catch {
      // Ignore storage access errors
    }

    const targetUrl = getLanguageSwitchTarget(
      location.pathname,
      nextLang,
      location.search,
      location.hash
    );
    const currentUrl = `${location.pathname}${location.search}${location.hash}`;

    await i18n.changeLanguage(nextLang);

    if (targetUrl !== currentUrl) {
      navigate(targetUrl);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('navbar.language', 'Language')}
        className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-slate-100 transition-colors hover:border-teal-500/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <img
          src={currentLanguage.flagSrc}
          alt=""
          width="16"
          height="16"
          decoding="async"
          aria-hidden="true"
          className="h-4 w-4 rounded-sm object-cover"
        />
        <span className="text-sm font-medium">{currentLanguage.name}</span>
        <svg
          className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t('navbar.language', 'Language')}
          className="absolute left-0 lg:left-auto lg:right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={activeCode === lang.code}
              lang={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                activeCode === lang.code
                  ? 'bg-teal-50 text-teal-900 font-semibold'
                  : 'text-slate-800 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <img
                src={lang.flagSrc}
                alt=""
                width="16"
                height="16"
                decoding="async"
                aria-hidden="true"
                className="h-4 w-4 rounded-sm object-cover"
                loading="lazy"
              />
              <span>{lang.name}</span>
              {activeCode === lang.code && (
                <svg
                  className="ml-auto h-4 w-4 text-teal-600 dark:text-teal-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
