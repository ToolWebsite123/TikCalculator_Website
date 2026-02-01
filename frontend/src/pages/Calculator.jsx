import React, { useState, useEffect } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import StatsGrid from '../components/StatsGrid';
import EarningsCard from '../components/EarningsCard';
import { fetchTikTokProfile, fetchTikTokEarnings, clearTikTokCache, calculateEarningsFromViews } from '../utils/api';
import { mapEarningsData } from '../utils/earningsMapper';

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

const Calculator = () => {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  // CRITICAL: Initialize with default object instead of null to prevent undefined errors
  const [earningsData, setEarningsData] = useState({
    success: false,
    earnings: 0,
    earningPerVideo: 0,
    estimatedEarnings: 0,
    perVideoNet: 0,
    avgViews: 0,
    engagementRate: 0,
    cpm: 0,
    CPM: 0,
    platformFactor: 1.0,
    username: '',
    followers: 0,
    likes: 0,
    following: 0,
    videos: 0,
    monthlyEarning: 0,
    monthlyEarnings: 0,
    source: 'initial',
  });
  const [loading, setLoading] = useState(false);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [error, setError] = useState('');

  // CRITICAL: useEffect to calculate earnings whenever result changes
  // This ensures earningsData is ALWAYS set when profile data is available
  useEffect(() => {
    if (result && result.profile && result.success !== false) {
      // Extract avgViews from multiple possible locations
      const avgViews = Number(result.avgViews) || 
                      Number(result.analytics?.avgViews) || 
                      0;
      const engagementRate = Number(result.engagementRate) || 
                            Number(result.analytics?.engagementRate) || 
                            0;
      
      // Calculate earnings if we have data
      if (avgViews > 0 || result.profile.followers > 0) {
        const views = avgViews > 0 ? avgViews : Math.max((result.profile.followers || 0) * 0.08, 1000);
        
        // Calculate CPM
        let cpm = 1.0;
        if (views >= 5_000_000) cpm = 4.0;
        else if (views >= 1_000_000) cpm = 3.0;
        else if (views >= 500_000) cpm = 2.5;
        else if (views >= 100_000) cpm = 2.0;
        else if (views >= 10_000) cpm = 1.5;
        else cpm = 1.0;
        
        // Calculate platform factor
        const platformFactor = engagementRate > 0 
          ? Math.min(0.8 + (Math.min(engagementRate / 10, 1.0) * 0.4), 1.2)
          : 1.0;
        
        // Calculate earnings
        let earnings = 0;
        if (engagementRate > 0) {
          // Formula B: (views * engagementRate * cpm) / 1000
          earnings = (views * engagementRate * cpm) / 1000 * platformFactor;
        } else {
          // Formula A: (views / 1000) * rpm (rpm = 0.03)
          earnings = (views / 1000) * 0.03 * platformFactor;
        }
        
        const calculatedEarningsData = {
          success: true,
          earnings: Math.max(earnings, 0.01),
          earningPerVideo: Math.max(earnings, 0.01),
          estimatedEarnings: Math.max(earnings, 0.01),
          perVideoNet: Math.max(earnings, 0.01),
          avgViews: views,
          engagementRate: Math.max(engagementRate, 0),
          cpm: cpm,
          CPM: cpm,
          platformFactor: platformFactor,
          username: result.profile.username || '',
          followers: result.profile.followers || 0,
          likes: result.profile.likes || 0,
          following: result.profile.following || 0,
          videos: result.profile.videos || 0,
          monthlyEarning: Math.max(earnings * 20, 0.20),
          monthlyEarnings: Math.max(earnings * 20, 0.20),
          source: 'useEffect_calculation',
        };
        
        setEarningsData(calculatedEarningsData);
      }
    }
  }, [result]); // Recalculate whenever result changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a TikTok username');
      return;
    }

    setLoading(true);
    setEarningsLoading(true);
    setError('');
    setResult(null);
    // CRITICAL: Don't reset earningsData to null - keep previous value until new data is ready
    // This prevents the EarningsCard from showing $0.00 during loading

    try {
      // Fetch profile and earnings in parallel

      const [profileData, earningsResponse] = await Promise.all([
        fetchTikTokProfile(username.trim()).catch(err => {
          console.error('[Frontend] ❌ fetchTikTokProfile failed:', err.message);
          throw err;
        }),
        fetchTikTokEarnings(username.trim()).catch(err => {
          // CRITICAL: Return safe fallback object instead of null
          return {
            success: true,
            estimatedEarnings: 0,
            earningPerVideo: 0,
            avgViews: 0,
            engagementRate: 0,
            cpm: 0,
            platformFactor: 1.0,
            username: username.trim(),
            followers: 0,
            likes: 0,
            following: 0,
            videos: 0,
            monthlyEarning: 0,
            source: 'error',
            error: err.message || 'Failed to fetch earnings',
          };
        })
      ]);
      
      // STEP 1: Extract earningsData from API response
      // Backend returns: { success: true, profile: {...}, earningsData: {...} }
      // fetchTikTokProfile returns response.data, so profileData IS the response.data
      
      // CRITICAL: Extract earningsData from response.data.earningsData
      // Since fetchTikTokProfile returns response.data, profileData IS response.data
      const extractedEarningsData = profileData?.earningsData;
      
      if (extractedEarningsData && typeof extractedEarningsData === 'object') {
        // STEP 2: Set earningsData in state
        setEarningsData(extractedEarningsData);
      }

      if (!profileData || !profileData.success || !profileData.profile) {
        throw new Error('Invalid response from server');
      }

      if (!profileData.profile.username || profileData.profile.username.trim() === '') {
        profileData.profile.username = username.trim();
      }

      if (!profileData || !profileData.success || !profileData.profile) {
        throw new Error('Invalid response from server');
      }

      if (!profileData.profile.username || profileData.profile.username.trim() === '') {
        profileData.profile.username = username.trim();
      }

      setResult(profileData);
      
      // NOTE: earningsData was already extracted and set in state above
      // Only use fallback if earningsData wasn't found in API response
      if (!earningsData || typeof earningsData !== 'object') {
        const profile = profileData.profile || {};
        const fallbackEarningsData = {
          avgViews: 0,
          engagementRate: 5,
          cpm: 0.02,
          platformFactor: 1,
          estimatedEarnings: 0,
          earningPerVideo: 0,
        };
        setEarningsData(fallbackEarningsData);
      }
      
      // DONE: earningsData is now set from API response or fallback
      // All the duplicate logic below has been removed
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch profile';
      setError(message);
      setResult(null);

      // CRITICAL: On error, ALWAYS set earningsData (even if it's a fallback)
      // This ensures EarningsCard never receives null/undefined
      const profile = profileData?.profile || {};

      // Always create earningsData, even if profile data is missing
      const errorFallbackViews = Math.max((profile.followers || 0) * 0.08, 1000);
      let errorFallbackCPM = 0.8;
      if (errorFallbackViews >= 5_000_000) errorFallbackCPM = 3.5;
      else if (errorFallbackViews >= 1_000_000) errorFallbackCPM = 2.5;
      else if (errorFallbackViews >= 500_000) errorFallbackCPM = 1.8;
      else if (errorFallbackViews >= 100_000) errorFallbackCPM = 1.2;
      else if (errorFallbackViews >= 10_000) errorFallbackCPM = 1.0;

        const errorFallbackEarnings = (errorFallbackViews / 1000) * errorFallbackCPM;
      const errorFallbackEngagement = profile.likes > 0 && profile.followers > 0 && profile.videos > 0
        ? Math.min((profile.likes / profile.videos / profile.followers) * 100, 50)
          : 5.0;

      const errorEarningsData = {
        success: false,
        earnings: Math.max(errorFallbackEarnings, 0.01),
        earningPerVideo: Math.max(errorFallbackEarnings, 0.01),
        estimatedEarnings: Math.max(errorFallbackEarnings, 0.01),
        perVideoNet: Math.max(errorFallbackEarnings, 0.01),
          avgViews: errorFallbackViews,
          engagementRate: errorFallbackEngagement,
          cpm: errorFallbackCPM,
        CPM: errorFallbackCPM,
          platformFactor: 1.0,
        username: profile.username || username.trim(),
        followers: profile.followers || 0,
        likes: profile.likes || 0,
        following: profile.following || 0,
        videos: profile.videos || 0,
        monthlyEarning: Math.max(errorFallbackEarnings * 20, 0.20),
        monthlyEarnings: Math.max(errorFallbackEarnings * 20, 0.20),
        source: 'error_fallback',
      };

      // CRITICAL: ALWAYS call setEarningsData in error handler
      setEarningsData(errorEarningsData);
    } finally {
      // CRITICAL: Always set loading to false
      setLoading(false);
      setEarningsLoading(false);
      
    }
  };

  const handleRefresh = async () => {
    if (!username.trim()) {
      setError('Please enter a TikTok username');
      return;
    }
    setLoading(true);
    setEarningsLoading(true);
    setError('');

    try {
      await clearTikTokCache(username.trim());

      const [profileData, earningsResponse] = await Promise.all([
        fetchTikTokProfile(username.trim(), { refresh: 'true' }),
        fetchTikTokEarnings(username.trim(), { refresh: 'true' }).catch(() => null)
      ]);

      setResult(profileData);

      // Always calculate earnings - use API response if valid, otherwise calculate from profile
      const profile = profileData.profile || {};
      const analytics = profileData.analytics || {};
      const latestVideos = profileData.latestVideos || [];

      // Always use backend earnings response if available AND valid (non-zero values)
      let finalEarningsData = null;

      if (earningsResponse && earningsResponse.success) {
        // CRITICAL: Validate that backend response has valid (non-zero) values
        const hasValidEarnings = earningsResponse.estimatedEarnings > 0;
        const hasValidViews = earningsResponse.avgViews > 0;
        const hasValidCPM = earningsResponse.cpm > 0;

        if (hasValidEarnings && hasValidViews && hasValidCPM) {
          finalEarningsData = earningsResponse;
        }
      }

      // Calculate fallback if backend response not available or invalid
      if (!finalEarningsData) {

        // Calculate avgViews from latest videos (last 30)
        let avgViews = 0;
        if (latestVideos.length > 0) {
          const videosWithViews = latestVideos.filter(v => v && Number(v.views) > 0);
          if (videosWithViews.length > 0) {
            const videosToUse = videosWithViews.length > 30 ? videosWithViews.slice(-30) : videosWithViews;
            const totalViews = videosToUse.reduce((sum, v) => sum + (Number(v.views) || 0), 0);
            avgViews = totalViews / videosToUse.length;
          }
        }

        // Fallback: use followers * 0.08
        if (!avgViews || avgViews === 0) {
          avgViews = (profile.followers || 0) * 0.08;
        }

        // Ensure avgViews is never 0
        if (!avgViews || avgViews === 0) {
          avgViews = Math.max((profile.followers || 0) * 0.08, 1000);
        }

        // Calculate engagement rate
        let engagementRate = analytics.engagementRate || 0;
        if ((!engagementRate || engagementRate === 0) && latestVideos.length > 0) {
          const videosWithData = latestVideos.filter(v => v && Number(v.views) > 0);
          if (videosWithData.length > 0) {
            const totalViews = videosWithData.reduce((sum, v) => sum + (Number(v.views) || 0), 0);
            const totalEngagements = videosWithData.reduce(
              (sum, v) => sum + (Number(v.likes) || 0) + (Number(v.comments) || 0) + (Number(v.shares) || 0),
              0
            );
            if (totalViews > 0) {
              engagementRate = (totalEngagements / totalViews) * 100;
            }
          }
        }

        // Calculate CPM (exact same logic as backend)
        let calculatedCPM = 5.0;
        if (avgViews >= 10_000_000) {
          calculatedCPM = 12.0;
        } else if (avgViews >= 5_000_000) {
          calculatedCPM = 10.0;
        } else if (avgViews >= 1_000_000) {
          calculatedCPM = 8.0;
        } else if (avgViews >= 500_000) {
          calculatedCPM = 7.0;
        } else if (avgViews >= 100_000) {
          calculatedCPM = 6.0;
        }

        const platformFactor = 1.0;
        const { calculateEarning } = await import('../utils/earnings');
        const estimatedEarnings = calculateEarning(avgViews, calculatedCPM, platformFactor);
        const monthlyEarning = estimatedEarnings * 20;

        finalEarningsData = {
          success: true,
          username: profile.username || username.trim(),
          followers: profile.followers || 0,
          likes: profile.likes || 0,
          following: profile.following || 0,
          videos: profile.videos || 0,
          avgViews: Math.round(avgViews * 100) / 100,
          engagementRate: Math.round(engagementRate * 100) / 100,
          estimatedEarnings: Math.round(estimatedEarnings * 100) / 100,
          earningPerVideo: Math.round(estimatedEarnings * 100) / 100,
          monthlyEarning: Math.round(monthlyEarning * 100) / 100,
          cpm: calculatedCPM,
          platformFactor: platformFactor,
        };
      }

      // FINAL VALIDATION: Ensure all values are valid (never 0)
      if (finalEarningsData) {
        // Ensure avgViews is never 0
        if (!finalEarningsData.avgViews || finalEarningsData.avgViews <= 0) {
          finalEarningsData.avgViews = Math.max((finalEarningsData.followers || 0) * 0.08, 1000);
        }

        // Ensure engagementRate is never negative
        if (finalEarningsData.engagementRate < 0) {
          finalEarningsData.engagementRate = 5.0;
        }

        // Ensure CPM is never 0
        if (!finalEarningsData.cpm || finalEarningsData.cpm <= 0) {
          finalEarningsData.cpm = 5.0;
        }

        // Recalculate earnings if invalid
        if (!finalEarningsData.estimatedEarnings || finalEarningsData.estimatedEarnings <= 0) {
          finalEarningsData.estimatedEarnings = (finalEarningsData.avgViews / 1000) * finalEarningsData.cpm;
          finalEarningsData.earningPerVideo = finalEarningsData.estimatedEarnings;
          finalEarningsData.monthlyEarning = finalEarningsData.estimatedEarnings * 20;
        }
      } else {
        // Create default if still null
        const profile = profileData?.profile || {};
        const fallbackViews = Math.max((profile.followers || 0) * 0.08, 1000);
        const fallbackCPM = 5.0;
        const fallbackEarnings = (fallbackViews / 1000) * fallbackCPM;

        finalEarningsData = {
          success: true,
          username: profile.username || username.trim(),
          followers: profile.followers || 0,
          avgViews: fallbackViews,
          engagementRate: 5.0,
          estimatedEarnings: fallbackEarnings,
          earningPerVideo: fallbackEarnings,
          monthlyEarning: fallbackEarnings * 20,
          cpm: fallbackCPM,
          platformFactor: 1.0,
        };
      }

      // CRITICAL: Ensure finalEarningsData is NEVER null before setting
      if (!finalEarningsData) {
        const profile = profileData?.profile || {};
        const emergencyViews = Math.max((profile.followers || 0) * 0.08, 1000);
        const emergencyCPM = 5.0;
        const emergencyEarnings = (emergencyViews / 1000) * emergencyCPM;

        finalEarningsData = {
          success: true,
          username: profile.username || username.trim(),
          followers: profile.followers || 0,
          avgViews: emergencyViews,
          engagementRate: 5.0,
          estimatedEarnings: emergencyEarnings,
          earningPerVideo: emergencyEarnings,
          monthlyEarning: emergencyEarnings * 20,
          cpm: emergencyCPM,
          platformFactor: 1.0,
        };
      }

      // CRITICAL: Ensure finalEarningsData is NEVER null before setting
      if (!finalEarningsData) {
        finalEarningsData = {
          success: true,
          estimatedEarnings: 0,
          earningPerVideo: 0,
          avgViews: 0,
          engagementRate: 0,
          cpm: 0,
          platformFactor: 1.0,
          username: username.trim(),
          followers: 0,
          likes: 0,
          following: 0,
          videos: 0,
          monthlyEarning: 0,
          source: 'fallback',
        };
      }

      // ALWAYS set earningsData - guaranteed to be valid object
      setEarningsData(finalEarningsData);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to refresh profile';
      setError(message);

      // CRITICAL: Set earnings data even on error (safe fallback)
      const refreshErrorEarningsData = {
        success: false,
        earnings: 0.01,
        earningPerVideo: 0.01,
        estimatedEarnings: 0.01,
        perVideoNet: 0.01,
        avgViews: 1000,
        engagementRate: 5.0,
        cpm: 0.8,
        CPM: 0.8,
        platformFactor: 1.0,
        username: username.trim(),
        followers: 0,
        likes: 0,
        following: 0,
        videos: 0,
        monthlyEarning: 0.20,
        monthlyEarnings: 0.20,
        source: 'error',
      };
      setEarningsData(refreshErrorEarningsData);
    } finally {
      setLoading(false);
      setEarningsLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      {/* Input Form */}
      <div className="space-y-3 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-indigo-700">TikTok earnings calculator</p>
          <h2 className="text-3xl font-bold text-slate-900">Enter a username to get live estimates</h2>
          <p className="text-sm text-slate-600">
            We fetch the public profile, compute average views, engagement, and earnings.
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
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring focus:ring-indigo-100"
            disabled={loading}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-[#14b8a6] px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Loading...' : 'Calculate'}
          </button>
        </form>

        <p className="text-xs text-slate-500">
          Estimates only. Data fetched from public TikTok pages. If a profile is private we'll let you know.
        </p>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
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
          {/* Profile Header */}
          {result.profile && typeof result.profile === 'object' ? (
            <ProfileHeader profile={result.profile} />
          ) : (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-red-700">
              <p className="font-semibold">Error: Invalid profile data</p>
              <p className="text-sm">Profile object is missing or invalid</p>
            </div>
          )}

          {/* Stats Grid - Only show: Followers, Following, Likes, Videos, Avg Views, Engagement Rate */}
          <StatsGrid
            stats={{
              followers: result.profile.followers,
              following: result.profile.following,
              likes: result.profile.likes,
              videos: result.profile.videos,
              avgViews: earningsData?.avgViews || result.analytics?.avgViews || 0,
              engagementRate: earningsData?.engagementRate || result.analytics?.engagementRate || 0,
            }}
          />

          {/* Earnings Card - ALWAYS VISIBLE after search */}
          <EarningsCard
            earningsData={earningsData}
            isLoading={earningsLoading}
          />

          {/* Refresh Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span aria-hidden>🔄</span>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {result && !loading && !result.profile && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <p>No profile data available. Please try again.</p>
        </div>
      )}
    </section>
  );
};

export default Calculator;
