import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DATE_LOCALE_BY_LANG, resolveLangCode } from '../locales/homeContentRegistry';

const ProfileHeader = ({ profile }) => {
  const { t, i18n } = useTranslation();
  const [imgError, setImgError] = useState(false);

  const actualProfile =
    profile && profile.profile && typeof profile.profile === 'object' ? profile.profile : profile;
  const resetKey = actualProfile?.username || '';

  useEffect(() => {
    setImgError(false);
  }, [resetKey]);

  if (!profile) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-red-700">
        <p className="font-semibold">Error: No profile data</p>
        <p className="text-sm">Profile object is missing or undefined</p>
      </div>
    );
  }

  const resolvedProfile =
    profile.profile && typeof profile.profile === 'object' ? profile.profile : profile;

  // Destructure with fallbacks
  const {
    profilePic,
    profilePictureUrl,
    profilePicThumb,
    fullName,
    username,
    verified = false,
    bio,
    description,
    region,
    tiktokId,
    joinedAt,
  } = resolvedProfile || {};

  const safeUsername = (username || '').toString().trim();
  const safeFullName = (fullName || '').toString().trim();

  // Bio extraction from all possible sources
  const rawBio = (
    bio ||
    description ||
    resolvedProfile?.signature ||
    resolvedProfile?.bioText ||
    resolvedProfile?.rawBio ||
    resolvedProfile?.rootBio ||
    profile?.bio ||
    profile?.description ||
    profile?.rawBio ||
    profile?.rootBio ||
    ''
  ).toString().trim();

  let safeBio = rawBio
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/^Signature\s*\(Required\)\s*:\s*/i, '')
    .trim();

  const safeRegion = (region || '').toString().trim();
  const safeTiktokId = (tiktokId || '').toString().trim();
  const safeProfilePic = (profilePic || profilePictureUrl || profilePicThumb || '').toString().trim();

  // ── joinedAt: check all possible sources ──
  const rawJoinedAt =
    joinedAt ||
    resolvedProfile?.joinedAt ||
    resolvedProfile?.joined_at ||
    resolvedProfile?.createTime ||
    profile?.joinedAt ||
    profile?.joined_at ||
    null;

  // Format the date nicely
  const formatJoinedDate = (value) => {
    if (!value) return null;
    try {
      const num = Number(value);
      const date = !isNaN(num) && num > 1_000_000_000
        ? new Date(num * 1000)
        : new Date(value);

      if (isNaN(date.getTime())) return null;

      // Use UTC to avoid timezone shift
      const langCode = resolveLangCode(i18n.resolvedLanguage || i18n.language);
      const localeTag = DATE_LOCALE_BY_LANG[langCode] || 'en-US';
      return date.toLocaleDateString(localeTag, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      });
    } catch {
      return null;
    }
  };

  const joinedDateFormatted = formatJoinedDate(rawJoinedAt);

  if (!safeUsername) {
    return (
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-amber-700">
        <p className="font-semibold">{t('home.incompleteProfileTitle', 'Warning: Incomplete profile data')}</p>
        <p className="text-sm">{t('home.incompleteProfileDesc', 'Username is missing from the profile')}</p>
      </div>
    );
  }

  const avatar = safeProfilePic;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center shadow-sm sm:gap-3 sm:p-6 transition-colors">

      {/* Profile Picture */}
      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 sm:h-20 sm:w-20">
        {avatar && !imgError ? (
          <img
            src={avatar}
            alt={t('home.avatarAlt', {
              username: safeUsername,
              defaultValue: `TikTok profile avatar for @${safeUsername}`,
            })}
            width="80"
            height="80"
            decoding="async"
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-teal-700 dark:text-teal-300 sm:text-3xl">
            {safeUsername ? safeUsername.charAt(0).toUpperCase() : '?'}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex w-full flex-col items-center gap-1.5 sm:gap-2">

        {/* Name + Verified Badge */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            {safeFullName || safeUsername}
          </h3>
          {verified && (
            <span className="inline-flex items-center gap-1 rounded-md border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {t('home.verifiedBadge', 'Verified')}
            </span>
          )}
        </div>

        {/* Username, Region, and ID */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
          <span className="font-mono font-medium text-slate-800 dark:text-slate-200">@{safeUsername}</span>
          {safeRegion && (
            <span className="inline-flex items-center rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              {safeRegion}
            </span>
          )}
          {safeTiktokId && (
            <span className="inline-flex items-center font-mono text-[11px] text-slate-600 dark:text-slate-400">
              {t('home.idPrefix', {
                id: safeTiktokId,
                defaultValue: `ID: ${safeTiktokId}`,
              })}
            </span>
          )}
        </div>

        {/* Bio */}
        {safeBio && safeBio.trim() !== '' && safeBio !== 'Signature (Required):' ? (
          <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-700 text-center px-2 sm:text-sm">
            {safeBio}
          </p>
        ) : (
          <p className="mt-1 text-xs italic text-slate-600 text-center sm:text-sm">
            {t('home.noBio', 'No bio provided.')}
          </p>
        )}

        {/* Account Created Date */}
        {joinedDateFormatted && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
            <svg
              className="h-4 w-4 flex-shrink-0 text-slate-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-xs text-slate-700 sm:text-sm">
              {t('home.joinedPrefix', {
                date: joinedDateFormatted,
                defaultValue: `Joined ${joinedDateFormatted}`,
              })}
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileHeader;