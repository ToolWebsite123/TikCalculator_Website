const mongoose = require('mongoose');

const ONE_HOUR_SECONDS = 1 * 60 * 60; // 1 hour TTL

const profileCacheSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    profile: { type: Object, required: true },
    analytics: { type: Object },
    earnings: { type: Object },
    latestVideos: { type: Array },
    meta: { type: Object },
    raw: { type: Object },
    bio: { type: String, default: '' },
    fetchedAt: { type: Date, default: Date.now, expires: ONE_HOUR_SECONDS },
  },
  { minimize: false }
);

module.exports = mongoose.model('ProfileCache', profileCacheSchema);


