import React from 'react';

/**
 * Format number as USD currency
 * Uses conservative rounding for believable estimates
 */
const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * EarningsCard Component
 * Displays estimated earnings per video with range and disclaimer
 * All values are profile-based estimates, clearly labeled as such
 */
const EarningsCard = ({ earningsData, isLoading = false }) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center rounded-xl bg-white p-5 ring-1 ring-gray-100 sm:rounded-2xl sm:p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-12 w-32 bg-gray-200 rounded-lg mx-auto sm:h-16 sm:w-48"></div>
        </div>
      </div>
    );
  }

  // No data state
  if (!earningsData || typeof earningsData !== 'object') {
    return null;
  }

  // Extract values
  const {
    estimatedEarnings,
    earningPerVideo,
    earningsMin,
    earningsMax,
    cpm,
    cpmMin,
    cpmMax,
  } = earningsData;

  // Validate and ensure numbers are valid
  const earnings = Number(estimatedEarnings) || Number(earningPerVideo) || 0;
  const safeCpm = Number(cpm) || 0;
  const safeCpmMin = Number(cpmMin) || safeCpm;
  const safeCpmMax = Number(cpmMax) || safeCpm;
  const safeEarningsMin = Number(earningsMin) || earnings;
  const safeEarningsMax = Number(earningsMax) || earnings;

  // Format range labels
  const rangeLabel =
    safeEarningsMin && safeEarningsMax && safeEarningsMin !== safeEarningsMax
      ? `${formatCurrency(safeEarningsMin)} – ${formatCurrency(safeEarningsMax)}`
      : null;
  
  const cpmRangeLabel =
    safeCpmMin && safeCpmMax && safeCpmMin !== safeCpmMax
      ? `$${safeCpmMin.toFixed(2)} – $${safeCpmMax.toFixed(2)}`
      : `$${safeCpm.toFixed(2)}`;

  return (
    <div className="w-full h-full flex flex-col justify-center rounded-xl bg-white p-5 ring-1 ring-gray-100 sm:rounded-2xl sm:p-6 md:p-8">
      {/* Header Label */}
      <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
        <svg
          className="w-4 h-4 text-indigo-600 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide sm:text-sm">
          Estimated Earnings per Video
        </p>
      </div>

      {/* Main Earnings Display */}
      <div className="text-center mb-4 sm:mb-5">
        <p 
          className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl md:text-5xl"
          aria-label={`Estimated earnings: ${formatCurrency(earnings)} per video`}
        >
          {formatCurrency(earnings)}
        </p>
        
        {/* Earnings Range */}
        {rangeLabel && (
          <p className="mt-2 text-sm text-gray-500">
            Estimated range: {rangeLabel}
          </p>
        )}
        
        {/* CPM Info */}
        <p className="mt-1.5 text-xs text-gray-400">
          Based on CPM: {cpmRangeLabel}
        </p>
      </div>

      {/* Helper Text */}
      <p className="text-[10px] text-center text-gray-500 mb-3 sm:text-xs">
        Earnings calculated using profile statistics and industry-standard CPM rates
      </p>

      {/* Disclaimer */}
      <div className="pt-3 border-t border-gray-100">
        <p className="text-[10px] text-center text-gray-400 leading-relaxed sm:text-xs">
          <span className="font-medium">Disclaimer:</span> This is a profile-based estimate only. 
          Actual TikTok earnings depend on Creator Fund eligibility, content type, audience location, 
          and brand partnerships. Results are not guaranteed.
        </p>
      </div>
    </div>
  );
};

export default EarningsCard;
