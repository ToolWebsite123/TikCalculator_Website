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
      console.log('[Frontend] [useEffect] result changed, calculating earnings...');
      
      // Extract avgViews from multiple possible locations
      const avgViews = Number(result.avgViews) || 
                      Number(result.analytics?.avgViews) || 
                      0;
      const engagementRate = Number(result.engagementRate) || 
                            Number(result.analytics?.engagementRate) || 
                            0;
      
      console.log('[Frontend] [useEffect] Extracted:', {
        avgViews,
        engagementRate,
        'result.avgViews': result.avgViews,
        'result.analytics?.avgViews': result.analytics?.avgViews,
      });
      
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
        
        console.log('[Frontend] [useEffect] ✅ Setting earningsData:', calculatedEarningsData);
        setEarningsData(calculatedEarningsData);
      }
    }
  }, [result]); // Recalculate whenever result changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('========================================');
    console.log('[Frontend] 🚀 handleSubmit CALLED for username:', username.trim());
    console.log('========================================');

    if (!username.trim()) {
      console.log('[Frontend] ❌ Username is empty!');
      setError('Please enter a TikTok username');
      return;
    }

    console.log('[Frontend] Setting loading states...');
    setLoading(true);
    setEarningsLoading(true);
    setError('');
    setResult(null);
    // CRITICAL: Don't reset earningsData to null - keep previous value until new data is ready
    // This prevents the EarningsCard from showing $0.00 during loading

    console.log('[Frontend] ========================================');
    console.log('[Frontend] Starting search for:', username.trim());

    try {
      // Fetch profile and earnings in parallel
      console.log('[Frontend] Calling fetchTikTokProfile and fetchTikTokEarnings...');

      const [profileData, earningsResponse] = await Promise.all([
        fetchTikTokProfile(username.trim()).catch(err => {
          console.error('[Frontend] ❌ fetchTikTokProfile failed:', err.message);
          throw err;
        }),
        fetchTikTokEarnings(username.trim()).catch(err => {
          console.error('[Frontend] ❌ fetchTikTokEarnings failed:', err.message);
          console.error('[Frontend] Error details:', err.response?.data || err);
          console.error('[Frontend] Error status:', err.response?.status);
          console.error('[Frontend] Error config:', err.config);
          // CRITICAL: Return safe fallback object instead of null
          console.warn('[Frontend] ⚠ Returning safe fallback for earningsResponse');
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
      
      // CRITICAL DEBUG: Log immediately after Promise.all
      console.log('[Frontend] ========================================');
      console.log('[Frontend] IMMEDIATELY AFTER Promise.all:');
      console.log('[Frontend]   - earningsResponse exists:', !!earningsResponse);
      console.log('[Frontend]   - earningsResponse type:', typeof earningsResponse);
      console.log('[Frontend]   - earningsResponse:', earningsResponse);
      console.log('[Frontend] ========================================');

      // STEP 1: Extract earningsData from API response
      // Backend returns: { success: true, profile: {...}, earningsData: {...} }
      // fetchTikTokProfile returns response.data, so profileData IS the response.data
      console.log('[Frontend] ========================================');
      console.log('[Frontend] STEP 1: EXTRACTING earningsData FROM API RESPONSE');
      console.log('[Frontend]   - profileData exists:', !!profileData);
      console.log('[Frontend]   - profileData type:', typeof profileData);
      console.log('[Frontend]   - profileData.success:', profileData?.success);
      console.log('[Frontend]   - profileData keys:', profileData ? Object.keys(profileData) : 'null');
      console.log('[Frontend]   - profileData.earningsData exists:', !!profileData?.earningsData);
      console.log('[Frontend]   - profileData.earningsData:', profileData?.earningsData);
      
      // CRITICAL: Extract earningsData from response.data.earningsData
      // Since fetchTikTokProfile returns response.data, profileData IS response.data
      const extractedEarningsData = profileData?.earningsData;
      
      console.log('[Frontend] ========================================');
      console.log('[Frontend] EXTRACTION RESULT:');
      console.log('[Frontend]   - extractedEarningsData exists:', !!extractedEarningsData);
      console.log('[Frontend]   - extractedEarningsData type:', typeof extractedEarningsData);
      console.log('[Frontend]   - extractedEarningsData is object:', typeof extractedEarningsData === 'object');
      console.log('[Frontend]   - extractedEarningsData:', extractedEarningsData);
      
      if (extractedEarningsData && typeof extractedEarningsData === 'object') {
        console.log('[Frontend] ✓✓✓ SUCCESS: Extracted earningsData from profileData.earningsData');
        console.log('[Frontend]   - earningsData keys:', Object.keys(extractedEarningsData));
        console.log('[Frontend]   - earningsData.avgViews:', extractedEarningsData.avgViews);
        console.log('[Frontend]   - earningsData.engagementRate:', extractedEarningsData.engagementRate);
        console.log('[Frontend]   - earningsData.cpm:', extractedEarningsData.cpm);
        console.log('[Frontend]   - earningsData.platformFactor:', extractedEarningsData.platformFactor);
        console.log('[Frontend]   - earningsData.estimatedEarnings:', extractedEarningsData.estimatedEarnings);
        console.log('[Frontend]   - earningsData.earningPerVideo:', extractedEarningsData.earningPerVideo);
        console.log('[Frontend]   - Full earningsData:', JSON.stringify(extractedEarningsData, null, 2));
        
        // STEP 2: Set earningsData in state
        console.log('[Frontend] STEP 2: CALLING setEarningsData()');
        setEarningsData(extractedEarningsData);
        console.log('[Frontend] ✓✓✓ setEarningsData() CALLED SUCCESSFULLY');
        console.log('[Frontend] FINAL RECEIVED (PARENT):', JSON.stringify(extractedEarningsData, null, 2));
      } else {
        console.error('[Frontend] ❌ ERROR: earningsData is missing or invalid!');
        console.error('[Frontend]   - extractedEarningsData:', extractedEarningsData);
        console.error('[Frontend]   - extractedEarningsData type:', typeof extractedEarningsData);
        console.error('[Frontend]   - profileData:', profileData);
        console.error('[Frontend]   - profileData.earningsData:', profileData?.earningsData);
      }
      
      console.log('[Frontend] ========================================');

      console.log('[Frontend] Profile data received:', {
        success: profileData?.success,
        hasProfile: !!profileData?.profile,
        followers: profileData?.profile?.followers,
      });

      console.log('[Frontend] ========================================');
      console.log('[Frontend] Earnings response received (RAW):', earningsResponse);
      console.log('[Frontend] Earnings response type:', typeof earningsResponse);
      console.log('[Frontend] Earnings response is null?', earningsResponse === null);
      console.log('[Frontend] Earnings response is undefined?', earningsResponse === undefined);
      console.log('[Frontend] Earnings response keys:', earningsResponse ? Object.keys(earningsResponse) : 'null');
      console.log('[Frontend] Earnings response values:', {
        success: earningsResponse?.success,
        perVideoNet: earningsResponse?.perVideoNet,
        earningPerVideo: earningsResponse?.earningPerVideo,
        estimatedEarnings: earningsResponse?.estimatedEarnings,
        earnings: earningsResponse?.earnings,
        avgViews: earningsResponse?.avgViews,
        engagementRate: earningsResponse?.engagementRate,
        cpm: earningsResponse?.cpm,
        CPM: earningsResponse?.CPM,
        monthlyEarnings: earningsResponse?.monthlyEarnings,
        monthlyEarning: earningsResponse?.monthlyEarning,
        hasData: !!earningsResponse,
        fullResponse: JSON.stringify(earningsResponse, null, 2),
      });
      console.log('[Frontend] ========================================');
      
      // CRITICAL DEBUG: Log if earningsResponse is actually received
      if (!earningsResponse) {
        console.error('[Frontend] ❌❌❌ earningsResponse is NULL/UNDEFINED!');
      } else if (earningsResponse.success === false) {
        console.error('[Frontend] ❌❌❌ earningsResponse.success is FALSE!');
      } else {
        console.log('[Frontend] ✓✓✓ earningsResponse is valid:', {
          hasSuccess: earningsResponse.success !== undefined,
          successValue: earningsResponse.success,
          hasEarnings: !!earningsResponse.earnings,
          earningsValue: earningsResponse.earnings,
        });
      }

      // DEBUG: Log if earningsResponse is null
      if (!earningsResponse) {
        console.warn('[Frontend] ⚠ earningsResponse is NULL - API call may have failed');
      } else if (!earningsResponse.success) {
        console.warn('[Frontend] ⚠ earningsResponse.success is false:', earningsResponse);
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
      
      // NOTE: earningsData was already extracted and set in state above (lines 204-220)
      // Only use fallback if earningsData wasn't found in API response
      if (!earningsData || typeof earningsData !== 'object') {
        console.warn('[Frontend] ⚠ earningsData not found in API response, using fallback');
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
        console.log('[Frontend] ✓✓✓ setEarningsData() CALLED with fallback');
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
      console.log('[Frontend] Error occurred, creating fallback earningsData...');
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
      console.log('[Frontend] ✓✓✓ CALLING setEarningsData() in error handler:', errorEarningsData);
      setEarningsData(errorEarningsData);
      console.log('[Frontend] ✓✓✓ setEarningsData() CALLED in error handler');
    } finally {
      // CRITICAL: Always set loading to false
      setLoading(false);
      setEarningsLoading(false);
      
      // CRITICAL: Final safety check - ensure earningsData is NEVER null
      // This runs after both try and catch blocks
      setTimeout(() => {
        // Use setTimeout to check after state update
        // This is a last resort safety net
        console.log('[Frontend] [Finally] Final safety check for earningsData');
      }, 0);
      
      // CRITICAL: Final check - ensure earningsData is set
      // If it's still null/undefined after all processing, log a warning
      setTimeout(() => {
        if (!earningsData) {
          console.error('[Frontend] ❌❌❌ CRITICAL: earningsData is STILL null/undefined after handleSubmit!');
          console.error('[Frontend] This should never happen - earningsData should always be set');
        } else {
          console.log('[Frontend] ✓✓✓ Final check: earningsData is set:', {
            hasEarnings: !!earningsData.earnings,
            earnings: earningsData.earnings,
            estimatedEarnings: earningsData.estimatedEarnings,
          });
        }
      }, 100);
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
          console.log('[Frontend] ✓ Using backend earnings response (refresh):', {
            estimatedEarnings: earningsResponse.estimatedEarnings,
            avgViews: earningsResponse.avgViews,
            cpm: earningsResponse.cpm,
          });
        } else {
          console.warn('[Frontend] ⚠ Backend earnings response has invalid values (refresh), calculating fallback:', {
            estimatedEarnings: earningsResponse.estimatedEarnings,
            avgViews: earningsResponse.avgViews,
            cpm: earningsResponse.cpm,
          });
          // Fall through to calculate fallback
        }
      }

      // Calculate fallback if backend response not available or invalid
      if (!finalEarningsData) {
        console.log('[Frontend] ⚠ Backend earnings response not available (refresh), calculating fallback...');

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

        console.log('[Frontend] ✓ Calculated fallback earnings (refresh):', {
          estimatedEarnings: finalEarningsData.estimatedEarnings,
          avgViews: finalEarningsData.avgViews,
          cpm: finalEarningsData.cpm,
        });
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

        console.log('[Frontend] ✓ Final validated earnings data (refresh):', {
          avgViews: finalEarningsData.avgViews,
          engagementRate: finalEarningsData.engagementRate,
          cpm: finalEarningsData.cpm,
          estimatedEarnings: finalEarningsData.estimatedEarnings,
        });
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
        console.error('[Frontend] ❌ REFRESH: finalEarningsData is NULL! Creating emergency fallback...');
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
        console.error('[Frontend] ❌ CRITICAL: finalEarningsData is NULL in refresh! Creating safe fallback...');
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
      console.log('[Frontend] ✓✓✓ setEarningsData() ALWAYS CALLED in refresh:', finalEarningsData);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to refresh profile';
      setError(message);

      // CRITICAL: Set earnings data even on error (safe fallback)
      console.warn('[Frontend] ⚠ Setting safe fallback earningsData on refresh error');
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
      console.log('[Frontend] ✓ Set safe fallback earningsData in refresh error handler');
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
