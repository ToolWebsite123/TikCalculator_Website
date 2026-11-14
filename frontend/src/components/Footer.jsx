import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-8 sm:py-10 md:py-12 transition-colors">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 mb-8 sm:mb-10 justify-items-center sm:justify-items-center">
          {/* Quick Links */}
          <div className="space-y-4 text-center sm:text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200"
                >
                  {t('footer.tiktokMoneyCalculator')}
                </Link>
              </li>
              <li>
                <Link
                  to="/tiktok-cpm-calculator"
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200"
                >
                  {t('footer.tiktokCpmCalculator')}
                </Link>
              </li>
              <li>
                <Link
                  to="/tiktok-engagement-calculator"
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200"
                >
                  {t('footer.tiktokEngagementCalculator')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4 text-center sm:text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5">
              {t('footer.information')}
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200"
                >
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200"
                >
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200"
                >
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block hover:translate-x-1 transform duration-200"
                >
                  {t('footer.termsAndConditions')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-6 sm:my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <a href="https://www.kalkulatortik.com/" className="hover:underline transition-colors">
              {t('footer.copyright')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

