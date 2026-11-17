import React, { useState } from 'react';
import Link from '../components/LocaleLink';
import { useTranslation } from 'react-i18next';
import useSEO from '../utils/useSEO';
import parseMetricNumber from '../utils/parseMetricNumber';
import { useActiveLang } from '../contexts/LocaleContext';
import { BASE_URL, buildLocalizedPath } from '../utils/localeRouting';

// Calculate Engagement Rate - Follower-based formula
// Formula: Engagement Rate = ((Total Likes / Total Followers) / Total Videos) * 100
export const calculateEngagementRate = (likes, followers, videos) => {
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

export const validateAndCalculateEngagement = ({ totalLikes, totalVideos, totalFollowers }) => {
  const likesRaw = String(totalLikes || '').trim();
  const videosRaw = String(totalVideos || '').trim();
  const followersRaw = String(totalFollowers || '').trim();

  // Check if any field is empty
  if (!likesRaw || !videosRaw || !followersRaw) {
    return {
      error: 'Please fill in all fields (Total Likes, Total Videos, Total Followers).',
      errorKey: 'errorRequired',
      rate: null,
    };
  }

  // Parse inputs using strict metric scaling (handles K, M, B formats)
  const likes = parseMetricNumber(likesRaw);
  const videos = parseMetricNumber(videosRaw);
  const followers = parseMetricNumber(followersRaw);

  // If parsing fails or any value is invalid
  if (likes === null || videos === null || followers === null) {
    return {
      error: 'Please enter valid numbers (e.g. 50000, 10K, 1.5M).',
      errorKey: 'errorInvalid',
      rate: null,
    };
  }

  // Validate video and follower constraints
  if (videos <= 0) {
    return {
      error: 'Number of videos must be greater than zero.',
      errorKey: 'errorZeroVideos',
      rate: null,
    };
  }

  if (followers <= 0) {
    return {
      error: 'Number of followers must be greater than zero.',
      errorKey: 'errorZeroFollowers',
      rate: null,
    };
  }

  // If likes is 0, rate is mathematically 0%
  if (likes === 0) {
    return {
      error: null,
      errorKey: null,
      rate: 0,
    };
  }

  const finalRate = calculateEngagementRate(likes, followers, videos);
  return {
    error: null,
    errorKey: null,
    rate: finalRate,
  };
};

const SECTION_ICONS = {
  info: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  ),
  steps: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  ),
  calculator: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  ),
  compare: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
    />
  ),
  chart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  ),
  sliders: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  ),
  cta: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
    />
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  ),
  faq: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  ),
};

const SectionHeader = ({ id, icon, title, description, noDivider = false }) => (
  <div className={noDivider ? '' : 'border-b border-slate-100 pb-5'}>
    <div className="flex items-center gap-3.5">
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm"
        aria-hidden="true"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {SECTION_ICONS[icon]}
        </svg>
      </span>
      <h2 id={id} className="font-display text-xl font-bold tracking-tight text-teal-800 sm:text-2xl">
        {title}
      </h2>
    </div>
    {description && (
      <p className="mt-3.5 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
    )}
  </div>
);

const splitLabelAndBody = (text) => {
  if (typeof text !== 'string') return { label: '', body: '' };
  const colonIdx = text.indexOf(':');
  if (colonIdx > 0 && colonIdx < 80) {
    return {
      label: text.slice(0, colonIdx).trim(),
      body: text.slice(colonIdx + 1).trim(),
    };
  }
  return { label: '', body: text };
};

const stripTrailingColon = (text) => String(text || '').replace(/[:：]\s*$/, '');

const TikTokEngagementCalculator = () => {
  const { t } = useTranslation();
  const activeLang = useActiveLang();

  const toArray = (value) => (Array.isArray(value) ? value : []);
  const faqItems = toArray(
    t('engagementCalculator.content.faq.items', { returnObjects: true })
  );

  const localizedFaqSchema =
    faqItems && faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          inLanguage: activeLang,
          '@id': `${BASE_URL}${buildLocalizedPath('/tiktok-engagement-calculator', activeLang)}#faq`,
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  useSEO({
    title: t('seo.engagementCalculator.title', 'TikTok Engagement Rate Calculator | KalkulatorTik'),
    description: t(
      'seo.engagementCalculator.description',
      'Calculate your TikTok engagement rate instantly using likes, followers, and video count. Analyze performance and improve strategy with KalkulatorTik.'
    ),
    canonicalPath: '/tiktok-engagement-calculator',
    structuredData: localizedFaqSchema,
  });
  const [totalLikes, setTotalLikes] = useState('');
  const [totalVideos, setTotalVideos] = useState('');
  const [totalFollowers, setTotalFollowers] = useState('');
  const [engagementRate, setEngagementRate] = useState(null);
  const [submittedInputs, setSubmittedInputs] = useState(null);
  const [error, setError] = useState('');
  const [openFaqIndices, setOpenFaqIndices] = useState({ 0: true });

  const whyPoints = toArray(
    t('engagementCalculator.content.whyCalculate.points', { returnObjects: true })
  );
  const formulaSteps = toArray(
    t('engagementCalculator.content.howToCalculate.steps', { returnObjects: true })
  );
  const comparisonMethods = toArray(
    t('engagementCalculator.content.followersVsViews.methods', { returnObjects: true })
  );
  const interpretationPoints = toArray(
    t('engagementCalculator.content.howToUnderstand.points', { returnObjects: true })
  );
  const tableHeaders = toArray(
    t('engagementCalculator.content.goodRate.tableHeaders', { returnObjects: true })
  );
  const tableRows = toArray(
    t('engagementCalculator.content.goodRate.tableRows', { returnObjects: true })
  );
  const factorItems = toArray(
    t('engagementCalculator.content.factors.items', { returnObjects: true })
  );
  const improveTips = toArray(
    t('engagementCalculator.content.improve.tips', { returnObjects: true })
  );

  const toggleFaq = (idx) => {
    setOpenFaqIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Handle Calculate button click
  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    setEngagementRate(null);
    setSubmittedInputs(null);

    const result = validateAndCalculateEngagement({ totalLikes, totalVideos, totalFollowers });
    if (result.error) {
      const translationKey = result.errorKey ? `engagementCalculator.${result.errorKey}` : 'engagementCalculator.error';
      setError(t(translationKey, result.error));
      return;
    }

    setEngagementRate(result.rate);
    setSubmittedInputs({
      likes: String(totalLikes).trim(),
      videos: String(totalVideos).trim(),
      followers: String(totalFollowers).trim(),
    });
  };

  const inputClass =
    'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm font-medium text-slate-900 tabular-nums outline-none transition-colors hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10 sm:text-base placeholder:text-slate-400';

  return (
    <div className="w-full">
      {/* =====================================================================
          HERO & ENGAGEMENT CALCULATOR WORKBENCH (MATCHES HOMEPAGE SYSTEM)
         ===================================================================== */}
      <section
        aria-labelledby="hero-heading"
        className="w-full border-b border-slate-200 bg-analytics-grid bg-slate-50/70"
      >
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <header className="mx-auto max-w-2xl text-center">
            <h1
              id="hero-heading"
              className="font-display text-3xl font-extrabold tracking-tight text-teal-800 sm:text-5xl lg:text-[52px] lg:leading-[1.08]"
            >
              {t('engagementCalculator.title')}
            </h1>

            <p className="mx-auto mt-3.5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {t('engagementCalculator.subtitle')}
            </p>
          </header>

          {/* Elevated Workbench Card */}
          <div id="calculator-input-section" className="mx-auto mt-8 max-w-3xl">
            <form onSubmit={handleCalculate}>
              <div
                className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-[0_18px_45px_-15px_rgba(15,23,42,0.1)] transition-colors ${
                  error
                    ? 'border-red-500 ring-2 ring-red-500/15'
                    : engagementRate !== null && !error
                    ? 'border-teal-500/70 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-500/10'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-500/10'
                }`}
              >
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  {/* Total Likes */}
                  <div>
                    <label htmlFor="totalLikes" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      {t('engagementCalculator.totalLikes')}
                    </label>
                    <input
                      id="totalLikes"
                      type="text"
                      value={totalLikes}
                      onChange={(e) => {
                        setTotalLikes(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={t('engagementCalculator.placeholderLikes')}
                      className={inputClass}
                    />
                  </div>

                  {/* Total Videos */}
                  <div>
                    <label htmlFor="totalVideos" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      {t('engagementCalculator.totalVideos')}
                    </label>
                    <input
                      id="totalVideos"
                      type="text"
                      value={totalVideos}
                      onChange={(e) => {
                        setTotalVideos(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={t('engagementCalculator.placeholderVideos')}
                      className={inputClass}
                    />
                  </div>

                  {/* Total Followers */}
                  <div>
                    <label htmlFor="totalFollowers" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      {t('engagementCalculator.totalFollowers')}
                    </label>
                    <input
                      id="totalFollowers"
                      type="text"
                      value={totalFollowers}
                      onChange={(e) => {
                        setTotalFollowers(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={t('engagementCalculator.placeholderFollowers')}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
                    <span>{t('home.assuranceFree', 'Free & no login required')}</span>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-teal-700 px-7 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-teal-800 active:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 sm:h-12 sm:w-auto sm:text-[15px] whitespace-nowrap"
                  >
                    {t('engagementCalculator.calculate')}
                  </button>
                </div>
              </div>
            </form>

            {/* Error Alert Strip */}
            {error && (
              <div
                role="alert"
                className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs font-medium text-red-700 sm:text-sm"
              >
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          ENGAGEMENT RATE RESULT CARD (MATCHES HOMEPAGE EARNINGS CARD)
         ===================================================================== */}
      {engagementRate !== null && (
        <section
          aria-live="polite"
          className="w-full border-b border-slate-200 bg-slate-50"
        >
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="rounded-xl border border-slate-200 border-t-4 border-t-teal-600 bg-white p-5 shadow-sm sm:p-6 md:p-7">
              <div className="mb-3 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800">
                  <svg
                    className="h-3.5 w-3.5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  {t('engagementCalculator.engagementRate')}
                </span>
              </div>

              <div className="mb-5 text-center">
                <p className="tabular-nums text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-[52px]">
                  {engagementRate.toFixed(2)}%
                </p>
              </div>

              {submittedInputs && (
                <div className="mx-auto grid max-w-2xl grid-cols-1 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/80 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  <div className="p-2.5 sm:p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      {stripTrailingColon(t('engagementCalculator.totalLikes'))}
                    </p>
                    <p className="mt-0.5 tabular-nums text-xs font-bold text-slate-900 sm:text-sm">
                      {submittedInputs.likes}
                    </p>
                  </div>
                  <div className="p-2.5 sm:p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      {stripTrailingColon(t('engagementCalculator.totalVideos'))}
                    </p>
                    <p className="mt-0.5 tabular-nums text-xs font-bold text-slate-900 sm:text-sm">
                      {submittedInputs.videos}
                    </p>
                  </div>
                  <div className="p-2.5 sm:p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      {stripTrailingColon(t('engagementCalculator.totalFollowers'))}
                    </p>
                    <p className="mt-0.5 tabular-nums text-xs font-bold text-slate-900 sm:text-sm">
                      {submittedInputs.followers}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTIONS 1 THROUGH 10 — CONNECTED HOMEPAGE CARD SECTIONS
         ===================================================================== */}
      <div className="w-full bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
          {/* 1. What Is TikTok Engagement Rate? */}
          <section
            id="what-is-engagement-rate"
            aria-labelledby="eng-section-1"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-1"
              icon="info"
              title={t('engagementCalculator.content.whatIs.title')}
              description={t('engagementCalculator.content.whatIs.p1')}
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              <p>{t('engagementCalculator.content.whatIs.p2')}</p>
              <p>{t('engagementCalculator.content.whatIs.p3')}</p>
            </div>
          </section>

          {/* 2. Why Should You Calculate Your TikTok Engagement Rate? */}
          <section
            id="why-calculate-engagement"
            aria-labelledby="eng-section-2"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-2"
              icon="steps"
              title={t('engagementCalculator.content.whyCalculate.title')}
              description={t('engagementCalculator.content.whyCalculate.intro')}
            />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {whyPoints.map((point, idx) => {
                const { label, body } = splitLabelAndBody(point);
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5"
                  >
                    <span className="inline-flex h-6 items-center rounded bg-teal-700 px-2 font-mono text-[11px] font-bold text-white">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {label ? (
                      <>
                        <p className="mt-3 font-display text-sm font-bold text-slate-800 sm:text-base">
                          {label}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                          {body}
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {point}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. How to Calculate TikTok Engagement Rate */}
          <section
            id="how-to-calculate"
            aria-labelledby="eng-section-3"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-3"
              icon="calculator"
              title={t('engagementCalculator.content.howToCalculate.title')}
              description={t('engagementCalculator.content.howToCalculate.formulaIntro')}
            />

            {/* Formula Box */}
            <div className="mt-6 rounded-xl border border-slate-200/90 bg-slate-50/80 p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <h3 className="font-display text-lg font-bold text-slate-800 sm:text-xl lg:max-w-xs">
                  {t('engagementCalculator.content.howToCalculate.formulaTitle')}
                </h3>
                <div className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-6">
                  <p className="text-center font-mono text-sm font-bold text-teal-800 sm:text-base md:text-lg">
                    {t('engagementCalculator.content.howToCalculate.formula')}
                  </p>
                </div>
              </div>
            </div>

            {/* Scope / Methodology Note */}
            <div className="mt-4 rounded-lg border border-amber-200/80 border-l-4 border-l-amber-500 bg-amber-50/70 px-4 py-3">
              <p className="text-xs leading-relaxed text-amber-950 sm:text-sm">
                {t('engagementCalculator.content.howToCalculate.formulaNote')}
              </p>
            </div>

            {/* Where to Find Numbers (Right Before Worked Example) */}
            <div className="mt-7 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6">
              <h3 className="font-display text-base font-bold text-slate-800 sm:text-lg">
                {t('engagementCalculator.content.howToCalculate.findMetricsTitle')}
              </h3>
              <div className="mt-2.5 space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                <p>{t('engagementCalculator.content.howToCalculate.findMetricsP1')}</p>
                <p>{t('engagementCalculator.content.howToCalculate.findMetricsP2')}</p>
              </div>
            </div>

            {/* Step-by-Step Worked Example */}
            <div className="mt-7">
              <h3 className="font-display text-lg font-bold text-slate-800 sm:text-xl">
                {t('engagementCalculator.content.howToCalculate.stepsTitle')}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                {t('engagementCalculator.content.howToCalculate.stepsIntro')}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                {formulaSteps.map((step, idx) => {
                  const { label, body } = splitLabelAndBody(step);
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5"
                    >
                      <span className="inline-flex h-6 items-center rounded bg-teal-700 px-2 font-mono text-[11px] font-bold text-white">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {label ? (
                        <>
                          <p className="mt-3 font-display text-sm font-bold text-slate-800">
                            {label}
                          </p>
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                            {body}
                          </p>
                        </>
                      ) : (
                        <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                          {step}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-teal-200/80 bg-teal-50/35 px-4 py-3.5">
                <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                  {t('engagementCalculator.content.howToCalculate.singleVideoTip')}
                </p>
              </div>
            </div>
          </section>

          {/* 4. How to Understand Your TikTok Engagement Rate */}
          <section
            id="understand-engagement-rate"
            aria-labelledby="eng-section-4"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-4"
              icon="chart"
              title={t('engagementCalculator.content.howToUnderstand.title')}
              description={t('engagementCalculator.content.howToUnderstand.intro')}
            />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {interpretationPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/90 border-l-4 border-l-teal-600 bg-slate-50/50 p-5"
                >
                  <p className="font-display text-sm font-bold text-slate-900 sm:text-base">
                    {stripTrailingColon(item.label)}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. TikTok Engagement Rate by Followers vs. Views */}
          <section
            id="followers-vs-views"
            aria-labelledby="eng-section-5"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-5"
              icon="compare"
              title={t('engagementCalculator.content.followersVsViews.title')}
              description={t('engagementCalculator.content.followersVsViews.intro')}
            />

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {comparisonMethods.map((method, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col justify-between rounded-xl border p-5 sm:p-6 ${
                    idx === 0
                      ? 'border-teal-200/90 bg-teal-50/25'
                      : 'border-slate-200/90 bg-slate-50/70'
                  }`}
                >
                  <div>
                    <span
                      className={`inline-flex h-6 items-center rounded px-2 font-mono text-[11px] font-bold ${
                        idx === 0 ? 'bg-teal-700 text-white' : 'bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-display text-base font-bold text-slate-800 sm:text-lg">
                      {method.name}
                    </h3>
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                      <p className="font-mono text-xs font-semibold text-teal-800">
                        {method.formula}
                      </p>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {method.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3.5">
              <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                {t('engagementCalculator.content.followersVsViews.summary')}
              </p>
            </div>
          </section>

          {/* 6. What Is a Good TikTok Engagement Rate? */}
          <section
            id="good-engagement-rate"
            aria-labelledby="eng-section-6"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-6"
              icon="chart"
              title={t('engagementCalculator.content.goodRate.title')}
              description={t('engagementCalculator.content.goodRate.p1')}
            />

            <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
              {t('engagementCalculator.content.goodRate.p2')}
            </p>

            <div className="mt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 sm:text-xl">
                {t('engagementCalculator.content.goodRate.scaleTitle')}
              </h3>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {tableHeaders.map((header, idx) => (
                        <th key={idx} scope="col" className="px-4 py-3 font-semibold text-slate-900">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {tableRows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="transition-colors hover:bg-slate-50/70">
                        {toArray(row).map((cell, cellIdx) =>
                          cellIdx === 0 ? (
                            <th
                              key={cellIdx}
                              scope="row"
                              className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900"
                            >
                              {cell}
                            </th>
                          ) : (
                            <td key={cellIdx} className="px-4 py-3 text-slate-600">
                              {cell}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6">
              <h3 className="font-display text-lg font-bold text-slate-800 sm:text-xl">
                {t('engagementCalculator.content.goodRate.industryTitle')}
              </h3>
              <div className="mt-2.5 space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                <p>{t('engagementCalculator.content.goodRate.industryP1')}</p>
                <p>{t('engagementCalculator.content.goodRate.industryP2')}</p>
              </div>
            </div>
          </section>

          {/* 7. What Factors Affect TikTok Engagement Rate? */}
          <section
            id="engagement-factors"
            aria-labelledby="eng-section-7"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-7"
              icon="sliders"
              title={t('engagementCalculator.content.factors.title')}
              description={t('engagementCalculator.content.factors.intro')}
            />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {factorItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white font-mono text-[11px] font-bold text-teal-700">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="font-display text-sm font-bold text-slate-800 sm:text-base">
                      {stripTrailingColon(item.label)}
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 8. How to Improve Your TikTok Engagement Rate */}
          <section
            id="improve-engagement-rate"
            aria-labelledby="eng-section-8"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-8"
              icon="cta"
              title={t('engagementCalculator.content.improve.title')}
              description={t('engagementCalculator.content.improve.intro')}
            />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {improveTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-teal-700 font-mono text-[11px] font-bold text-white">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="font-display text-sm font-bold text-slate-800 sm:text-base">
                      {stripTrailingColon(tip.label)}
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-teal-200/80 bg-teal-50/35 px-4 py-3.5">
              <p className="text-xs font-medium leading-relaxed text-teal-950 sm:text-sm">
                {t('engagementCalculator.content.improve.conclusion')}
              </p>
            </div>
          </section>

          {/* 9. How Brands Use TikTok Engagement Rate to Evaluate Creators */}
          <section
            id="brands-and-creators"
            aria-labelledby="eng-section-9"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-9"
              icon="users"
              title={t('engagementCalculator.content.brandsAndCreators.title')}
            />

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col justify-between rounded-xl border border-teal-200/90 bg-teal-50/25 p-5 sm:p-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-800 sm:text-xl">
                    {t('engagementCalculator.content.brandsAndCreators.brandsTitle')}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {t('engagementCalculator.content.brandsAndCreators.brandsP1')}
                  </p>
                </div>
                <p className="mt-4 border-t border-teal-200/60 pt-3.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                  {t('engagementCalculator.content.brandsAndCreators.brandsCtaPrefix')}
                  <Link
                    to="/tiktok-cpm-calculator"
                    className="rounded font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    {t('engagementCalculator.content.brandsAndCreators.brandsCtaLink')}
                  </Link>
                  {t('engagementCalculator.content.brandsAndCreators.brandsCtaSuffix')}
                </p>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 p-5 sm:p-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-800 sm:text-xl">
                    {t('engagementCalculator.content.brandsAndCreators.creatorsTitle')}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {t('engagementCalculator.content.brandsAndCreators.creatorsP1')}
                  </p>
                </div>
                <p className="mt-4 border-t border-slate-200/80 pt-3.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                  {t('engagementCalculator.content.brandsAndCreators.creatorsCtaPrefix')}
                  <Link
                    to="/"
                    className="rounded font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    {t('engagementCalculator.content.brandsAndCreators.creatorsCtaLink')}
                  </Link>
                  {t('engagementCalculator.content.brandsAndCreators.creatorsCtaSuffix')}
                </p>
              </div>
            </div>
          </section>

          {/* 10. Frequently Asked Questions */}
          <section
            id="engagement-faq"
            aria-labelledby="eng-section-10"
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <SectionHeader
              id="eng-section-10"
              icon="faq"
              title={t('engagementCalculator.content.faq.title')}
              noDivider
            />

            <div className="mt-6 space-y-3">
              {faqItems.map((faqItem, idx) => {
                const isOpen = Boolean(openFaqIndices[idx]);
                const panelId = `eng-faq-${idx}-panel`;
                return (
                  <article
                    key={idx}
                    className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/60 transition-colors hover:border-slate-300"
                  >
                    <h3 className="m-0 font-display text-sm font-bold text-slate-900 sm:text-base">
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm font-bold text-slate-900 transition-colors hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:px-6 sm:py-[18px] sm:text-base"
                      >
                        <span>{faqItem.question}</span>
                        <span
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors group-hover:border-slate-300 group-hover:text-slate-700"
                          aria-hidden="true"
                        >
                          <svg
                            className={`h-3.5 w-3.5 transform transition-transform duration-200 motion-reduce:transition-none ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      hidden={!isOpen}
                      className={`border-t border-slate-200/70 px-5 pb-5 pt-3.5 sm:px-6 ${
                        isOpen ? 'block' : 'hidden'
                      }`}
                    >
                      <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {faqItem.answer}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TikTokEngagementCalculator;
