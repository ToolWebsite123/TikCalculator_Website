import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { key: 'engagementCalculator', href: '/tiktok-engagement-calculator' },
    { key: 'cpmCalculator', href: '/tiktok-cpm-calculator' },
  ];

  const toggleMenu = () => setOpen((v) => !v);

  return (
    <header className="sticky top-0 z-30 bg-[#0f2942] dark:bg-gray-900 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 md:px-6">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 min-w-0">
          <img
            src="/imgi_1_tik-tok.webp"
            alt="Tikcalculator logo"
            className="h-7 w-auto sm:h-9 md:h-10 flex-shrink-0"
            loading="lazy"
          />
          <h2 className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-[20px] text-[#fff] dark:text-white font-semibold truncate'>TikTok Money Calculator</h2>
        </Link>

        <div className="hidden items-center gap-3 lg:gap-4 text-sm font-medium text-[#fff] dark:text-white md:flex list-none">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.href}
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap"
            >
              {t(`navbar.${link.key}`)}
            </Link>
          ))}
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 dark:border-gray-600 text-[#fff] dark:text-white transition-all hover:border-white/40 dark:hover:border-gray-500 hover:bg-white/10 dark:hover:bg-gray-800 active:bg-white/20 dark:active:bg-gray-700 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <div className="relative w-5 h-5">
            <span
              className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${open
                ? 'top-2 rotate-45'
                : 'top-0'
                }`}
            />
            <span
              className={`absolute left-0 top-2 w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${open
                ? 'opacity-0 scale-0'
                : 'opacity-100 scale-100'
                }`}
            />
            <span
              className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${open
                ? 'top-2 -rotate-45'
                : 'top-4'
                }`}
            />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 dark:border-gray-700 bg-[#0f2942] dark:bg-gray-900 shadow-lg md:hidden animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-0 px-3 py-2 text-sm font-medium text-[#fff] dark:text-white list-none sm:px-4 sm:py-3">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className="rounded-lg px-3 py-2.5 transition-colors hover:bg-white/10 dark:hover:bg-gray-800 hover:text-indigo-300 dark:hover:text-indigo-400 active:bg-white/20 dark:active:bg-gray-700"
                onClick={() => setOpen(false)}
              >
                {t(`navbar.${link.key}`)}
              </Link>
            ))}
            <div className="border-t border-white/10 dark:border-gray-700 pt-3 mt-2">
              <p className="px-3 pb-2 text-xs font-semibold uppercase text-[#fff] dark:text-white opacity-70 tracking-wider">{t('navbar.language')}</p>
              <div className="px-3 pb-2">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="border-t border-white/10 dark:border-gray-700 pt-3 mt-2">
              <p className="px-3 pb-2 text-xs font-semibold uppercase text-[#fff] dark:text-white opacity-70 tracking-wider">Theme</p>
              <div className="px-3 pb-2">
                <ThemeSwitcher />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
