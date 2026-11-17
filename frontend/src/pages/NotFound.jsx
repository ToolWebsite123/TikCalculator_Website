import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from '../components/LocaleLink';
import useSEO from '../utils/useSEO';

const NotFound = () => {
  const { t } = useTranslation();
  const pageTitle = t('seo.notFound.title', '404 — Page Not Found | KalkulatorTik');

  useSEO({
    title: pageTitle,
    description: 'The requested page could not be found on KalkulatorTik.',
    robots: 'noindex, nofollow',
    omitCanonical: true,
    omitHreflang: true,
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16 transition-colors">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-6xl font-extrabold text-teal-700 sm:text-7xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed sm:text-base">
          Sorry, we couldn’t find the page you’re looking for. It may have been moved, renamed, or never existed.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 active:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 transition"
          >
            Go back home
          </Link>
          <Link
            to="/faq"
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-teal-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 transition"
          >
            Visit FAQ
          </Link>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-xs font-medium text-slate-600 mb-3">Popular Calculators:</p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs">
            <Link
              to="/"
              className="rounded px-1 py-0.5 font-semibold text-teal-700 hover:text-teal-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              TikTok Money Calculator
            </Link>
            <span className="text-slate-400" aria-hidden="true">•</span>
            <Link
              to="/tiktok-engagement-calculator"
              className="rounded px-1 py-0.5 font-semibold text-teal-700 hover:text-teal-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              Engagement Calculator
            </Link>
            <span className="text-slate-400" aria-hidden="true">•</span>
            <Link
              to="/tiktok-cpm-calculator"
              className="rounded px-1 py-0.5 font-semibold text-teal-700 hover:text-teal-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              CPM Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
