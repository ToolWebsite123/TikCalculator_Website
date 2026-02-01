import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flagSrc: 'https://flagcdn.com/gb.svg' },
    { code: 'de', name: 'Deutsch', flagSrc: 'https://flagcdn.com/de.svg' },
    { code: 'es', name: 'Español', flagSrc: 'https://flagcdn.com/es.svg' },
    { code: 'fr', name: 'Français', flagSrc: 'https://flagcdn.com/fr.svg' },
    { code: 'it', name: 'Italiano', flagSrc: 'https://flagcdn.com/it.svg' },
    { code: 'pt', name: 'Português (Brasil)', flagSrc: 'https://flagcdn.com/br.svg' },
    { code: 'ms', name: 'Malaysian', flagSrc: 'https://flagcdn.com/my.svg' },
    { code: 'id', name: 'Bahasa Indonesia', flagSrc: 'https://flagcdn.com/id.svg' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    setIsOpen(false);
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
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-[#fff] transition hover:border-white/50 hover:text-white"
      >
        <img
          src={currentLanguage.flagSrc}
          alt={currentLanguage.name}
          className="h-4 w-4 rounded-sm object-cover"
          loading="lazy"
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
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                i18n.language === lang.code
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white'
              }`}
            >
              <img
                src={lang.flagSrc}
                alt={lang.name}
                className="h-4 w-4 rounded-sm object-cover"
                loading="lazy"
              />
              <span>{lang.name}</span>
              {i18n.language === lang.code && (
                <svg
                  className="ml-auto h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
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

