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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        {/* TikTok Logo */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-12 h-12"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#000000" />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {t('engagementCalculator.title')}
          </h1>
          <p className="text-base text-gray-600">
            {t('engagementCalculator.subtitle')}
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-6 md:p-8 shadow-lg mb-8">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Total Likes */}
            <div>
              <label htmlFor="totalLikes" className="block text-sm font-semibold text-gray-800 mb-2">
                {t('engagementCalculator.totalLikes')}
              </label>
              <input
                id="totalLikes"
                type="text"
                value={totalLikes}
                onChange={(e) => setTotalLikes(e.target.value)}
                placeholder={t('engagementCalculator.placeholderLikes')}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Total Videos */}
            <div>
              <label htmlFor="totalVideos" className="block text-sm font-semibold text-gray-800 mb-2">
                {t('engagementCalculator.totalVideos')}
              </label>
              <input
                id="totalVideos"
                type="text"
                value={totalVideos}
                onChange={(e) => setTotalVideos(e.target.value)}
                placeholder={t('engagementCalculator.placeholderVideos')}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Total Followers */}
            <div>
              <label htmlFor="totalFollowers" className="block text-sm font-semibold text-gray-800 mb-2">
                {t('engagementCalculator.totalFollowers')}
              </label>
              <input
                id="totalFollowers"
                type="text"
                value={totalFollowers}
                onChange={(e) => setTotalFollowers(e.target.value)}
                placeholder={t('engagementCalculator.placeholderFollowers')}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Calculate Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full md:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 text-base transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('engagementCalculator.calculate')}
              </button>
            </div>
          </form>
        </div>

        {/* Engagement Rate Result */}
        {engagementRate !== null && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg
                  className="w-6 h-6 text-gray-600"
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
                <h2 className="text-lg font-semibold text-gray-800">{t('engagementCalculator.engagementRate')}</h2>
              </div>
              <p className="text-5xl md:text-6xl font-bold text-gray-900">
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
