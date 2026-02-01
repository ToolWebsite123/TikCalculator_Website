import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TikTokCPMCalculator = () => {
  const { t } = useTranslation();
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:text-3xl sm:mb-4 md:text-4xl lg:text-5xl">
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
      </div>
    </div>
  );
};

export default TikTokCPMCalculator;
