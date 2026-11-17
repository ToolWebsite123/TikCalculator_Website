import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
        <div className="animate-pulse">
          <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto sm:h-16 sm:w-48"></div>
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
    <div className="w-full h-full flex flex-col justify-center rounded-xl border border-slate-200 dark:border-slate-800 border-t-4 border-t-teal-600 dark:border-t-teal-500 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6 md:p-7 transition-colors">
      {/* Header Label */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-200 dark:border-teal-800/80 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
          <svg
            className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400"
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
          {t('home.earningsBadge', 'ESTIMATED SPONSORSHIP VALUE PER VIDEO')}
        </span>
      </div>

      {/* Main Earnings Display */}
      <div className="text-center mb-4">
        <p
          className="tabular-nums text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl lg:text-[42px]"
          aria-label={t('home.earningsAriaLabel', {
            amount: formatCurrency(earnings),
            defaultValue: `Estimated TikTok earnings: ${formatCurrency(earnings)}`,
          })}
        >
          {formatCurrency(earnings)}
        </p>
      </div>

      {/* Benchmark Metric Grid */}
      <div className="grid grid-cols-2 divide-x divide-slate-200 max-w-md mx-auto w-full rounded-lg border border-slate-200 bg-slate-50/80 text-center">
        <div className="p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
            {t('home.estimatedRange', 'Estimated Range')}
          </p>
          <p className="tabular-nums text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
            {rangeLabel || formatCurrency(earnings)}
          </p>
        </div>
        <div className="p-2.5 sm:p-3">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
            {t('home.cpmBenchmark', 'CPM Benchmark')}
          </p>
          <p className="tabular-nums text-xs sm:text-sm font-bold text-teal-700 mt-0.5">
            {cpmRangeLabel}
          </p>
        </div>
      </div>

      {/* Transparent Methodology Note */}
      <p className="mt-3.5 text-[11px] leading-relaxed text-slate-600 text-center max-w-sm mx-auto">
        {t(
          'home.earningsFootnote',
          'Estimated brand collaboration rate based on public audience reach. Does not represent direct platform payouts from the TikTok Creator Rewards Program.'
        )}
      </p>
    </div>
  );
};

export default EarningsCard;
