import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTikTokStats } from '../utils/api';
import ProfileHeader from '../components/ProfileHeader';
import StatsGrid from '../components/StatsGrid';
import EarningsCard from '../components/EarningsCard';
import InfoSection from '../components/InfoSection';

const Home = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [earningsData, setEarningsData] = useState(null);
  const resultsRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim().replace(/^@/, '');
    
    if (!cleanUsername) {
      setError(t('home.error'));
      return;
    }
    setError('');
    setStats(null);
    setEarningsData(null);
    setLoading(true);
    
    try {
      const response = await fetchTikTokStats(cleanUsername);

      // Extract earningsData from response
      const earnings = response?.earningsData;
      setEarningsData(earnings);

      // Handle response structure
      let profileData = response;
      if (response && response.profile && typeof response.profile === 'object') {
        profileData = response.profile;
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
      ).toString().trim();

      const cleanBio = bioFromResponse.replace(/^Signature\s*\(Required\)\s*:\s*/i, '').trim();

      // ── Extract joinedAt from ALL possible sources ──
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
        // ── Always carry joinedAt forward ──
        joinedAt: joinedAt,
      };

      setStats(mergedProfile);

      // ── Auto scroll to results ──
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || t('home.errorFetch'));
    } finally {
      setLoading(false);
    }
  };

  // Extract profile data
  const profile = stats && stats.profile ? stats.profile : stats;

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
      {/* Hero Section */}
      <div className="w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-4 shadow-lg ring-1 ring-gray-100 dark:ring-gray-700 sm:rounded-3xl sm:p-6 md:p-10 transition-colors">
        <header className="space-y-2 text-center sm:space-y-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl md:text-3xl">
            {t('home.title')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-white sm:text-base max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
        </header>

        {/* Calculator Form */}
        <div className="mx-auto mt-6 w-full max-w-4xl rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-700/60 p-4 sm:mt-8 sm:rounded-2xl sm:p-6 md:p-8 transition-colors">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6"
            aria-label="TikTok earnings calculator form"
          >
            <label 
              htmlFor="tiktok-username"
              className="text-base font-semibold text-slate-800 dark:text-white text-center sm:text-lg"
            >
              {t('home.usernameLabel')}
            </label>
            
            <div className="w-full max-w-md">
              <div className="relative">
                {/* @ Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <svg 
                    className="w-5 h-5 text-[#64748b] dark:text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                </div>
                
                {/* Input Field */}
                <input
                  id="tiktok-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value.replace(/^@/, '');
                    setUsername(value);
                    if (error) setError('');
                  }}
                  placeholder={t('home.placeholder')}
                  aria-describedby="username-helper username-status"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-label="TikTok username input"
                  className={`w-full h-[50px] rounded-lg border-2 bg-white dark:bg-gray-800 pl-12 pr-4 text-base text-slate-900 dark:text-white outline-none transition-all duration-300 placeholder:text-[#94a3b8] dark:placeholder:text-gray-500 ${
                    error 
                      ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]/20' 
                      : stats && !error
                      ? 'border-[#22c55e] focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20'
                      : 'border-[#e2e8f0] dark:border-gray-600 hover:border-[#cbd5e1] dark:hover:border-gray-500 focus:border-[#14b8a6] dark:focus:border-[#14b8a6] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]'
                  }`}
                />
              </div>
              
              {/* Helper Text */}
              <p id="username-helper" className="mt-1.5 text-xs text-slate-500 dark:text-gray-400 text-center">
                Enter username without @ symbol
              </p>
              
              {/* Error/Success Message */}
              {error && (
                <p 
                  id="username-status" 
                  role="alert"
                  className="mt-1.5 text-xs text-[#ef4444] dark:text-red-400 text-center"
                >
                  {error}
                </p>
              )}
              {stats && !error && username && (
                <p 
                  id="username-status" 
                  className="mt-1.5 text-xs text-[#22c55e] dark:text-green-400 text-center"
                >
                  Profile found successfully
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full max-w-md rounded-lg bg-[#14b8a6] px-6 py-3 text-center text-base font-semibold text-white shadow-lg transition hover:bg-[#0d9488] disabled:cursor-not-allowed disabled:opacity-70 sm:py-3.5 sm:text-lg md:w-2/5 md:max-w-xs"
            >
              {loading ? t('home.buttonLoading') : t('home.buttonCalculate')}
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {profile && (
        <div ref={resultsRef} className="mt-6 flex w-full flex-col gap-4 sm:mt-8 sm:gap-5 md:mt-10 md:gap-6">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white sm:text-xl">
              Profile-Based Earnings Estimate
            </h2>
            <p className="text-xs text-slate-500 dark:text-white mt-1 sm:text-sm">
              Results based on publicly available profile data
            </p>
          </div>

          {/* Profile + Earnings - Side by Side */}
          <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
            <div className="flex-1 flex w-full max-h-80">
              <ProfileHeader profile={profile} />
            </div>
            <div className="flex-1 flex w-full max-h-80">
              <EarningsCard earningsData={earningsData} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="w-full">
            <h3 className="text-sm font-medium text-slate-600 dark:text-white mb-3 sm:text-base">
              Account Statistics
            </h3>
            <StatsGrid
              stats={{
                followers: profile.followers,
                following: profile.following,
                likes: profile.likes,
                videos: profile.videos,
              }}
            />
          </div>
        </div>
      )}

      {/* SEO Content Section */}
      <InfoSection />
    </section>
  );
};

export default Home;