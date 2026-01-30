import React from 'react';

/**
 * Format large numbers with K/M/B suffixes
 * Returns '0' for invalid values (more user-friendly than dash)
 */
const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const num = Number(value);

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return '0';
  }

  if (Math.abs(num) >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (Math.abs(num) >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }

  return num.toLocaleString();
};

/**
 * Individual Stat Card Component
 */
const Stat = ({ label, value, helpText }) => (
  <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:rounded-2xl sm:p-4">
    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
      {label}
    </p>
    <p className="mt-1.5 text-lg font-semibold text-slate-900 sm:mt-2 sm:text-xl md:text-2xl">
      {value}
    </p>
    {helpText && (
      <p className="mt-1 text-[9px] text-slate-400 sm:text-[10px]">{helpText}</p>
    )}
  </div>
);

/**
 * StatsGrid Component
 * Displays profile statistics in a responsive grid
 * Shows: Followers, Following, Likes, Videos
 */
const StatsGrid = ({ stats }) => {
  if (!stats || typeof stats !== 'object') {
    return null;
  }

  // Extract and validate values
  const followers = Number(stats.followers) || 0;
  const following = Number(stats.following) || 0;
  const likes = Number(stats.likes) || 0;
  const videos = Number(stats.videos) || 0;

  return (
    <div 
      className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      role="region"
      aria-label="Profile statistics"
    >
      <Stat 
        label="Followers" 
        value={formatNumber(followers)} 
        helpText="Total followers"
      />
      <Stat 
        label="Following" 
        value={formatNumber(following)} 
        helpText="Accounts followed"
      />
      <Stat 
        label="Total Likes" 
        value={formatNumber(likes)} 
        helpText="Likes received"
      />
      <Stat 
        label="Videos" 
        value={formatNumber(videos)} 
        helpText="Videos posted"
      />
    </div>
  );
};

export default StatsGrid;
