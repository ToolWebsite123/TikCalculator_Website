import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { key: 'engagementCalculator', href: '/tiktok-engagement-calculator' },
    { key: 'cpmCalculator', href: '/tiktok-cpm-calculator' },
    { key: 'aboutUs', href: '/about' },
  ];

  const toggleMenu = () => setOpen((v) => !v);

  return (
    <header className="sticky top-0 z-30 bg-[#1B3C53] shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 md:px-6">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
          <img
            src="/imgi_1_tik-tok.webp"
            alt="Tikcalculator logo"
            className="h-8 w-auto sm:h-10"
            loading="lazy"
          />
          <h2 className='text-base text-[#fff] font-semibold sm:text-lg md:text-[20px]'>TikTok Money Calculator</h2>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-[#fff] md:flex list-none">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.href}
              className="transition hover:text-indigo-600"
            >
              {t(`navbar.${link.key}`)}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-[#fff] transition hover:border-indigo-200 hover:text-indigo-600 sm:h-10 sm:w-10 md:hidden"
          aria-label="Toggle navigation"
        >
          <span className={`block h-0.5 w-5 bg-current transition ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-current transition ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-current transition ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-[#1B3C53] shadow-sm md:hidden">
          <nav className="flex flex-col space-y-1 px-3 py-2.5 text-sm font-medium text-[#fff] list-none sm:px-4 sm:py-3">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className="rounded-lg px-3 py-2 transition hover:bg-gray-50 hover:text-indigo-600"
                onClick={() => setOpen(false)}
              >
                {t(`navbar.${link.key}`)}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2">
              <p className="px-3 pb-1 text-xs uppercase text-[#fff]">{t('navbar.language')}</p>
              <div className="px-3">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
