import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSEO from '../utils/useSEO';

const TikTokCPMCalculator = () => {
  const { t } = useTranslation();

  useSEO({
    title: 'TikTok CPM Calculator – Instantly Calculate TikTok Ads Cost & Reach',
    description: 'Calculate your TikTok CPM in seconds and find out how much you pay per 1,000 impressions. Plan smarter ads, control budgets, and boost reach.',
    canonicalPath: '/tiktok-cpm-calculator',
  });
  const [totalCost, setTotalCost] = useState('');
  const [impressions, setImpressions] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [channel, setChannel] = useState('Influencer');
  const [currency, setCurrency] = useState('USD');
  const [cpm, setCpm] = useState(null);
  const [error, setError] = useState('');

  // Industries list
  const industries = [
    { value: '', label: '(not set)' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'technology', label: 'Technology' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'education', label: 'Education' },
    { value: 'travel', label: 'Travel' },
    { value: 'finance', label: 'Finance' },
  ];

  // Countries list
  const countries = [
    { value: '', label: 'Select...' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IN', label: 'India' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'MX', label: 'Mexico' },
    { value: 'JP', label: 'Japan' },
    { value: 'KR', label: 'South Korea' },
    { value: 'CN', label: 'China' },
  ];

  // Channels list
  const channels = [
    { value: 'Influencer', label: 'Influencer' },
    { value: 'Brand', label: 'Brand' },
    { value: 'Agency', label: 'Agency' },
  ];

  // Currencies list with exchange rates (relative to USD)
  const currencies = [
    { value: 'USD', label: '$USD', symbol: '$', rate: 1 },
    { value: 'EUR', label: '€EUR', symbol: '€', rate: 0.92 },
    { value: 'GBP', label: '£GBP', symbol: '£', rate: 0.79 },
    { value: 'INR', label: '₹INR', symbol: '₹', rate: 83.12 },
    { value: 'CAD', label: '$CAD', symbol: '$', rate: 1.36 },
    { value: 'AUD', label: '$AUD', symbol: '$', rate: 1.53 },
    { value: 'PKR', label: '₨PKR', symbol: '₨', rate: 278.50 },
  ];

  // Get currency symbol
  const getCurrencySymbol = () => {
    const selectedCurrency = currencies.find((c) => c.value === currency);
    return selectedCurrency ? selectedCurrency.symbol : '$';
  };

  // Get currency exchange rate
  const getCurrencyRate = () => {
    const selectedCurrency = currencies.find((c) => c.value === currency);
    return selectedCurrency ? selectedCurrency.rate : 1;
  };

  // Convert CPM to selected currency
  const getConvertedCpm = () => {
    if (cpm === null) return null;
    return cpm * getCurrencyRate();
  };

  // Handle Calculate button click
  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    setCpm(null);

    const cost = parseFloat(totalCost);
    const impressionsCount = parseFloat(impressions);

    // Validation
    if (!totalCost || !impressions) {
      setError('Please enter both Total Cost and Number of Ad impressions.');
      return;
    }

    if (isNaN(cost) || cost <= 0) {
      setError('Total Cost must be a positive number.');
      return;
    }

    if (isNaN(impressionsCount) || impressionsCount <= 0) {
      setError('Number of Ad impressions must be a positive number.');
      return;
    }

    // Calculate CPM: CPM = (Total Cost / Ad Impressions) * 1000
    const calculatedCPM = (cost / impressionsCount) * 1000;
    setCpm(calculatedCPM);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto max-w-4xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3 sm:text-2xl sm:mb-4 md:text-3xl">
            {t('cpmCalculator.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-white max-w-2xl mx-auto sm:text-base">
            {t('cpmCalculator.subtitle')}
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 shadow-lg sm:rounded-2xl sm:p-6 md:p-8 transition-colors">
          <form onSubmit={handleCalculate} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Total Cost */}
            <div>
              <label htmlFor="totalCost" className="block text-xs font-semibold text-gray-800 dark:text-white mb-1.5 sm:text-sm sm:mb-2">
                {t('cpmCalculator.totalCost')}
              </label>
              <input
                id="totalCost"
                type="number"
                min="0"
                step="0.01"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder={t('cpmCalculator.placeholderCost')}
                className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:px-4 sm:py-3 sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Number of Ad Impressions */}
            <div>
              <label htmlFor="impressions" className="block text-xs font-semibold text-gray-800 mb-1.5 sm:text-sm sm:mb-2">
                {t('cpmCalculator.impressions')}
              </label>
              <input
                id="impressions"
                type="number"
                min="0"
                value={impressions}
                onChange={(e) => setImpressions(e.target.value)}
                placeholder={t('cpmCalculator.placeholderImpressions')}
                className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:px-4 sm:py-3 sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Industry Dropdown */}
            <div>
              <label htmlFor="industry" className="block text-xs font-semibold text-gray-800 mb-1.5 sm:text-sm sm:mb-2">
                {t('cpmCalculator.industry')}
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:px-4 sm:py-3 sm:text-base"
              >
                {industries.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Dropdown */}
            <div>
              <label htmlFor="country" className="block text-xs font-semibold text-gray-800 mb-1.5 sm:text-sm sm:mb-2">
                {t('cpmCalculator.country')}
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:px-4 sm:py-3 sm:text-base"
              >
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Channel Dropdown */}
            <div>
              <label htmlFor="channel" className="block text-xs font-semibold text-gray-800 mb-1.5 sm:text-sm sm:mb-2">
                {t('cpmCalculator.channel')}
              </label>
              <select
                id="channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:px-4 sm:py-3 sm:text-base"
              >
                {channels.map((ch) => (
                  <option key={ch.value} value={ch.value}>
                    {ch.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Dropdown */}
            <div>
              <label htmlFor="currency" className="block text-xs font-semibold text-gray-800 mb-1.5 sm:text-sm sm:mb-2">
                {t('cpmCalculator.currency')}
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 sm:px-4 sm:py-3 sm:text-base"
              >
                {currencies.map((curr) => (
                  <option key={curr.value} value={curr.value}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg sm:p-4">
                <p className="text-xs text-red-800 dark:text-red-300 sm:text-sm">{error}</p>
              </div>
            )}

            {/* Calculate Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#14b8a6] hover:bg-[#0d9488] text-white font-semibold py-2.5 px-4 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 sm:py-3 sm:px-6 sm:text-base"
            >
              {t('cpmCalculator.calculate')}
            </button>

            {/* CPM Result */}
            {cpm !== null && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-800 sm:mt-6 sm:p-6 sm:rounded-xl transition-colors">
                <div className="text-center">
                  <p className="text-[10px] font-semibold text-gray-600 dark:text-white mb-2 uppercase tracking-wider sm:text-xs sm:mb-3">
                    {t('cpmCalculator.calculatedCpm')}
                  </p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1.5 sm:text-4xl sm:mb-2 md:text-5xl">
                    {getCurrencySymbol()}
                    {getConvertedCpm().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-white sm:text-sm">
                    {t('cpmCalculator.costPerThousand')}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Content Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 space-y-8 sm:space-y-10 md:space-y-12">
          {/* What is TikTok CPM */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.whatIsTikTokCPM.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('cpmCalculator.content.whatIsTikTokCPM.description')}
            </p>
          </article>

          {/* Related Tools */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.relatedTools.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('cpmCalculator.content.relatedTools.moneyCalculator')}
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('cpmCalculator.content.relatedTools.engagementCalculator')}
            </p>
          </article>

          {/* TikTok CPM Calculator: How It Helps */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.howItHelps.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('cpmCalculator.content.howItHelps.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              <li>{t('cpmCalculator.content.howItHelps.forCreators')}</li>
              <li>{t('cpmCalculator.content.howItHelps.forBrands')}</li>
            </ul>
          </article>

          {/* How a TikTok CPM Calculator Actually Works */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.howItWorks.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('cpmCalculator.content.howItWorks.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-700 dark:text-gray-300 sm:text-lg mb-4">
              <li>{t('cpmCalculator.content.howItWorks.input1')}</li>
              <li>{t('cpmCalculator.content.howItWorks.input2')}</li>
            </ul>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('cpmCalculator.content.howItWorks.conclusion')}
            </p>
          </article>

          {/* TikTok CPM Formula Explained */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.formula.title')}
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 sm:p-6">
              <p className="text-lg font-mono text-center text-gray-900 dark:text-white sm:text-xl md:text-2xl">
                {t('cpmCalculator.content.formula.equation')}
              </p>
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('cpmCalculator.content.formula.description')}
            </p>
          </article>

          {/* Calculating TikTok CPM Step by Step */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.stepByStep.title')}
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              <li>{t('cpmCalculator.content.stepByStep.step1')}</li>
              <li>{t('cpmCalculator.content.stepByStep.step2')}</li>
              <li>{t('cpmCalculator.content.stepByStep.step3')}</li>
              <li>{t('cpmCalculator.content.stepByStep.step4')}</li>
            </ol>
            <p className="text-base text-gray-700 dark:text-gray-300 mt-4 sm:text-lg">
              {t('cpmCalculator.content.stepByStep.conclusion')}
            </p>
          </article>

          {/* What Is Considered a Low or High TikTok CPM */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.lowOrHigh.title')}
            </h2>
            <ul className="list-disc list-inside space-y-3 text-base text-gray-700 dark:text-gray-300 sm:text-lg mb-4">
              <li>{t('cpmCalculator.content.lowOrHigh.low')}</li>
              <li>{t('cpmCalculator.content.lowOrHigh.high')}</li>
            </ul>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('cpmCalculator.content.lowOrHigh.conclusion')}
            </p>
          </article>

          {/* Average TikTok CPM Rates and Benchmarks */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.averageRates.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-6 sm:text-lg">
              {t('cpmCalculator.content.averageRates.description')}
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.campaignObjective')}
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.estimatedCPM')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-700">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.brandAwareness')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.brandAwarenessCPM')}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.trafficClicks')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.trafficClicksCPM')}
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-700">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.appInstalls')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.appInstallsCPM')}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.salesConversion')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.salesConversionCPM')}
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-700">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.influencerPromotions')}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                      {t('cpmCalculator.content.averageRates.table.influencerPromotionsCPM')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300 mt-6 sm:text-lg">
              {t('cpmCalculator.content.averageRates.conclusion')}
            </p>
          </article>

          {/* TikTok CPM for Influencers, Brands, and Businesses */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.forUsers.title')}
            </h2>
            <ul className="list-disc list-inside space-y-3 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              <li>{t('cpmCalculator.content.forUsers.influencers')}</li>
              <li>{t('cpmCalculator.content.forUsers.brands')}</li>
              <li>{t('cpmCalculator.content.forUsers.businesses')}</li>
            </ul>
            <p className="text-base text-gray-700 dark:text-gray-300 mt-4 sm:text-lg">
              {t('cpmCalculator.content.forUsers.conclusion')}
            </p>
          </article>

          {/* TikTok CPM Compared to Other Social Platforms */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.comparison.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {t('cpmCalculator.content.comparison.description')}
            </p>
          </article>

          {/* Proven Ways to Improve Your TikTok CPM */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.improveCPM.title')}
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4 sm:text-lg">
              {t('cpmCalculator.content.improveCPM.intro')}
            </p>
            <ul className="list-disc list-inside space-y-3 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              <li>{t('cpmCalculator.content.improveCPM.tip1')}</li>
              <li>{t('cpmCalculator.content.improveCPM.tip2')}</li>
              <li>{t('cpmCalculator.content.improveCPM.tip3')}</li>
              <li>{t('cpmCalculator.content.improveCPM.tip4')}</li>
              <li>{t('cpmCalculator.content.improveCPM.tip5')}</li>
            </ul>
            <p className="text-base text-gray-700 dark:text-gray-300 mt-4 sm:text-lg">
              {t('cpmCalculator.content.improveCPM.conclusion')}
            </p>
          </article>

          {/* FAQs */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 sm:text-xl md:text-2xl">
              {t('cpmCalculator.content.faq.title')}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('cpmCalculator.content.faq.q1.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('cpmCalculator.content.faq.q1.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('cpmCalculator.content.faq.q2.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('cpmCalculator.content.faq.q2.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('cpmCalculator.content.faq.q3.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('cpmCalculator.content.faq.q3.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('cpmCalculator.content.faq.q4.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('cpmCalculator.content.faq.q4.answer')}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 sm:text-lg">
                  {t('cpmCalculator.content.faq.q5.question')}
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                  {t('cpmCalculator.content.faq.q5.answer')}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default TikTokCPMCalculator;
