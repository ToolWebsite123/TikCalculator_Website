import React, { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim().replace(/^@/, ''); // Remove @ if present
    
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

      const mergedProfile = {
        ...profileData,
        bio: cleanBio || profileData?.bio || profileData?.description || '',
        description: cleanBio || profileData?.description || profileData?.bio || '',
      };

      setStats(mergedProfile);
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
      <div className="w-full rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-lg ring-1 ring-gray-100 sm:rounded-3xl sm:p-6 md:p-10">
        <header className="space-y-2 text-center sm:space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            {t('home.title')}
          </h1>
          <p className="text-sm text-slate-600 sm:text-base max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
        </header>

        {/* Calculator Form */}
        <div className="mx-auto mt-6 w-full max-w-4xl rounded-xl border-2 border-dashed border-gray-300 bg-white/60 p-4 sm:mt-8 sm:rounded-2xl sm:p-6 md:p-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6"
            aria-label="TikTok earnings calculator form"
          >
            <label 
              htmlFor="tiktok-username"
              className="text-base font-semibold text-slate-800 text-center sm:text-lg"
            >
              {t('home.usernameLabel')}
            </label>
            
            <div className="w-full max-w-md">
              <input
                id="tiktok-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('home.placeholder')}
                aria-describedby="username-helper"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:px-5 sm:py-3.5 sm:text-lg md:text-xl"
              />
              <p id="username-helper" className="mt-1.5 text-xs text-slate-500 text-center">
                Enter username without @ symbol
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full max-w-md rounded-lg bg-[#1B3C53] px-6 py-3 text-center text-base font-semibold text-white shadow-lg transition hover:bg-[#1B3C53]/90 disabled:cursor-not-allowed disabled:opacity-70 sm:py-3.5 sm:text-lg md:w-2/5 md:max-w-xs"
            >
              {loading ? t('home.buttonLoading') : t('home.buttonCalculate')}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            role="alert"
            className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700 sm:px-4 sm:py-3 sm:text-sm"
          >
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {profile && (
        <div className="mt-6 flex w-full flex-col gap-4 sm:mt-8 sm:gap-5 md:mt-10 md:gap-6">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">
              Profile-Based Earnings Estimate
            </h2>
            <p className="text-xs text-slate-500 mt-1 sm:text-sm">
              Results based on publicly available profile data
            </p>
          </div>

          {/* Profile + Earnings - Side by Side */}
          <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
            <div className="flex-1 flex w-full">
              <ProfileHeader profile={profile} />
            </div>
            <div className="flex-1 flex w-full">
              <EarningsCard earningsData={earningsData} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="w-full">
            <h3 className="text-sm font-medium text-slate-600 mb-3 sm:text-base">
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
