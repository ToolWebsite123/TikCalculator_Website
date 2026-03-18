import React from 'react';

const ProfileHeader = ({ profile }) => {
  if (!profile) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-red-700">
        <p className="font-semibold">Error: No profile data</p>
        <p className="text-sm">Profile object is missing or undefined</p>
      </div>
    );
  }

  let actualProfile = profile;
  if (profile.profile && typeof profile.profile === 'object') {
    actualProfile = profile.profile;
  }

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
  } = actualProfile || {};

  const safeUsername = (username || '').toString().trim();
  const safeFullName = (fullName || '').toString().trim();

  // Bio extraction from all possible sources
  const rawBio = (
    bio ||
    description ||
    actualProfile?.signature ||
    actualProfile?.bioText ||
    actualProfile?.rawBio ||
    actualProfile?.rootBio ||
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
    actualProfile?.joinedAt ||
    actualProfile?.joined_at ||
    actualProfile?.createTime ||
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
      return date.toLocaleDateString('en-US', {
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
        <p className="font-semibold">Warning: Incomplete profile data</p>
        <p className="text-sm">Username is missing from the profile</p>
      </div>
    );
  }

  const avatar = safeProfilePic;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-5 ring-1 ring-gray-100 dark:ring-gray-700 text-center sm:gap-4 sm:rounded-2xl sm:p-6 md:p-7 transition-colors">

      {/* Profile Picture */}
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 shadow-inner sm:h-28 sm:w-28 md:h-32 md:w-32">
        {avatar ? (
          <img
            src={avatar}
            alt={`${safeUsername}'s profile picture`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent && safeUsername) {
                parent.innerHTML = `
                  <div class="flex h-full w-full items-center justify-center text-2xl font-semibold text-indigo-700 sm:text-3xl md:text-4xl">
                    ${safeUsername.charAt(0).toUpperCase()}
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-indigo-700 sm:text-3xl md:text-4xl">
            {safeUsername ? safeUsername.charAt(0).toUpperCase() : '?'}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex w-full flex-col items-center gap-1.5 sm:gap-2">

        {/* Name + Verified Badge */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl md:text-3xl">
            {safeFullName || safeUsername}
          </h3>
          {verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 sm:px-2.5 sm:py-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Username */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-white sm:text-sm">
          <span className="font-medium">@{safeUsername}</span>
        </div>

        {/* Bio */}
        {safeBio && safeBio.trim() !== '' && safeBio !== 'Signature (Required):' ? (
          <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-slate-700 dark:text-white text-center px-3 sm:mt-2 sm:text-sm sm:px-4">
            {safeBio}
          </p>
        ) : (
          <p className="mt-1.5 text-xs italic text-slate-400 dark:text-white text-center sm:mt-2 sm:text-sm">
            No bio provided.
          </p>
        )}

        {/* ── Account Created Date ── */}
        {joinedDateFormatted && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-gray-700 px-4 py-2 sm:mt-3">
            {/* Calendar icon */}
            <svg
              className="h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              Joined{' '}
              <span className="font-bold text-slate-800 dark:text-white">
                {joinedDateFormatted}
              </span>
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileHeader;