import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import LocaleLink from './LocaleLink';
import { useActiveLang } from '../contexts/LocaleContext';
import { buildLocalizedPath } from '../utils/localeRouting';

const Navbar = () => {
  const { t } = useTranslation();
  const activeLang = useActiveLang();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const homePath = buildLocalizedPath('/', activeLang);

  const navLinks = [
    { key: 'engagementCalculator', href: '/tiktok-engagement-calculator' },
    { key: 'cpmCalculator', href: '/tiktok-cpm-calculator' },
  ];

  const toggleMenu = () => setOpen((v) => !v);

  // Logo click: navigate cleanly within the active language SPA root and scroll to top
  const handleLogoClick = (e) => {
    e.preventDefault();
    setOpen(false);
    navigate(homePath);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0B1120] dark:bg-slate-950 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a
          href={homePath}
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 flex-shrink-0 min-w-0 cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="h-8 w-8 flex-shrink-0"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="8" fill="#0D9488" />
            <rect
              x="0.75"
              y="0.75"
              width="30.5"
              height="30.5"
              rx="7.25"
              stroke="#5EEAD4"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
            <rect x="7.5" y="17" width="4" height="7.5" rx="1.5" fill="#FFFFFF" fillOpacity="0.65" />
            <rect x="14" y="12.5" width="4" height="12" rx="1.5" fill="#FFFFFF" fillOpacity="0.85" />
            <rect x="20.5" y="7.5" width="4" height="17" rx="1.5" fill="#FFFFFF" />
          </svg>
          <span className="text-base sm:text-[17px] text-white font-bold tracking-tight truncate">
            Kalkulator<span className="text-teal-400">Tik</span>
          </span>
        </a>

        <nav
          aria-label={t('navbar.navAriaLabel', 'Primary navigation')}
          className="hidden items-center gap-5 lg:flex"
        >
          {navLinks.map((link) => {
            const localizedHref = buildLocalizedPath(link.href, activeLang);
            const isActive = location.pathname === localizedHref;
            return (
              <LocaleLink
                key={link.key}
                to={link.href}
                className={`text-sm font-medium whitespace-nowrap transition-colors rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                  isActive
                    ? 'text-teal-300 bg-white/5'
                    : 'text-slate-200 hover:text-teal-300'
                }`}
              >
                {t(`navbar.${link.key}`)}
              </LocaleLink>
            );
          })}
          <div className="h-4 w-px bg-slate-800" aria-hidden="true" />
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </nav>

        <button
          type="button"
          onClick={toggleMenu}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/60 text-white transition-colors hover:border-teal-500/60 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 lg:hidden"
          aria-label={open ? t('navbar.closeMenu', 'Close menu') : t('navbar.openMenu', 'Open menu')}
          aria-expanded={open}
        >
          <div className="relative w-5 h-4">
            <span
              className={`absolute left-0 w-full h-0.5 bg-current rounded-full transition-all duration-200 ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 w-full h-0.5 bg-current rounded-full transition-all duration-200 ${
                open ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`}
            />
            <span
              className={`absolute left-0 w-full h-0.5 bg-current rounded-full transition-all duration-200 ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-800 bg-[#0B1120] dark:bg-slate-950 shadow-xl lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav
            aria-label={t('navbar.mobileNavAriaLabel', 'Mobile navigation')}
            className="mx-auto flex max-w-6xl flex-col px-4 py-3 text-sm font-medium text-slate-200 sm:px-6"
          >
            {navLinks.map((link) => {
              const localizedHref = buildLocalizedPath(link.href, activeLang);
              const isActive = location.pathname === localizedHref;
              return (
                <LocaleLink
                  key={link.key}
                  to={link.href}
                  className={`rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 font-semibold'
                      : 'hover:bg-white/5 hover:text-teal-300'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t(`navbar.${link.key}`)}
                </LocaleLink>
              );
            })}
            <div className="border-t border-slate-800 pt-3 mt-3 px-3 pb-2">
              <p className="pb-1.5 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                {t('navbar.language')}
              </p>
              <LanguageSwitcher onLanguageChange={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
