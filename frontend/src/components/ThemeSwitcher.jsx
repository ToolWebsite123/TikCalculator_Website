import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const label =
    theme === 'light'
      ? t('theme.switchToDark', 'Switch to dark mode')
      : t('theme.switchToLight', 'Switch to light mode');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/60 p-1.5 text-slate-100 transition-colors hover:border-teal-500/60 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      aria-label={label}
      title={label}
    >
      {theme === 'light' ? (
        // Moon icon for dark mode
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeSwitcher;

