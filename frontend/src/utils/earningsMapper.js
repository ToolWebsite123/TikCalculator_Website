/**
 * Authoritative Earnings Validator & Extractor
 * Preserves backend-computed earningsData without inventing client-side CPMs or fallback figures.
 */

export const hasPublicProfileSignal = (profileObj) => {
  if (!profileObj || typeof profileObj !== 'object') {
    return false;
  }
  const hasFollowers = Number(profileObj.followers) > 0;
  const hasLikes = Number(profileObj.likes) > 0;
  const hasVideos = Number(profileObj.videos) > 0;
  const hasTiktokId = Boolean(profileObj.tiktokId || profileObj.id || profileObj.secUid);
  return hasFollowers || hasLikes || hasVideos || hasTiktokId;
};

export const extractAuthoritativeEarningsData = (payload) => {
  if (!payload || typeof payload !== 'object' || payload.success === false) {
    return null;
  }

  const candidate = payload.earningsData;
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const rawEstimated =
    candidate.estimatedEarnings ?? candidate.earningPerVideo ?? candidate.perVideoNet ?? candidate.perVideo;

  if (rawEstimated === null || rawEstimated === undefined || rawEstimated === '') {
    return null;
  }

  const estimated = Number(rawEstimated);
  if (!Number.isFinite(estimated)) {
    return null;
  }

  return candidate;
};

export const mapEarningsData = (data) => extractAuthoritativeEarningsData(data);

export default mapEarningsData;
