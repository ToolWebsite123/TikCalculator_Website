import React from 'react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Main Contact Section */}
      <section className="container mx-auto max-w-3xl px-3 py-12 text-center sm:px-4 sm:py-16 md:px-6 md:py-20">
        <div className="space-y-4">
          {/* Rocket Icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              {/* Rocket Body - Red/Orange gradient */}
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Rocket body */}
                <path
                  d="M50 20 L35 80 L50 75 L65 80 Z"
                  fill="url(#rocketGradient)"
                />
                {/* Rocket window */}
                <circle cx="50" cy="45" r="8" fill="#3B82F6" />
                {/* Rocket fins */}
                <path d="M35 80 L25 85 L35 85 Z" fill="#F97316" />
                <path d="M65 80 L75 85 L65 85 Z" fill="#F97316" />
                {/* Rocket flame */}
                <path d="M50 75 L45 90 L50 88 L55 90 Z" fill="#FBBF24" />
                <path d="M50 75 L48 85 L50 83 L52 85 Z" fill="#F59E0B" />
                <defs>
                  <linearGradient id="rocketGradient" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:text-3xl sm:mb-5 md:text-4xl md:mb-6 lg:text-5xl">
            {t('contact.title')}
          </h1>

          {/* Email with Icon */}
          <div className="flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-white sm:flex-row sm:gap-3">
            <svg
              className="w-5 h-5 text-gray-600 dark:text-white sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <a
              href={`mailto:${t('contact.email')}`}
              className="text-sm text-gray-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition break-all sm:text-base md:text-lg"
            >
              {t('contact.email')}
            </a>
          </div>
        </div>
      </section>

    </div>
);
};

export default Contact;
