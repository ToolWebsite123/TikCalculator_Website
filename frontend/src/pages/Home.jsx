import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTikTokStats } from '../utils/api';
import {
  extractAuthoritativeEarningsData,
  hasPublicProfileSignal,
} from '../utils/earningsMapper';
import ProfileHeader from '../components/ProfileHeader';
import StatsGrid from '../components/StatsGrid';
import EarningsCard from '../components/EarningsCard';
import InfoSection, { HOME_FAQ_SCHEMA } from '../components/InfoSection';
import { useActiveLang } from '../contexts/LocaleContext';
import { useHomeLocalePack } from '../locales/homeContentRegistry';
import { BASE_URL, buildLocalizedPath } from '../utils/localeRouting';
import useSEO from '../utils/useSEO';

const HOME_SEO_TITLE = 'TikTok Money Calculator – Estimate Your TikTok Earnings';
const HOME_SEO_DESCRIPTION =
  'Estimate your TikTok earnings using our free TikTok Money Calculator. Explore potential income from views, followers, engagement, and sponsored posts.';

const Home = () => {
  const { t } = useTranslation();
  const activeLang = useActiveLang();
  const localePack = useHomeLocalePack(activeLang);
  const activeTitle = localePack?.seo?.title || HOME_SEO_TITLE;
  const activeDescription = localePack?.seo?.description || HOME_SEO_DESCRIPTION;
  const baseFaqSchema = localePack?.faqSchema || HOME_FAQ_SCHEMA;
  const localizedFaqSchema = {
    ...baseFaqSchema,
    inLanguage: activeLang,
    '@id': `${BASE_URL}${buildLocalizedPath('/', activeLang)}#faq`,
  };

  useSEO({
    title: activeTitle,
    description: activeDescription,
    canonicalPath: '/',
    robots: 'index, follow',
    ogTitle: activeTitle,
    ogDescription: activeDescription,
    twitterTitle: activeTitle,
    twitterDescription: activeDescription,
    structuredData: localizedFaqSchema,
  });

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [earningsData, setEarningsData] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const resultsRef = useRef(null);
  const abortControllerRef = useRef(null);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawTrimmed = username.trim().replace(/^@/, '');

    if (!rawTrimmed) {
      setError(
        t('home.error', 'Please enter a valid public TikTok username to run a calculation.')
      );
      return;
    }

    if (/\s/.test(rawTrimmed)) {
      setError(
        t(
          'home.errorSpaces',
          'Usernames cannot contain spaces. Please check the handle and try again.'
        )
      );
      return;
    }

    const cleanUsername = rawTrimmed;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    abortControllerRef.current = controller;
    const requestId = ++requestSeqRef.current;

    setError('');
    setStats(null);
    setEarningsData(null);
    setCopiedSummary(false);
    setLoading(true);

    try {
      const response = await fetchTikTokStats(
        cleanUsername,
        {},
        controller ? { signal: controller.signal } : {}
      );

      if (requestSeqRef.current !== requestId) {
        return;
      }

      // Handle response structure
      let profileData = response;
      if (response && response.profile && typeof response.profile === 'object') {
        profileData = response.profile;
      }

      if (!hasPublicProfileSignal(profileData)) {
        setError(
          t('home.errorNotFound', {
            username: cleanUsername,
            defaultValue: `Unable to find public data for "@${cleanUsername}". Please verify the spelling and confirm that the account is set to public.`,
          })
        );
        return;
      }

      const earnings = extractAuthoritativeEarningsData(response);
      if (!earnings) {
        setError(
          t(
            'home.errorFetch',
            'Unable to retrieve profile data right now. Please check your connection and try again shortly.'
          )
        );
        return;
      }

      // Extract and clean bio
      const bioFromResponse = (
        response.bio ||
        response.description ||
        response.profile?.bio ||
        response.profile?.description ||
        response.profile?.signature ||
        profileData?.bio ||
        profileData?.description ||
        profileData?.signature ||
        ''
      )
        .toString()
        .trim();

      const cleanBio = bioFromResponse
        .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
        .trim();

      // Extract joinedAt from all possible sources
      const joinedAt =
        response.profile?.joinedAt ||
        response.profile?.joined_at ||
        response.profile?.createTime ||
        profileData?.joinedAt ||
        profileData?.joined_at ||
        profileData?.createTime ||
        response.joinedAt ||
        null;

      const mergedProfile = {
        ...profileData,
        bio: cleanBio || profileData?.bio || profileData?.description || '',
        description: cleanBio || profileData?.description || profileData?.bio || '',
        joinedAt: joinedAt,
      };

      setEarningsData(earnings);
      setStats(mergedProfile);

      // Auto scroll to results
      setTimeout(() => {
        if (typeof resultsRef.current?.scrollIntoView === 'function') {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      if (
        requestSeqRef.current !== requestId ||
        err?.code === 'ERR_CANCELED' ||
        err?.name === 'CanceledError' ||
        err?.name === 'AbortError'
      ) {
        return;
      }
      const status = err?.status ?? err?.response?.status;
      if (status === 404) {
        setError(
          t('home.errorNotFound', {
            username: cleanUsername,
            defaultValue: `Unable to find public data for "@${cleanUsername}". Please verify the spelling and confirm that the account is set to public.`,
          })
        );
      } else if (status === 429) {
        setError(
          t(
            'home.errorRateLimit',
            'Requests are temporarily limited due to high traffic. Please wait a moment and try again.'
          )
        );
      } else if (err?.isNetworkError || status === 0 || (typeof status === 'number' && status >= 500)) {
        setError(
          t(
            'home.errorFetch',
            'Unable to retrieve profile data right now. Please check your connection and try again shortly.'
          )
        );
      } else {
        setError(
          err?.response?.data?.error ||
            err?.message ||
            t(
              'home.errorFetch',
              'Unable to retrieve profile data right now. Please check your connection and try again shortly.'
            )
        );
      }
    } finally {
      if (requestSeqRef.current === requestId) {
        setLoading(false);
      }
    }
  };

  // Extract profile data
  const profile = stats && stats.profile ? stats.profile : stats;
  const resolvedHandle =
    profile?.username || username.trim().replace(/^@/, '');
  const isLiveVideoSample = Number(earningsData?.analytics?.sampleSize) > 0;

  const handleCopySummary = async () => {
    if (!profile || !earningsData) return;
    const est = Number(earningsData.estimatedEarnings || earningsData.earningPerVideo || 0);
    const min = Number(earningsData.earningsMin || est);
    const max = Number(earningsData.earningsMax || est);
    const avgViews = Math.round(Number(earningsData.avgViews) || 0).toLocaleString('en-US');
    const engRate = (Number(earningsData.engagementRate) || 0).toFixed(2);
    const summaryText = `@${resolvedHandle} | Sponsorship Est: $${est.toFixed(2)} ($${min.toFixed(2)}–$${max.toFixed(2)}/video) | Avg Views: ${avgViews} | Engagement: ${engRate}% — KalkulatorTik.com`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText);
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      }
    } catch {
      // Ignore clipboard permission denials cleanly
    }
  };

  return (
    <div className="w-full">
      {/* =====================================================================
          SECTION 1 — HERO AND TIKTOK MONEY CALCULATOR WORKBENCH
         ===================================================================== */}
      <section
        aria-labelledby="hero-heading"
        className="w-full border-b border-slate-200 dark:border-slate-800 bg-analytics-grid bg-slate-50/70 dark:bg-slate-950"
      >
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          {/* Clean Hero Header */}
          <header className="mx-auto max-w-2xl text-center">
            <h1
              id="hero-heading"
              className="font-display text-3xl font-extrabold tracking-tight text-teal-800 dark:text-teal-300 sm:text-5xl lg:text-[52px] lg:leading-[1.08]"
            >
              {t('home.title', 'TikTok Money Calculator')}
            </h1>

            <p className="mx-auto mt-3.5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {t(
                'home.subtitle',
                'Enter any public TikTok username to calculate estimated brand sponsorship earnings and creator income per video.'
              )}
            </p>
          </header>

          {/* Unified Interactive Lookup Workbench */}
          <div id="calculator-input-section" className="mx-auto mt-8 max-w-2xl">
            <form
              onSubmit={handleSubmit}
              aria-label={t('home.formAriaLabel', 'TikTok money calculator username lookup form')}
            >
              <label htmlFor="tiktok-username" className="sr-only">
                {t('home.usernameLabel', 'Enter Public TikTok Username')}
              </label>

              <div
                className={`flex flex-col gap-2 rounded-2xl border bg-white dark:bg-slate-900 p-2 sm:flex-row sm:items-center shadow-[0_18px_45px_-15px_rgba(15,23,42,0.1)] dark:shadow-[0_18px_45px_-15px_rgba(0,0,0,0.45)] transition-colors ${
                  error
                    ? 'border-red-500 ring-2 ring-red-500/15'
                    : stats && !error
                    ? 'border-teal-500/70 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-500/10'
                }`}
              >
                <div className="flex flex-1 items-center border-b border-slate-100 dark:border-slate-800 pb-1.5 sm:border-b-0 sm:pb-0 px-2 sm:px-3">
                  <span
                    className="mr-2.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-sm font-semibold text-slate-600 dark:text-slate-300 select-none"
                    aria-hidden="true"
                  >
                    @
                  </span>
                  <input
                    id="tiktok-username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const value = e.target.value.replace(/^@/, '');
                      setUsername(value);
                      if (error) setError('');
                    }}
                    placeholder={t('home.placeholder', 'e.g., khaby.lame or mrbeast')}
                    aria-describedby="username-status"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-label={t('home.inputAriaLabel', 'TikTok username input')}
                    autoComplete="off"
                    className="h-12 w-full bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="inline-flex h-12 w-full sm:w-auto flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 px-6 text-sm sm:text-[15px] font-semibold text-white shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75 whitespace-nowrap cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin motion-reduce:animate-none h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>{t('home.buttonLoading', 'Analyzing Public Profile...')}</span>
                    </>
                  ) : (
                    <span>{t('home.buttonCalculate', 'Calculate Sponsorship Value')}</span>
                  )}
                </button>
              </div>
            </form>

            {/* Concise Single Status Strip */}
            <div className="mt-3.5">
              {loading && (
                <div
                  id="username-status"
                  aria-live="polite"
                  className="flex items-center justify-center gap-2 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/70 dark:bg-teal-950/40 px-4 py-2.5 text-xs font-medium text-teal-800 dark:text-teal-300"
                >
                  <span
                    className="h-2 w-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-pulse motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  {t('home.loadingStatus', 'Retrieving public profile metrics...')}
                </div>
              )}

              {error && !loading && (
                <div
                  id="username-status"
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-800/80 bg-red-50/90 dark:bg-red-950/40 px-4 py-3 text-xs sm:text-sm font-medium text-red-700 dark:text-red-300"
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

              {stats && !error && !loading && (
                <div
                  id="username-status"
                  aria-live="polite"
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400"
                >
                  <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {t('home.loadedStatus', {
                      handle: resolvedHandle,
                      defaultValue: `Loaded public metrics for @${resolvedHandle}`,
                    })}
                  </span>
                </div>
              )}

              {!stats && !error && !loading && (
                <ul
                  id="username-status"
                  aria-label={t('home.assurancesAriaLabel', 'Calculator key assurances')}
                  className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-slate-600"
                >
                  <li className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-600" aria-hidden="true" />
                    {t('home.assuranceFree', 'Free & no login required')}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-600" aria-hidden="true" />
                    {t('home.assuranceLookup', 'Public username lookup')}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-600" aria-hidden="true" />
                    {t('home.assuranceBenchmark', 'Sponsorship benchmark per video')}
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Loading Skeleton Placeholder Matching Live Dashboard Layout */}
          {loading && (
            <div
              aria-hidden="true"
              className="mx-auto mt-8 max-w-5xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-56 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
                <div className="h-56 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse motion-reduce:animate-none"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          DYNAMIC CALCULATOR RESULTS DISPLAY (WHEN A PROFILE IS LOADED)
         ===================================================================== */}
      {profile && (
        <section
          ref={resultsRef}
          aria-labelledby="live-results-heading"
          className="w-full border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80"
        >
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
                  {t('home.liveBenchmarkBadge', 'Live Profile Benchmark')}
                </span>
                <h2
                  id="live-results-heading"
                  className="mt-1 font-display text-xl font-bold tracking-tight text-teal-800 dark:text-teal-300 sm:text-2xl"
                >
                  {t('home.resultsFor', {
                    handle: resolvedHandle,
                    defaultValue: `Results for @${resolvedHandle}`,
                  })}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {isLiveVideoSample
                    ? t('home.sourceLiveVideo', 'Calculated from recent public video activity.')
                    : t(
                        'home.sourceFallback',
                        'Estimated from public profile totals (recent video view feed unavailable).'
                      )}
                </span>
                {earningsData && (
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 shadow-sm transition-colors hover:bg-teal-50 dark:hover:bg-teal-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    <span aria-hidden="true">{copiedSummary ? '✓' : '⧉'}</span>
                    {copiedSummary
                      ? t('home.copiedSummary', 'Copied!')
                      : t('home.copySummary', 'Copy summary')}
                  </button>
                )}
              </div>
            </div>

            {/* Profile + Earnings Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-5 flex w-full">
                <ProfileHeader profile={profile} />
              </div>
              <div className="lg:col-span-7 flex w-full">
                <EarningsCard earningsData={earningsData} />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {t('home.metricsHeading', 'Account Overview & Activity Benchmarks')}
                </h3>
                <a
                  href="#results-explanation"
                  className="text-xs font-medium text-teal-700 dark:text-teal-400 hover:underline"
                >
                  {t('home.howToReadLink', 'How to read these metrics ↓')}
                </a>
              </div>
              <StatsGrid
                stats={{
                  followers: profile.followers,
                  following: profile.following,
                  likes: profile.likes,
                  videos: profile.videos,
                  avgViews: earningsData?.avgViews,
                  engagementRate: earningsData?.engagementRate,
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTIONS 2 THROUGH 10 — CONNECTED ANALYTICS & METHODOLOGY JOURNEY
         ===================================================================== */}
      <InfoSection />
    </div>
  );
};

export default Home;
