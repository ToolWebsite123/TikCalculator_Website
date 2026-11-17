import React from 'react';
import { useTranslation } from 'react-i18next';
import LocaleLink from './LocaleLink';

const Footer = () => {
  const { t } = useTranslation();

  const linkClass =
    'inline-block rounded-md px-1 py-0.5 text-sm sm:text-base text-slate-700 hover:text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:text-teal-700 transition-colors';

  return (
    <footer className="border-t border-slate-200 bg-white py-8 sm:py-10 md:py-12 transition-colors">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">{t('footer.navigation', 'Footer Navigation')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 mb-8 sm:mb-10 justify-items-center">
          {/* Quick Links */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-5">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <LocaleLink to="/" className={linkClass}>
                  {t('footer.tiktokMoneyCalculator')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/tiktok-cpm-calculator" className={linkClass}>
                  {t('footer.tiktokCpmCalculator')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/tiktok-engagement-calculator" className={linkClass}>
                  {t('footer.tiktokEngagementCalculator')}
                </LocaleLink>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-5">
              {t('footer.information')}
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <LocaleLink to="/about" className={linkClass}>
                  {t('footer.about')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/contact" className={linkClass}>
                  {t('footer.contactUs')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/privacy" className={linkClass}>
                  {t('footer.privacyPolicy')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/terms" className={linkClass}>
                  {t('footer.termsAndConditions')}
                </LocaleLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-slate-200 my-6 sm:my-8" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-slate-600">
            <LocaleLink
              to="/"
              className="rounded-md px-1 py-0.5 text-slate-700 hover:text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 transition-colors"
            >
              {t('footer.copyright')}
            </LocaleLink>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
