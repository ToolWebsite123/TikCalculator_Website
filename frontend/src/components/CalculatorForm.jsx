import React, { useEffect, useState } from 'react';
import {
  estimateEarnings,
  fetchCountries,
  saveCalculation,
} from '../utils/api';

// Preset configurations for quick testing
const presets = [
  { label: '🚀 Viral: 500k views, 10 videos', views: 500000, videos: 10 },
  { label: '📈 Growing: 100k views, 15 videos', views: 100000, videos: 15 },
  { label: '🌱 Starter: 25k views, 20 videos', views: 25000, videos: 20 },
];

const CalculatorForm = ({ onResult, onShareId, onLoading, onError }) => {
  // Form state
  const [viewsPerVideo, setViewsPerVideo] = useState(100000);
  const [videosPerMonth, setVideosPerMonth] = useState(8);
  const [countryCode, setCountryCode] = useState('US');
  const [customCpm, setCustomCpm] = useState('');
  const [platformShare, setPlatformShare] = useState(40);
  const [followers, setFollowers] = useState('');
  const [likes, setLikes] = useState('');
  const [totalVideos, setTotalVideos] = useState(''); // For engagement calculation
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries()
      .then(setCountries)
      .catch((err) => {
        console.error('Failed to load countries:', err);
        if (onError) onError('Could not load country presets.');
      });
  }, [onError]);

  // Auto-set CPM when country changes
  useEffect(() => {
    if (!customCpm && countries.length > 0) {
      const match = countries.find((c) => c.code === countryCode);
      if (match) setCustomCpm(match.defaultCpm);
    }
  }, [countryCode, countries, customCpm]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!viewsPerVideo || Number(viewsPerVideo) < 0) {
      newErrors.viewsPerVideo = 'Views must be 0 or greater';
    }

    if (!videosPerMonth || Number(videosPerMonth) <= 0) {
      newErrors.videosPerMonth = 'Must be at least 1 video per month';
    }

    if (followers && Number(followers) < 0) {
      newErrors.followers = 'Followers cannot be negative';
    }

    if (likes && Number(likes) < 0) {
      newErrors.likes = 'Likes cannot be negative';
    }

    if (customCpm && Number(customCpm) < 0) {
      newErrors.customCpm = 'CPM cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      onError?.('Please fix the form errors before submitting.');
      return;
    }

    // Prepare payload
    const payload = {
      viewsPerVideo: Number(viewsPerVideo) || 0,
      videosPerMonth: Number(videosPerMonth),
      followers: followers !== '' ? Number(followers) : undefined,
      likes: likes !== '' ? Number(likes) : undefined,
      videos: totalVideos !== '' ? Number(totalVideos) : undefined, // Total videos
      platformShare: Number(platformShare) / 100,
      cpm: customCpm !== '' ? Number(customCpm) : undefined,
      countryCode,
    };

    try {
      setLoading(true);
      onLoading?.(true);
      
      // Get earnings estimate
      const estimate = await estimateEarnings(payload);
      onResult?.(estimate, payload);
      
      // Save calculation for sharing
      const saved = await saveCalculation({
        inputs: payload,
        result: estimate,
      });
      onShareId?.(saved._id);
      
    } catch (err) {
      console.error('Calculation error:', err);
      onError?.(
        err?.response?.data?.error || 
        'Calculation failed. Please check your inputs and try again.'
      );
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  // Apply preset
  const applyPreset = (preset) => {
    setViewsPerVideo(preset.views);
    setVideosPerMonth(preset.videos);
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100 transition-shadow hover:shadow-2xl"
    >
      {/* Preset buttons */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="rounded-full border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main inputs grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Views per video */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Views per video *
          </label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={viewsPerVideo}
            onChange={(e) => {
              setViewsPerVideo(e.target.value);
              setErrors({ ...errors, viewsPerVideo: null });
            }}
            className={`rounded-lg border-2 px-4 py-2.5 outline-none transition focus:ring-2 ${
              errors.viewsPerVideo
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-200'
            }`}
            placeholder="e.g., 100000"
          />
          {errors.viewsPerVideo && (
            <span className="text-xs text-red-600">{errors.viewsPerVideo}</span>
          )}
        </div>

        {/* Videos per month */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Videos per month *
          </label>
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={videosPerMonth}
            onChange={(e) => {
              setVideosPerMonth(e.target.value);
              setErrors({ ...errors, videosPerMonth: null });
            }}
            className={`rounded-lg border-2 px-4 py-2.5 outline-none transition focus:ring-2 ${
              errors.videosPerMonth
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-200'
            }`}
            placeholder="e.g., 8"
          />
          {errors.videosPerMonth && (
            <span className="text-xs text-red-600">{errors.videosPerMonth}</span>
          )}
        </div>

        {/* Followers (optional) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Followers <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={followers}
            onChange={(e) => {
              setFollowers(e.target.value);
              setErrors({ ...errors, followers: null });
            }}
            className={`rounded-lg border-2 px-4 py-2.5 outline-none transition focus:ring-2 ${
              errors.followers
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-200'
            }`}
            placeholder="e.g., 1600000"
          />
          {errors.followers && (
            <span className="text-xs text-red-600">{errors.followers}</span>
          )}
        </div>

        {/* Likes (optional) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Total Likes <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={likes}
            onChange={(e) => {
              setLikes(e.target.value);
              setErrors({ ...errors, likes: null });
            }}
            className={`rounded-lg border-2 px-4 py-2.5 outline-none transition focus:ring-2 ${
              errors.likes
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-200'
            }`}
            placeholder="e.g., 80500000"
          />
          {errors.likes && (
            <span className="text-xs text-red-600">{errors.likes}</span>
          )}
        </div>

        {/* Total Videos (for engagement calculation) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Total Videos <span className="text-gray-500">(for engagement)</span>
          </label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={totalVideos}
            onChange={(e) => {
              setTotalVideos(e.target.value);
            }}
            className="rounded-lg border-2 border-gray-200 px-4 py-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g., 3100"
          />
          <span className="text-xs text-gray-500">
            Total number of videos on profile (for accurate engagement rate)
          </span>
        </div>

        {/* Country CPM preset */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Country / Region
          </label>
          <select
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setCustomCpm(''); // Reset custom CPM
            }}
            className="rounded-lg border-2 border-gray-200 px-4 py-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} — ${c.defaultCpm}
              </option>
            ))}
          </select>
        </div>

        {/* Custom CPM */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Custom CPM <span className="text-gray-500">(overrides preset)</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={customCpm}
            onChange={(e) => {
              setCustomCpm(e.target.value);
              setErrors({ ...errors, customCpm: null });
            }}
            className={`rounded-lg border-2 px-4 py-2.5 outline-none transition focus:ring-2 ${
              errors.customCpm
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-200'
            }`}
            placeholder="e.g., 5.50"
          />
          {errors.customCpm && (
            <span className="text-xs text-red-600">{errors.customCpm}</span>
          )}
        </div>
      </div>

      {/* Platform share slider */}
      <div className="flex flex-col gap-3 rounded-lg bg-gray-50 p-4">
        <label className="text-sm font-semibold text-gray-800">
          Platform Revenue Share
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={platformShare}
          onChange={(e) => setPlatformShare(e.target.value)}
          className="h-2 accent-indigo-600"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Platform keeps: <strong>{platformShare}%</strong>
          </span>
          <span className="text-gray-600">
            You keep: <strong>{100 - platformShare}%</strong>
          </span>
        </div>
      </div>

      {/* Formula explanation */}
      <div className="rounded-lg border-l-4 border-indigo-400 bg-indigo-50 p-4">
        <p className="text-sm leading-relaxed text-gray-700">
          <strong className="text-indigo-900">Formula:</strong> Earnings per video = 
          (Views ÷ 1000) × CPM × (1 - Platform Share)
          <br />
          <span className="text-xs text-gray-600">
            Monthly earnings = Per video earnings × Videos per month
          </span>
        </p>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:grayscale"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Calculating...
          </span>
        ) : (
          '💰 Calculate My Earnings'
        )}
      </button>

      {/* Privacy note */}
      <p className="text-center text-xs text-gray-500">
        🔒 Your data is private. We only store calculations for shareable links.
      </p>
    </form>
  );
};

export default CalculatorForm;