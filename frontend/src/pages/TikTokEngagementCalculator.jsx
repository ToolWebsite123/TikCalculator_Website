import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TikTokEngagementCalculator = () => {
  const { t } = useTranslation();

  // SEO: Update page title and meta description
  useEffect(() => {
    document.title = 'TikTok Engagement Rate Calculator (Free & Accurate Tool)';

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Calculate your TikTok engagement rate instantly using likes, comments, shares, and followers. Analyze performance and grow smarter.');

    // Update Open Graph meta tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'TikTok Engagement Rate Calculator (Free & Accurate Tool)');

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', 'Calculate your TikTok engagement rate instantly using likes, comments, shares, and followers. Analyze performance and grow smarter.');
  }, []);
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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:text-2xl sm:mb-3 md:text-3xl">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-5 shadow-lg sm:rounded-xl sm:p-6 md:p-8 transition-colors mb-6 sm:mb-8">
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

        {/* Content Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 space-y-8 sm:space-y-10 md:space-y-12">
          {/* What Is a TikTok Engagement Rate Calculator */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.whatIs.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('engagementCalculator.content.whatIs.description1')}
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('engagementCalculator.content.whatIs.description2')}
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('engagementCalculator.content.whatIs.description3')}
            </p>
          </article>

          {/* Calculate TikTok Engagement Rate – TikCalculator */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.tikCalculator.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('engagementCalculator.content.tikCalculator.description1')}
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('engagementCalculator.content.tikCalculator.description2')}
            </p>
          </article>

          {/* Related Tools */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.relatedTools.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('engagementCalculator.content.relatedTools.moneyCalculator')}
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('engagementCalculator.content.relatedTools.cpmCalculator')}
            </p>
          </article>

          {/* How to Manually Calculate */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.manualCalculation.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('engagementCalculator.content.manualCalculation.description')}
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 sm:p-6">
              <p className="text-lg font-mono text-center text-gray-900 dark:text-white sm:text-xl md:text-2xl">
                {t('engagementCalculator.content.manualCalculation.formula')}
              </p>
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('engagementCalculator.content.manualCalculation.explanation1')}
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('engagementCalculator.content.manualCalculation.explanation2')}
            </p>
          </article>

          {/* TikTok Engagement Rate Benchmarks */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.benchmarks.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-6 sm:text-lg">
              {t('engagementCalculator.content.benchmarks.description')}
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.followerRange')}
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.averageRate')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-700">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.range1')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.rate1')}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.range2')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.rate2')}
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-700">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.range3')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.rate3')}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.range4')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.rate4')}
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-700">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.range5')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.rate5')}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.range6')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('engagementCalculator.content.benchmarks.table.rate6')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300 mt-6 sm:text-lg">
              {t('engagementCalculator.content.benchmarks.conclusion')}
            </p>
          </article>

          {/* How to Use the Calculator Effectively */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.howToUse.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('engagementCalculator.content.howToUse.intro')}
            </p>
            <ul className="list-disc list-inside space-y-3 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              <li>{t('engagementCalculator.content.howToUse.tip1')}</li>
              <li>{t('engagementCalculator.content.howToUse.tip2')}</li>
              <li>{t('engagementCalculator.content.howToUse.tip3')}</li>
              <li>{t('engagementCalculator.content.howToUse.tip4')}</li>
            </ul>
            <p className="text-base text-gray-700 dark:text-gray-300 mt-4 sm:text-lg">
              {t('engagementCalculator.content.howToUse.conclusion')}
            </p>
          </article>

          {/* Why Engagement Rate Matters */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.whyMatters.title')}
            </h2>
            <ul className="list-disc list-inside space-y-3 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              <li>{t('engagementCalculator.content.whyMatters.point1')}</li>
              <li>{t('engagementCalculator.content.whyMatters.point2')}</li>
              <li>{t('engagementCalculator.content.whyMatters.point3')}</li>
              <li>{t('engagementCalculator.content.whyMatters.point4')}</li>
            </ul>
          </article>

          {/* Industry-Specific Engagement */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.industrySpecific.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('engagementCalculator.content.industrySpecific.description1')}
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('engagementCalculator.content.industrySpecific.description2')}
            </p>
          </article>

          {/* How to Improve Your TikTok Engagement Rate */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.improveEngagement.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('engagementCalculator.content.improveEngagement.intro')}
            </p>
            <ul className="list-disc list-inside space-y-3 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              <li>{t('engagementCalculator.content.improveEngagement.tip1')}</li>
              <li>{t('engagementCalculator.content.improveEngagement.tip2')}</li>
              <li>{t('engagementCalculator.content.improveEngagement.tip3')}</li>
              <li>{t('engagementCalculator.content.improveEngagement.tip4')}</li>
              <li>{t('engagementCalculator.content.improveEngagement.tip5')}</li>
              <li>{t('engagementCalculator.content.improveEngagement.tip6')}</li>
              <li>{t('engagementCalculator.content.improveEngagement.tip7')}</li>
            </ul>
            <p className="text-base text-gray-700 dark:text-gray-300 mt-4 sm:text-lg">
              {t('engagementCalculator.content.improveEngagement.conclusion')}
            </p>
          </article>

          {/* FAQs */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 sm:text-xl md:text-2xl">
              {t('engagementCalculator.content.faq.title')}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('engagementCalculator.content.faq.q1.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('engagementCalculator.content.faq.q1.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('engagementCalculator.content.faq.q2.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('engagementCalculator.content.faq.q2.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('engagementCalculator.content.faq.q3.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('engagementCalculator.content.faq.q3.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('engagementCalculator.content.faq.q4.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('engagementCalculator.content.faq.q4.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('engagementCalculator.content.faq.q5.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('engagementCalculator.content.faq.q5.answer')}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default TikTokEngagementCalculator;
