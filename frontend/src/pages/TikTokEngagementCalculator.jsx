import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TikTokEngagementCalculator = () => {
  const { t } = useTranslation();
  const [totalLikes, setTotalLikes] = useState('');
  const [totalVideos, setTotalVideos] = useState('');
  const [totalFollowers, setTotalFollowers] = useState('');
  const [engagementRate, setEngagementRate] = useState(null);
  const [error, setError] = useState('');

  // Parse number with K, M, B suffixes, but mimic TikCalculator behavior:
  // they effectively strip the suffix without scaling (so "1.2B" -> 1.2, "1.23M" -> 1.23).
  const parseNumber = (value) => {
    if (!value) return null;

    // Trim whitespace and convert to uppercase
    const trimmed = String(value).trim().toUpperCase();

    if (!trimmed) return null;

    // Remove commas and spaces
    let cleaned = trimmed.replace(/[, ]/g, '');

    // Check for K, M, B suffixes (case-insensitive) — strip suffix, no scaling
    if (cleaned.endsWith('B') || cleaned.endsWith('M') || cleaned.endsWith('K')) {
      cleaned = cleaned.slice(0, -1);
    }

    const num = parseFloat(cleaned);
    if (isNaN(num) || num < 0) return null;
    return num;
  };

  // Calculate Engagement Rate - TikCalculator.com exact formula
  // Formula: Engagement Rate = ((Total Likes / Total Followers) / Total Videos) * 100
  const calculateEngagementRate = (likes, followers, videos) => {
    // Step 1: (Total Likes / Total Followers)
    const step1 = likes / followers;

    // Step 2: ((Total Likes / Total Followers) / Total Videos)
    const step2 = step1 / videos;

    // Step 3: Multiply by 100 to get percentage
    const step3 = step2 * 100;

    // Round to exactly 2 decimal places
    const rounded = Number(step3.toFixed(2));

    // Ensure result is never negative
    return Math.max(rounded, 0);
  };

  // Handle Calculate button click
  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    setEngagementRate(null);

    // Check if any field is empty - return 0%
    if (!totalLikes || !totalVideos || !totalFollowers) {
      setEngagementRate(0);
      return;
    }

    // Parse inputs (handles K, M, B formats)
    const likes = parseNumber(totalLikes);
    const videos = parseNumber(totalVideos);
    const followers = parseNumber(totalFollowers);

    // If parsing fails or any value is invalid, return 0%
    if (likes === null || likes <= 0 || videos === null || videos <= 0 || followers === null || followers <= 0) {
      setEngagementRate(0);
      return;
    }

    // Calculate using TikCalculator.com exact formula
    const finalRate = calculateEngagementRate(likes, followers, videos);

    console.log('=== Engagement Rate Calculation ===');
    console.log('Input Values:');
    console.log('  Total Likes:', likes);
    console.log('  Total Followers:', followers);
    console.log('  Total Videos:', videos);
    console.log('');
    console.log('Formula: ((Total Likes / Total Followers) / Total Videos) * 100');
    console.log('');
    console.log('Step 1: (Likes / Followers)');
    console.log('  =', likes, '/', followers);
    console.log('  =', (likes / followers).toFixed(4));
    console.log('');
    console.log('Step 2: ((Likes / Followers) / Videos)');
    console.log('  =', (likes / followers).toFixed(4), '/', videos);
    console.log('  =', ((likes / followers) / videos).toFixed(6));
    console.log('');
    console.log('Step 3: Result * 100');
    console.log('  =', ((likes / followers) / videos).toFixed(6), '* 100');
    console.log('  =', (((likes / followers) / videos) * 100).toFixed(4));
    console.log('');
    console.log('Final Result (rounded to 2 decimals):', finalRate.toFixed(2) + '%');
    console.log('===================================');

    setEngagementRate(finalRate);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto max-w-3xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        {/* TikTok Logo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#000000" />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-7 md:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:text-3xl sm:mb-3 md:text-4xl lg:text-5xl">
            {t('engagementCalculator.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-white sm:text-base">
            {t('engagementCalculator.subtitle')}
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 shadow-lg mb-6 sm:rounded-2xl sm:p-6 sm:mb-8 md:p-8 transition-colors">
          <form onSubmit={handleCalculate} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Total Likes */}
            <div>
              <label htmlFor="totalLikes" className="block text-xs font-semibold text-gray-800 dark:text-white mb-1.5 sm:text-sm sm:mb-2">
                {t('engagementCalculator.totalLikes')}
              </label>
              <input
                id="totalLikes"
                type="text"
                value={totalLikes}
                onChange={(e) => setTotalLikes(e.target.value)}
                placeholder={t('engagementCalculator.placeholderLikes')}
                className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:px-4 sm:py-3 sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Total Videos */}
            <div>
              <label htmlFor="totalVideos" className="block text-xs font-semibold text-gray-800 dark:text-white mb-1.5 sm:text-sm sm:mb-2">
                {t('engagementCalculator.totalVideos')}
              </label>
              <input
                id="totalVideos"
                type="text"
                value={totalVideos}
                onChange={(e) => setTotalVideos(e.target.value)}
                placeholder={t('engagementCalculator.placeholderVideos')}
                className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:px-4 sm:py-3 sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Total Followers */}
            <div>
              <label htmlFor="totalFollowers" className="block text-xs font-semibold text-gray-800 dark:text-white mb-1.5 sm:text-sm sm:mb-2">
                {t('engagementCalculator.totalFollowers')}
              </label>
              <input
                id="totalFollowers"
                type="text"
                value={totalFollowers}
                onChange={(e) => setTotalFollowers(e.target.value)}
                placeholder={t('engagementCalculator.placeholderFollowers')}
                className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:px-4 sm:py-3 sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg sm:p-4">
                <p className="text-xs text-red-800 dark:text-red-300 sm:text-sm">{error}</p>
              </div>
            )}

            {/* Calculate Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#14b8a6] hover:bg-[#0d9488] text-white font-semibold py-2.5 px-6 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 sm:py-3 sm:px-8 sm:text-base md:w-auto"
              >
                {t('engagementCalculator.calculate')}
              </button>
            </div>
          </form>
        </div>

        {/* Engagement Rate Result */}
        {engagementRate !== null && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-5 shadow-lg sm:rounded-xl sm:p-6 md:p-8 transition-colors">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
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
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white sm:text-lg">{t('engagementCalculator.engagementRate')}</h2>
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                {engagementRate.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokEngagementCalculator;
