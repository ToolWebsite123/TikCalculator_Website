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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('cpmCalculator.title')}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t('cpmCalculator.subtitle')}
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-6 md:p-8 shadow-lg">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Total Cost */}
            <div>
              <label htmlFor="totalCost" className="block text-sm font-semibold text-gray-800 mb-2">
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
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Number of Ad Impressions */}
            <div>
              <label htmlFor="impressions" className="block text-sm font-semibold text-gray-800 mb-2">
                {t('cpmCalculator.impressions')}
              </label>
              <input
                id="impressions"
                type="number"
                min="0"
                value={impressions}
                onChange={(e) => setImpressions(e.target.value)}
                placeholder={t('cpmCalculator.placeholderImpressions')}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Industry Dropdown */}
            <div>
              <label htmlFor="industry" className="block text-sm font-semibold text-gray-800 mb-2">
                {t('cpmCalculator.industry')}
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base text-gray-900 bg-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              <label htmlFor="country" className="block text-sm font-semibold text-gray-800 mb-2">
                {t('cpmCalculator.country')}
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base text-gray-900 bg-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              <label htmlFor="channel" className="block text-sm font-semibold text-gray-800 mb-2">
                {t('cpmCalculator.channel')}
              </label>
              <select
                id="channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base text-gray-900 bg-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              <label htmlFor="currency" className="block text-sm font-semibold text-gray-800 mb-2">
                {t('cpmCalculator.currency')}
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base text-gray-900 bg-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Calculate Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 text-base transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {t('cpmCalculator.calculate')}
            </button>

            {/* CPM Result */}
            {cpm !== null && (
              <div className="mt-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                    {t('cpmCalculator.calculatedCpm')}
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-purple-700 mb-2">
                    {getCurrencySymbol()}
                    {getConvertedCpm().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600">
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
