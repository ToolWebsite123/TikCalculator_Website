import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileHeader from '../components/ProfileHeader';
import StatsGrid from '../components/StatsGrid';
import EarningsCard from '../components/EarningsCard';
import { fetchTikTokProfile, clearTikTokCache } from '../utils/api';
import {
  extractAuthoritativeEarningsData,
  hasPublicProfileSignal,
} from '../utils/earningsMapper';
import useSEO from '../utils/useSEO';

const LoadingSkeleton = () => (
  <div
    role="status"
    aria-live="polite"
    className="grid gap-4 sm:grid-cols-2"
  >
    {Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="h-28 animate-pulse rounded-2xl bg-slate-100"
      />
    ))}
  </div>
);

const hasPublicProfileData = (profileData) => {
  if (!profileData || profileData.success === false) {
    return false;
  }
  return hasPublicProfileSignal(profileData.profile);
};

const resolveJoinedAt = (profileData) =>
  profileData?.profile?.joinedAt ||
  profileData?.profile?.joined_at ||
  profileData?.profile?.createTime ||
  profileData?.joinedAt ||
  null;

const Calculator = () => {
  const { t } = useTranslation();

  useSEO({
    title: t('seo.calculator.title', 'TikTok Earnings Calculator – Calculate Estimated TikTok Income'),
    description: t(
      'seo.calculator.description',
      'Estimate your TikTok earnings with our free calculator. Analyze views, engagement, and potential revenue.'
    ),
    canonicalPath: '/calculator',
    robots: 'noindex, follow',
  });

  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortControllerRef = useRef(null);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const runProfileLookup = async ({ cleanUsername, forceRefresh = false }) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    abortControllerRef.current = controller;
    const requestId = ++requestSeqRef.current;

    setLoading(true);
    setError('');
    setResult(null);
    setEarningsData(null);

    try {
      if (forceRefresh) {
        await clearTikTokCache(cleanUsername);
      }

      const profileData = await fetchTikTokProfile(
        cleanUsername,
        forceRefresh ? { refresh: 'true' } : {},
        controller ? { signal: controller.signal } : {}
      );

      if (requestSeqRef.current !== requestId) {
        return;
      }

      if (!hasPublicProfileData(profileData)) {
        throw new Error(
          t('home.errorNotFound', {
            username: cleanUsername,
            defaultValue: `Unable to find public data for "@${cleanUsername}". Please verify the spelling and confirm that the account is set to public.`,
          })
        );
      }

      const backendEarnings = extractAuthoritativeEarningsData(profileData);
      if (!backendEarnings) {
        throw new Error(
          t(
            'home.errorFetch',
            'Unable to retrieve profile data right now. Please check your connection and try again shortly.'
          )
        );
      }

      const normalizedProfile = {
        ...profileData.profile,
        username: (profileData.profile.username || '').trim() || cleanUsername,
        joinedAt: resolveJoinedAt(profileData),
      };

      setResult({
        ...profileData,
        profile: normalizedProfile,
      });
      setEarningsData(backendEarnings);
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
            err?.response?.data?.message ||
            err?.message ||
            t(
              'home.errorFetch',
              'Unable to retrieve profile data right now. Please check your connection and try again shortly.'
            )
        );
      }

      setResult(null);
      setEarningsData(null);
    } finally {
      if (requestSeqRef.current === requestId) {
        setLoading(false);
      }
    }
  };

  const getValidatedUsername = () => {
    const cleanUsername = username.trim().replace(/^@/, '');

    if (!cleanUsername) {
      setError(
        t('home.error', 'Please enter a valid public TikTok username to run a calculation.')
      );
      return null;
    }

    if (/\s/.test(cleanUsername)) {
      setError(
        t(
          'home.errorSpaces',
          'Usernames cannot contain spaces. Please check the handle and try again.'
        )
      );
      return null;
    }

    return cleanUsername;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUsername = getValidatedUsername();
    if (!cleanUsername) return;
    await runProfileLookup({ cleanUsername, forceRefresh: false });
  };

  const handleRefresh = async () => {
    const cleanUsername = getValidatedUsername();
    if (!cleanUsername) return;
    await runProfileLookup({ cleanUsername, forceRefresh: true });
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      {/* Input Form */}
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-teal-700">TikTok Earnings Calculator</p>
          <h1 className="text-3xl font-bold text-slate-900">Enter a TikTok Username for Live Estimates</h1>
          <p className="text-sm text-slate-600">
            We fetch public profile data to estimate average views, engagement rates, and earnings benchmarks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="username">
            TikTok username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="off"
            placeholder="@username (e.g., mrbeast)"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
            disabled={loading}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-teal-800 active:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Loading...' : 'Calculate'}
          </button>
        </form>

        <p className="text-xs text-slate-600">
          Estimates only. Data fetched from public TikTok pages. If a profile is private we&apos;ll let you know.
        </p>

        {error && (
          <div role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Results */}
      {result && !loading && result.profile && (
        <div className="space-y-6">
          {result.profile && typeof result.profile === 'object' ? (
            <ProfileHeader profile={result.profile} />
          ) : (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-red-700">
              <p className="font-semibold">Error: Invalid profile data</p>
              <p className="text-sm">Profile object is missing or invalid</p>
            </div>
          )}

          <StatsGrid
            stats={{
              followers: result.profile.followers,
              following: result.profile.following,
              likes: result.profile.likes,
              videos: result.profile.videos,
              avgViews: earningsData?.avgViews ?? result.analytics?.avgViews ?? 0,
              engagementRate: earningsData?.engagementRate ?? result.analytics?.engagementRate ?? 0,
            }}
          />

          {earningsData && <EarningsCard earningsData={earningsData} isLoading={loading} />}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 active:bg-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span aria-hidden="true">🔄</span>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      )}

      {result && !loading && !result.profile && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <p>No profile data available. Please try again.</p>
        </div>
      )}
    </section>
  );
};

export default Calculator;