import React from 'react';

const formatNumber = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return num.toLocaleString();
};

const LatestVideos = ({ videos = [] }) => {
  if (!videos || videos.length === 0) return null;
  const top = videos.slice(0, 4);
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900">Latest videos</h4>
        <span className="text-xs text-slate-500">showing {top.length} of {videos.length}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {top.map((video) => (
          <div
            key={video.id}
            className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"
          >
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100">
              {video.cover ? (
                <img
                  src={video.cover}
                  alt="Video thumbnail"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  No thumbnail
                </div>
              )}
            </div>
            <div className="text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{formatNumber(video.views)} views</p>
              <p className="text-xs text-slate-500">
                {formatNumber(video.likes)} likes · {formatNumber(video.comments)} comments
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestVideos;




