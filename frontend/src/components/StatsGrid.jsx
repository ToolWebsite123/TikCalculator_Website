import React from 'react';
import { useTranslation } from 'react-i18next';

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
const Stat = ({ label, value, helpText, featured = false }) => (
  <div
    className={`rounded-xl border bg-white p-3.5 shadow-sm sm:p-4 transition-colors ${
      featured
        ? 'border-slate-200 border-t-2 border-t-teal-600'
        : 'border-slate-200'
    }`}
  >
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
      {label}
    </p>
    <p
      className={`mt-1.5 tabular-nums text-lg font-bold tracking-tight sm:text-xl md:text-2xl ${
        featured ? 'text-teal-700' : 'text-slate-900'
      }`}
    >
      {value}
    </p>
    {helpText && (
      <p className="mt-1 text-[11px] text-slate-600">
        {helpText}
      </p>
    )}
  </div>
);

/**
 * StatsGrid Component
 * Displays profile statistics in a responsive grid
 * Shows: Followers, Following, Likes, Videos
 */
const StatsGrid = ({ stats }) => {
  const { t } = useTranslation();

  if (!stats || typeof stats !== 'object') {
    return null;
  }

  // Extract and validate values
  const followers = Number(stats.followers) || 0;
  const following = Number(stats.following) || 0;
  const likes = Number(stats.likes) || 0;
  const videos = Number(stats.videos) || 0;
  const avgViews = Number(stats.avgViews) || 0;
  const engagementRate = Number(stats.engagementRate) || 0;

  const hasExtraMetrics = avgViews > 0 || engagementRate > 0;

  return (
    <div 
      className={`grid w-full gap-3 sm:gap-4 ${
        hasExtraMetrics 
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' 
          : 'grid-cols-2 sm:grid-cols-4'
      }`}
      role="region"
      aria-label={t('home.statsAriaLabel', 'Profile statistics')}
    >
      <Stat 
        label={t('home.statFollowers', 'Followers')} 
        value={formatNumber(followers)} 
        helpText={t('home.statFollowersHelp', 'Audience reach')}
      />
      <Stat 
        label={t('home.statLikes', 'Total Likes')} 
        value={formatNumber(likes)} 
        helpText={t('home.statLikesHelp', 'Lifetime likes')}
      />
      <Stat 
        label={t('home.statVideos', 'Total Videos')} 
        value={formatNumber(videos)} 
        helpText={t('home.statVideosHelp', 'Uploaded videos')}
      />
      <Stat 
        label={t('home.statFollowing', 'Following')} 
        value={formatNumber(following)} 
        helpText={t('home.statFollowingHelp', 'Accounts followed')}
      />
      {avgViews > 0 && (
        <Stat 
          label={t('home.statAvgViews', 'Est. Avg Views')} 
          value={formatNumber(avgViews)} 
          helpText={t('home.statAvgViewsHelp', 'Views per video')}
          featured
        />
      )}
      {engagementRate > 0 && (
        <Stat 
          label={t('home.statEngagement', 'Engagement')} 
          value={`${engagementRate.toFixed(2)}%`} 
          helpText={t('home.statEngagementHelp', 'Interaction rate')}
          featured
        />
      )}
    </div>
  );
};

export default StatsGrid;
