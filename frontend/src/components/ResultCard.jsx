import React, { useMemo, useState } from 'react';

const formatNumber = (value) => {
  // Handle null, undefined, empty string, or invalid values
  if (value === null || value === undefined || value === '') {
    return '0';
  }
  
  const num = Number(value);
  
  // If conversion failed, return 0 instead of dash
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return '0';
  }
  
  // Format large numbers
  if (Math.abs(num) >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  
  return num.toLocaleString();
};

const formatCurrency = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '$0';
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ResultCard = ({ result, shareId }) => {
  const [copied, setCopied] = useState(false);
  const shareLink = useMemo(() => {
    if (!shareId) return '';
    const origin = window.location.origin;
    return `${origin}/calculator?share=${shareId}`;
  }, [shareId]);

  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-6 text-center text-gray-500">
        Run a calculation to see results here.
      </div>
    );
  }

  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
      window.alert('Copy failed, please copy manually: ' + shareLink);
    }
  };

  const perVideoDisplay =
    result.formatted?.perVideoNet ??
    formatCurrency(result.perVideoNet ?? result.perVideo ?? 0);
  const monthlyDisplay =
    result.formatted?.monthlyNet ?? formatCurrency(result.monthlyNet ?? 0);
  const impressionsDisplay =
    result.formatted?.impressionsPerVideo ||
    formatNumber(result.impressionsPerVideo) ||
    '-';
  const cpmDisplay = result.formatted?.usedCPM || `$${result.usedCPM || 0}`;
  const platformDisplay =
    result.formatted?.platformShare ||
    `${Math.round((result.platformShare || 0) * 100)}%`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 ring-indigo-50 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute right-6 top-6 h-12 w-12 rounded-full bg-indigo-100" />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Profile-Based Estimate</h3>
          {shareLink && (
            <button
              onClick={handleCopy}
              className="rounded-full border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-50"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          )}
        </div>

        <div className="space-y-2 rounded-2xl bg-white px-4 py-6 text-center shadow-md ring-1 ring-gray-100">
          <p className="text-sm font-medium text-slate-600">Estimated TikTok Earnings</p>
          <p className="text-5xl font-bold text-gray-900 md:text-6xl">{monthlyDisplay}</p>
          <p className="text-xs text-slate-500">
            Total estimated earnings based on profile stats
          </p>
        </div>

        <div className="rounded-2xl bg-white px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-sm font-medium text-slate-600">Estimated Per Video</p>
          <p className="text-2xl font-semibold text-slate-900">{perVideoDisplay}</p>
          <p className="text-xs text-slate-500">estimated per video</p>
        </div>

        <div className="grid gap-3 rounded-2xl bg-white p-4 text-sm text-gray-700 ring-1 ring-gray-100 md:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">Est. Views per Video</p>
            <p className="font-semibold">{impressionsDisplay}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">CPM Used</p>
            <p className="font-semibold">{cpmDisplay}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Platform Share</p>
            <p className="font-semibold">{platformDisplay}</p>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-2">
          <div className="rounded-xl bg-indigo-50 px-4 py-3 ring-1 ring-indigo-100">
            <p className="text-xs text-indigo-600">Est. Gross per Video</p>
            <p className="text-lg font-semibold text-indigo-900">
              {result.formatted?.perVideoGross || formatCurrency(result.perVideoGross)}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
            <p className="text-xs text-emerald-600">Est. Net per Video</p>
            <p className="text-lg font-semibold text-emerald-900">{perVideoDisplay}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-gray-100">
          <p className="text-xs text-gray-500">Est. Views (in thousands)</p>
          <p className="text-base font-semibold">
            {result.thousands !== undefined ? result.thousands.toFixed(2) : '-'}
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-gray-400 leading-tight">
          * These are estimates based on profile data. Actual earnings depend on content type, audience location, TikTok Creator Fund eligibility, and other factors.
        </p>

        {result.note && (
          <p className="text-xs text-slate-500">
            Note: {result.note}
          </p>
        )}

        {shareLink && (
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-800">
            Shareable URL: {shareLink}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;

