import React, { useState } from 'react';
import Link from '../components/LocaleLink';
import { useTranslation } from 'react-i18next';
import useSEO from '../utils/useSEO';
import parseMetricNumber from '../utils/parseMetricNumber';
import { useActiveLang } from '../contexts/LocaleContext';
import { BASE_URL, buildLocalizedPath } from '../utils/localeRouting';

// Mathematical helpers for CPM calculations (exported for unit testing)
export const calculateCPM = (cost, impressions) => {
  const c = Number(cost);
  const i = Number(impressions);
  if (isNaN(c) || isNaN(i) || c <= 0 || i <= 0) return null;
  return (c / i) * 1000;
};

export const calculateAdSpend = (cpm, impressions) => {
  const c = Number(cpm);
  const i = Number(impressions);
  if (isNaN(c) || isNaN(i) || c <= 0 || i <= 0) return null;
  return (c * i) / 1000;
};

export const calculateImpressions = (cost, cpm) => {
  const c = Number(cost);
  const cp = Number(cpm);
  if (isNaN(c) || isNaN(cp) || c <= 0 || cp <= 0) return null;
  return (c / cp) * 1000;
};

export const validateAndCalculateCPM = ({ mode, totalCost, targetCpm, impressions }) => {
  const costRaw = String(totalCost || '').trim();
  const cpmRaw = String(targetCpm || '').trim();
  const impRaw = String(impressions || '').trim();

  const parseCurrency = (val) => {
    if (!val) return null;
    const standard = parseFloat(String(val).replace(/,/g, ''));
    if (!isNaN(standard) && standard > 0) return standard;
    return null;
  };

  const parseImpressions = (val) => {
    if (!val) return null;
    const metricParsed = parseMetricNumber(val);
    if (metricParsed !== null && metricParsed > 0) return metricParsed;
    const standard = parseFloat(String(val).replace(/,/g, ''));
    if (!isNaN(standard) && standard > 0) return standard;
    return null;
  };

  const costNum = parseCurrency(costRaw);
  const cpmNum = parseCurrency(cpmRaw);
  const impNum = parseImpressions(impRaw);

  if (mode === 'cpm') {
    if (!costRaw || !impRaw) {
      return { error: 'Please enter both Total Ad Spend and Number of Impressions.', errorKey: 'errorEmpty', result: null };
    }
    if (costNum === null || impNum === null) {
      return { error: 'Values must be positive numbers (e.g. 500, 100000, 100K).', errorKey: 'errorPositive', result: null };
    }
    const calculated = calculateCPM(costNum, impNum);
    return { error: null, errorKey: null, result: calculated, costNum, impNum, cpmNum: calculated };
  }

  if (mode === 'spend') {
    if (!cpmRaw || !impRaw) {
      return { error: 'Please enter both Target CPM and Number of Impressions.', errorKey: 'errorEmpty', result: null };
    }
    if (cpmNum === null || impNum === null) {
      return { error: 'Values must be positive numbers (e.g. 5.50, 250000, 250K).', errorKey: 'errorPositive', result: null };
    }
    const calculated = calculateAdSpend(cpmNum, impNum);
    return { error: null, errorKey: null, result: calculated, costNum: calculated, impNum, cpmNum };
  }

  if (mode === 'impressions') {
    if (!costRaw || !cpmRaw) {
      return { error: 'Please enter both Total Ad Spend and Target CPM.', errorKey: 'errorEmpty', result: null };
    }
    if (costNum === null || cpmNum === null) {
      return { error: 'Values must be positive numbers (e.g. 1200, 4.50).', errorKey: 'errorPositive', result: null };
    }
    const calculated = calculateImpressions(costNum, cpmNum);
    return { error: null, errorKey: null, result: calculated, costNum, impNum: calculated, cpmNum };
  }

  return { error: 'Invalid calculation mode selected.', errorKey: 'errorInvalid', result: null };
};

const SECTION_ICONS = {
  calculator: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  ),
  formula: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M4.75 6.75h3.5m4.5 0h6.5m-11 5.25h11m-11 5.25h11M7.5 4.5v4.5m0 6v4.5"
    />
  ),
  scales: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    />
  ),
  chart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  ),
  gears: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  ),
  lightbulb: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.688a7.5 7.5 0 10-4.5 0M9.75 21h4.5"
    />
  ),
  metrics: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M3.75 20.25h16.5"
    />
  ),
  tools: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.353l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
    />
  ),
  faq: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  ),
  cta: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
    />
  ),
};

const SectionHeader = ({ id, icon, title, description, noDivider = false }) => (
  <div className={noDivider ? '' : 'border-b border-slate-100 pb-5'}>
    <div className="flex items-center gap-3.5">
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm"
        aria-hidden="true"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {SECTION_ICONS[icon]}
        </svg>
      </span>
      <h2 id={id} className="font-display text-xl font-bold tracking-tight text-teal-800 sm:text-2xl">
        {title}
      </h2>
    </div>
    {description && (
      <p className="mt-3.5 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
    )}
  </div>
);

const CURRENCIES = [
  { value: 'USD', label: '$ USD', symbol: '$' },
  { value: 'EUR', label: '€ EUR', symbol: '€' },
  { value: 'GBP', label: '£ GBP', symbol: '£' },
  { value: 'CAD', label: '$ CAD', symbol: '$' },
  { value: 'AUD', label: '$ AUD', symbol: '$' },
  { value: 'INR', label: '₹ INR', symbol: '₹' },
  { value: 'PKR', label: '₨ PKR', symbol: '₨' },
  { value: 'IDR', label: 'Rp IDR', symbol: 'Rp ' },
  { value: 'BRL', label: 'R$ BRL', symbol: 'R$ ' },
];

const TikTokCPMCalculator = () => {
  const { t } = useTranslation();
  const activeLang = useActiveLang();

  const activeTitle = t('seo.cpmCalculator.title', 'TikTok CPM Calculator – Calculate Ad Cost & Reach');
  const activeDescription = t(
    'seo.cpmCalculator.description',
    'Calculate your TikTok CPM, ad spend budget, or required impressions. Free 3-in-1 calculator with industry benchmarks, currency rates, and campaign planning.'
  );

  const faqItems = [
    {
      q: t('cpmCalculator.content.faq.q1.question', 'How does the TikTok CPM Calculator calculate ad costs?'),
      a: t(
        'cpmCalculator.content.faq.q1.answer',
        'The calculator uses the standard advertising formula: CPM = (Total Ad Spend ÷ Total Impressions) × 1,000. It also lets you solve in reverse for required budget (Spend = Target CPM × Impressions ÷ 1,000) or estimated impressions (Impressions = Spend ÷ Target CPM × 1,000).'
      ),
    },
    {
      q: t('cpmCalculator.content.faq.q2.question', 'What is considered a good or average TikTok CPM in 2026?'),
      a: t(
        'cpmCalculator.content.faq.q2.answer',
        'For standard In-Feed auction ads in Tier-1 countries (US, UK, Canada, Australia), a typical CPM ranges between $3.50 and $7.50 for traffic campaigns, and $1.50 to $3.50 for broad awareness. Highly targeted conversion campaigns in competitive niches (finance, SaaS, ecommerce) can reach $8.00 to $14.00+.'
      ),
    },
    {
      q: t('cpmCalculator.content.faq.q3.question', 'What is the difference between TikTok CPM and TikTok RPM?'),
      a: t(
        'cpmCalculator.content.faq.q3.answer',
        'CPM is what advertisers pay TikTok per 1,000 impressions. RPM (Revenue Per Mille) is what TikTok pays creators per 1,000 qualified video views through the Creator Rewards Program. Creator RPM is typically between $0.40 and $1.80 because TikTok filters non-qualified views and retains platform infrastructure share.'
      ),
    },
    {
      q: t('cpmCalculator.content.faq.q4.question', 'Does higher engagement lower my TikTok CPM?'),
      a: t(
        'cpmCalculator.content.faq.q4.answer',
        'Yes. TikTok\'s ad auction incorporates an ad quality and relevance score. Ads with higher watch time, completion rates, likes, and click-through rates (CTR) receive preferential delivery in the auction, effectively reducing the CPM you pay for impressions.'
      ),
    },
    {
      q: t('cpmCalculator.content.faq.q5.question', 'Can creators use this calculator to set brand sponsorship rates?'),
      a: t(
        'cpmCalculator.content.faq.q5.answer',
        'Yes. While direct TikTok Creator Rewards payouts use RPM, commercial brand deals are negotiated based on expected views and target sponsorship CPM. For example, a creator averaging 50,000 views at a $30.00 sponsorship CPM benchmark would command approximately $1,500 per dedicated video.'
      ),
    },
    {
      q: t('cpmCalculator.content.faq.q6.question', 'Why does TikTok CPM fluctuate during holiday seasons?'),
      a: t(
        'cpmCalculator.content.faq.q6.answer',
        'CPM is governed by supply and demand in an automated auction. During Q4 (Black Friday, Cyber Monday, Christmas), major retail and ecommerce advertisers flood the platform with higher budgets, driving up bids for user impressions. In January (Q1), CPMs typically drop significantly as advertiser spending resets.'
      ),
    },
  ];

  const localizedFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: activeLang,
    '@id': `${BASE_URL}${buildLocalizedPath('/tiktok-cpm-calculator', activeLang)}#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  useSEO({
    title: activeTitle,
    description: activeDescription,
    canonicalPath: '/tiktok-cpm-calculator',
    robots: 'index, follow',
    ogTitle: activeTitle,
    ogDescription: activeDescription,
    twitterTitle: activeTitle,
    twitterDescription: activeDescription,
    structuredData: localizedFaqSchema,
  });

  const [mode, setMode] = useState('cpm');
  const [totalCost, setTotalCost] = useState('');
  const [impressions, setImpressions] = useState('');
  const [targetCpm, setTargetCpm] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [openFaqIndices, setOpenFaqIndices] = useState({ 0: true });

  const selectedCurr = CURRENCIES.find((c) => c.value === currency) || CURRENCIES[0];

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError('');
    setResultData(null);
    setCopiedSummary(false);
  };

  const handleReset = () => {
    setTotalCost('');
    setImpressions('');
    setTargetCpm('');
    setResultData(null);
    setError('');
    setCopiedSummary(false);
  };

  const applyPreset = (presetCost, presetImp, presetCpm) => {
    setError('');
    setCopiedSummary(false);
    if (mode === 'cpm') {
      setTotalCost(String(presetCost));
      setImpressions(String(presetImp));
      const res = validateAndCalculateCPM({ mode: 'cpm', totalCost: presetCost, impressions: presetImp });
      setResultData(res);
    } else if (mode === 'spend') {
      setTargetCpm(String(presetCpm));
      setImpressions(String(presetImp));
      const res = validateAndCalculateCPM({ mode: 'spend', targetCpm: presetCpm, impressions: presetImp });
      setResultData(res);
    } else if (mode === 'impressions') {
      setTotalCost(String(presetCost));
      setTargetCpm(String(presetCpm));
      const res = validateAndCalculateCPM({ mode: 'impressions', totalCost: presetCost, targetCpm: presetCpm });
      setResultData(res);
    }
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    setResultData(null);
    setCopiedSummary(false);

    const calculation = validateAndCalculateCPM({ mode, totalCost, targetCpm, impressions });

    if (calculation.error) {
      setError(calculation.error);
      return;
    }

    setResultData(calculation);
  };

  const getBenchmarkTier = (cpmValueUsd) => {
    if (!cpmValueUsd || isNaN(cpmValueUsd)) return null;
    if (cpmValueUsd < 3.0) {
      return {
        label: t('cpmCalculator.results.benchmarkLow', 'Low / Cost-Efficient CPM'),
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        desc: t(
          'cpmCalculator.results.benchmarkLowDesc',
          'Below typical auction median. Common in broad brand awareness, video views, or emerging Tier-3 markets.'
        ),
      };
    }
    if (cpmValueUsd <= 7.0) {
      return {
        label: t('cpmCalculator.results.benchmarkTypical', 'Typical Auction CPM'),
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
        desc: t(
          'cpmCalculator.results.benchmarkTypicalDesc',
          'Within normal range ($3.00 – $7.00) for standard In-Feed auction ads in mainstream markets.'
        ),
      };
    }
    if (cpmValueUsd <= 12.0) {
      return {
        label: t('cpmCalculator.results.benchmarkCompetitive', 'Competitive / Conversion CPM'),
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        desc: t(
          'cpmCalculator.results.benchmarkCompetitiveDesc',
          'Above average ($7.00 – $12.00). Typical for lead generation, app installs, and competitive ecommerce niches.'
        ),
      };
    }
    return {
      label: t('cpmCalculator.results.benchmarkPremium', 'Premium / High-Intent CPM'),
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
      desc: t(
        'cpmCalculator.results.benchmarkPremiumDesc',
        'Premium tier ($12.00+). Common in competitive niches (finance, SaaS), Spark Ads with high intent, or TopView takeovers.'
      ),
    };
  };

  const copyRateSummary = async () => {
    if (!resultData || resultData.result === null) return;
    const symbol = selectedCurr.symbol;

    let summaryText = `TikTok CPM Calculation Summary (KalkulatorTik):\n`;
    if (mode === 'cpm') {
      const formattedCpm = resultData.result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      summaryText += `• Calculated CPM: ${symbol}${formattedCpm} per 1,000 impressions\n`;
      summaryText += `• Ad Spend: ${symbol}${Number(resultData.costNum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
      summaryText += `• Impressions: ${Math.round(resultData.impNum).toLocaleString()}\n`;
    } else if (mode === 'spend') {
      const formattedSpend = resultData.result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      summaryText += `• Required Ad Spend: ${symbol}${formattedSpend}\n`;
      summaryText += `• Target CPM: ${symbol}${Number(resultData.cpmNum).toFixed(2)}\n`;
      summaryText += `• Target Impressions: ${Math.round(resultData.impNum).toLocaleString()}\n`;
    } else if (mode === 'impressions') {
      summaryText += `• Delivered Impressions: ${Math.round(resultData.result).toLocaleString()}\n`;
      summaryText += `• Ad Spend Budget: ${symbol}${Number(resultData.costNum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
      summaryText += `• Target CPM: ${symbol}${Number(resultData.cpmNum).toFixed(2)}\n`;
    }
    summaryText += `• Verified at: https://www.kalkulatortik.com/tiktok-cpm-calculator`;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(summaryText);
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 3000);
      }
    } catch {
      // Fallback silent handle
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('cpm-workbench');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors">
      <div className="container mx-auto max-w-5xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        
        {/* Header / Hero Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-sm mb-4">
            <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" aria-hidden="true" />
            3-Way Media Planning Tool
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {t('cpmCalculator.title', 'TikTok CPM Calculator')}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            {t(
              'cpmCalculator.subtitle',
              'Calculate Cost Per Mille (CPM), required ad spend budget, or delivered impressions across multiple currencies with auction benchmarks.'
            )}
          </p>
        </div>

        {/* Interactive 3-in-1 Calculator Workbench */}
        <div id="cpm-workbench" className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm sm:p-7 md:p-8 transition-colors">
          
          {/* Mode Selector Tabs */}
          <div role="tablist" aria-label="Calculation Mode" className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1.5 mb-6 border border-slate-200/80">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'cpm'}
              onClick={() => handleModeChange('cpm')}
              className={`rounded-lg py-2.5 text-xs sm:text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer ${
                mode === 'cpm'
                  ? 'bg-white text-teal-800 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {t('cpmCalculator.modes.cpm', 'Solve for CPM')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'spend'}
              onClick={() => handleModeChange('spend')}
              className={`rounded-lg py-2.5 text-xs sm:text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer ${
                mode === 'spend'
                  ? 'bg-white text-teal-800 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {t('cpmCalculator.modes.spend', 'Solve for Ad Spend')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'impressions'}
              onClick={() => handleModeChange('impressions')}
              className={`rounded-lg py-2.5 text-xs sm:text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer ${
                mode === 'impressions'
                  ? 'bg-white text-teal-800 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {t('cpmCalculator.modes.impressions', 'Solve for Impressions')}
            </button>
          </div>

          {/* Quick Presets Strip */}
          <div className="mb-6 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('cpmCalculator.presets.label', 'Quick Presets:')}
            </span>
            <button
              type="button"
              onClick={() => applyPreset(500, 100000, 5.0)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:border-teal-400 hover:bg-teal-50/50 hover:text-teal-800 transition cursor-pointer"
            >
              {t('cpmCalculator.presets.awareness', 'Awareness ($500 / 100K imps)')}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(1200, 250000, 4.8)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:border-teal-400 hover:bg-teal-50/50 hover:text-teal-800 transition cursor-pointer"
            >
              {t('cpmCalculator.presets.traffic', 'Traffic ($1,200 / 250K imps)')}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(2500, 200000, 12.5)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:border-teal-400 hover:bg-teal-50/50 hover:text-teal-800 transition cursor-pointer"
            >
              {t('cpmCalculator.presets.conversions', 'Conversions ($2,500 / 200K imps)')}
            </button>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Input: Total Ad Spend (needed in 'cpm' and 'impressions') */}
              {(mode === 'cpm' || mode === 'impressions') && (
                <div>
                  <label htmlFor="totalCost" className="block text-xs font-semibold text-slate-800 mb-1.5 sm:text-sm">
                    {t('cpmCalculator.form.totalCost', 'Total Ad Spend')} ({selectedCurr.symbol})
                  </label>
                  <input
                    id="totalCost"
                    type="text"
                    inputMode="decimal"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    placeholder={t('cpmCalculator.form.placeholderCost', 'e.g., 500 or 1,200')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:py-3 sm:text-base placeholder:text-slate-400 font-mono"
                  />
                </div>
              )}

              {/* Input: Target CPM (needed in 'spend' and 'impressions') */}
              {(mode === 'spend' || mode === 'impressions') && (
                <div>
                  <label htmlFor="targetCpm" className="block text-xs font-semibold text-slate-800 mb-1.5 sm:text-sm">
                    {t('cpmCalculator.form.targetCpm', 'Target CPM')} ({selectedCurr.symbol})
                  </label>
                  <input
                    id="targetCpm"
                    type="text"
                    inputMode="decimal"
                    value={targetCpm}
                    onChange={(e) => setTargetCpm(e.target.value)}
                    placeholder={t('cpmCalculator.form.placeholderCpm', 'e.g., 5.00')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:py-3 sm:text-base placeholder:text-slate-400 font-mono"
                  />
                </div>
              )}

              {/* Input: Ad Impressions (needed in 'cpm' and 'spend') */}
              {(mode === 'cpm' || mode === 'spend') && (
                <div>
                  <label htmlFor="impressions" className="block text-xs font-semibold text-slate-800 mb-1.5 sm:text-sm">
                    {t('cpmCalculator.form.impressions', 'Number of Ad Impressions')}
                  </label>
                  <input
                    id="impressions"
                    type="text"
                    inputMode="text"
                    value={impressions}
                    onChange={(e) => setImpressions(e.target.value)}
                    placeholder={t('cpmCalculator.form.placeholderImpressions', 'e.g., 100,000 or 100K')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:py-3 sm:text-base placeholder:text-slate-400 font-mono"
                  />
                </div>
              )}

              {/* Currency Selector */}
              <div>
                <label htmlFor="currency" className="block text-xs font-semibold text-slate-800 mb-1.5 sm:text-sm">
                  {t('cpmCalculator.form.currency', 'Currency')}
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:py-3 sm:text-base"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div role="alert" className="p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs font-semibold text-red-800 sm:text-sm">{error}</p>
              </div>
            )}

            {/* Submit & Reset Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold py-3 px-5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 sm:text-base cursor-pointer shadow-sm"
              >
                {t('cpmCalculator.form.calculate', 'Calculate')}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 transition cursor-pointer"
              >
                {t('cpmCalculator.form.reset', 'Reset')}
              </button>
            </div>

            {/* Live Result Output Presentation */}
            {resultData && resultData.result !== null && (
              <div className="mt-6 rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50/90 to-white p-5 sm:p-7 shadow-sm border-t-4 border-t-teal-600 animate-fadeIn transition-all">
                <div className="text-center">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal-800">
                    {mode === 'cpm' && t('cpmCalculator.results.cpmLabel', 'CALCULATED TIKTOK CPM')}
                    {mode === 'spend' && t('cpmCalculator.results.spendLabel', 'REQUIRED AD SPEND BUDGET')}
                    {mode === 'impressions' && t('cpmCalculator.results.impressionsLabel', 'ESTIMATED AD IMPRESSIONS')}
                  </span>

                  {/* Primary Calculated Metric */}
                  <p className="my-2 text-3xl font-extrabold text-teal-900 font-display tabular-nums sm:text-4xl md:text-5xl">
                    {mode === 'cpm' &&
                      `${selectedCurr.symbol}${resultData.result.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    {mode === 'spend' &&
                      `${selectedCurr.symbol}${resultData.result.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    {mode === 'impressions' && Math.round(resultData.result).toLocaleString()}
                  </p>

                  <p className="text-xs text-slate-600 sm:text-sm max-w-lg mx-auto">
                    {mode === 'cpm' && t('cpmCalculator.costPerThousand', 'Cost per 1,000 impressions')}
                    {mode === 'spend' &&
                      `Total ad spend needed to generate ${Math.round(resultData.impNum).toLocaleString()} impressions at ${selectedCurr.symbol}${Number(resultData.cpmNum).toFixed(2)} CPM.`}
                    {mode === 'impressions' &&
                      `Delivered ad impressions for a ${selectedCurr.symbol}${Number(resultData.costNum).toLocaleString()} budget at ${selectedCurr.symbol}${Number(resultData.cpmNum).toFixed(2)} CPM.`}
                  </p>

                  {/* Dynamic Benchmark Context Badge (for CPM mode or target CPM) */}
                  {(() => {
                    const cpmUsd = mode === 'cpm' ? resultData.result : resultData.cpmNum;
                    const tier = getBenchmarkTier(cpmUsd);
                    if (!tier) return null;
                    return (
                      <div className="mt-4 pt-4 border-t border-teal-100 flex flex-col items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tier.badgeClass}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                          {tier.label}
                        </span>
                        <p className="text-xs text-slate-500 max-w-md">{tier.desc}</p>
                      </div>
                    );
                  })()}

                  {/* Mathematical Trace Box */}
                  <div className="mt-4 rounded-xl border border-slate-200/90 bg-white/80 p-3 text-left font-mono text-xs text-slate-700">
                    <span className="font-sans font-semibold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
                      {t('cpmCalculator.results.formulaTrace', 'Formula Applied:')}
                    </span>
                    {mode === 'cpm' && (
                      <span>
                        ({selectedCurr.symbol}{Number(resultData.costNum * selectedCurr.rate).toLocaleString()} ÷ {Math.round(resultData.impNum).toLocaleString()} impressions) × 1,000 = {selectedCurr.symbol}{(resultData.result * selectedCurr.rate).toFixed(2)} CPM
                      </span>
                    )}
                    {mode === 'spend' && (
                      <span>
                        ({selectedCurr.symbol}{Number(resultData.cpmNum * selectedCurr.rate).toFixed(2)} CPM × {Math.round(resultData.impNum).toLocaleString()} impressions) ÷ 1,000 = {selectedCurr.symbol}{(resultData.result * selectedCurr.rate).toFixed(2)} Total Budget
                      </span>
                    )}
                    {mode === 'impressions' && (
                      <span>
                        ({selectedCurr.symbol}{Number(resultData.costNum * selectedCurr.rate).toLocaleString()} Spend ÷ {selectedCurr.symbol}{Number(resultData.cpmNum * selectedCurr.rate).toFixed(2)} CPM) × 1,000 = {Math.round(resultData.result).toLocaleString()} Impressions
                      </span>
                    )}
                  </div>

                  {/* Copy Rate Summary Button */}
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={copyRateSummary}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer shadow-sm"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {copiedSummary ? t('cpmCalculator.form.copied', 'Copied to Clipboard!') : t('cpmCalculator.form.copySummary', 'Copy Rate Summary')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ===================================================================
            SECTION 1 — WHAT IS TIKTOK CPM AND HOW DOES IT WORK?
           =================================================================== */}
        <section
          id="what-is-cpm"
          aria-labelledby="section-1-heading"
          className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:mt-16 sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-1-heading"
            icon="calculator"
            title={t('cpmCalculator.content.whatIsTikTokCPM.title', 'What Is TikTok CPM and How Does It Work?')}
            description={t(
              'cpmCalculator.content.whatIsTikTokCPM.description',
              "TikTok CPM stands for Cost Per Mille, which is the standard advertising metric indicating what it costs to deliver 1,000 impressions on TikTok. An impression is registered whenever your ad or sponsored video is displayed on a user's screen."
            )}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-800 font-display">
                Why 1,000 Impressions Is the Standard
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                In digital advertising, single impressions cost tiny fractions of a cent (e.g. $0.005). Measuring costs in blocks of 1,000 (&quot;mille&quot; in Latin) provides a clean, standardized baseline for media buyers to compare efficiency across campaigns, placements, and competing ad platforms.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-800 font-display">
                Ad Impressions vs. Video Views
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                An <strong>impression</strong> is counted the instant a video ad renders on a user&apos;s screen. A <strong>video view</strong> on TikTok requires the viewer to watch for at least 2 or 6 seconds depending on the objective. Total impressions are therefore always equal to or higher than total completed views.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 2 — THE 3-WAY TIKTOK CPM MATHEMATICAL FORMULAS
           =================================================================== */}
        <section
          id="cpm-formula"
          aria-labelledby="section-2-heading"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-2-heading"
            icon="formula"
            title={t('cpmCalculator.content.formula.title', 'The 3-Way TikTok CPM Calculation Formulas')}
            description={t(
              'cpmCalculator.content.formula.description',
              'The relationship between total ad cost, impressions, and CPM is mathematically linked. Depending on which two variables you already know, you can solve for the third using these three standard media-buying equations:'
            )}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">Mode 1</span>
                <h3 className="text-base font-bold text-slate-800 font-display">Solve for CPM</h3>
                <p className="mt-1.5 text-xs text-slate-600">Calculates cost efficiency per 1,000 delivered impressions.</p>
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-semibold text-slate-900">
                CPM = (Cost ÷ Impressions) × 1,000
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">Mode 2</span>
                <h3 className="text-base font-bold text-slate-800 font-display">Solve for Ad Spend</h3>
                <p className="mt-1.5 text-xs text-slate-600">Determines required budget given a target CPM and reach goal.</p>
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-semibold text-slate-900">
                Cost = (Target CPM × Impressions) ÷ 1,000
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">Mode 3</span>
                <h3 className="text-base font-bold text-slate-800 font-display">Solve for Impressions</h3>
                <p className="mt-1.5 text-xs text-slate-600">Calculates estimated reach achievable with a fixed budget.</p>
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-semibold text-slate-900">
                Impressions = (Cost ÷ Target CPM) × 1,000
              </div>
            </div>
          </div>

          {/* Worked Trace Example */}
          <div className="mt-7 rounded-xl border border-teal-100 bg-teal-50/50 p-5 sm:p-6">
            <h3 className="text-base font-bold text-teal-900 font-display">
              {t('cpmCalculator.content.formula.workedExampleTitle', 'Step-by-Step Numerical Walkthrough')}
            </h3>
            <p className="mt-1 text-xs text-slate-700 sm:text-sm">
              {t(
                'cpmCalculator.content.formula.exampleIntro',
                'Suppose a brand budgets $1,200 for a TikTok In-Feed campaign and delivers 250,000 impressions:'
              )}
            </p>
            <ol className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
              <li className="rounded-lg bg-white p-3 border border-slate-200/60 font-mono">
                1. Total Ad Spend = $1,200 USD
              </li>
              <li className="rounded-lg bg-white p-3 border border-slate-200/60 font-mono">
                2. Ad Impressions = 250,000
              </li>
              <li className="rounded-lg bg-white p-3 border border-slate-200/60 font-mono">
                3. Cost per single impression = $1,200 ÷ 250,000 = $0.0048
              </li>
              <li className="rounded-lg bg-white p-3 border border-slate-200/60 font-mono">
                4. Multiply by 1,000 = $0.0048 × 1,000 = <strong>$4.80 CPM</strong>
              </li>
            </ol>
            <p className="mt-3 text-xs text-teal-800 font-medium">
              Conclusion: The advertiser pays an average of $4.80 for every 1,000 times the sponsored video renders on user feeds.
            </p>
          </div>
        </section>

        {/* ===================================================================
            SECTION 3 — TIKTOK AD CPM VS. CREATOR RPM VS. SPONSORSHIP CPM
           =================================================================== */}
        <section
          id="cpm-vs-rpm"
          aria-labelledby="section-3-heading"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-3-heading"
            icon="scales"
            title={t(
              'cpmCalculator.content.adCpmVsCreatorRpm.title',
              'TikTok Ad CPM vs. Creator RPM vs. Sponsorship CPM'
            )}
            description={t(
              'cpmCalculator.content.adCpmVsCreatorRpm.description',
              'One of the most frequent points of confusion on TikTok is mixing up what advertisers pay with what creators earn. While all three metrics express cost or revenue per 1,000 views, they measure completely different transactions:'
            )}
          />

          {/* Mobile Scroll Hint */}
          <div className="mt-6 flex items-center justify-between gap-1 pb-1 text-[11px] font-medium text-slate-500 sm:hidden">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-teal-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>Swipe table horizontally &rarr;</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">5 columns</span>
          </div>

          <div className="table-scroll-container rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[650px] w-full border-collapse text-left text-xs sm:text-sm">
              <caption className="sr-only">Comparison of TikTok Ad CPM, Creator RPM, and Brand Sponsorship CPM</caption>
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-bold text-slate-900 min-w-[140px]">Metric</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-bold text-slate-900 min-w-[130px]">Perspective</th>
                  <th scope="col" className="px-4 py-3 font-bold text-slate-900 min-w-[160px]">Who Pays?</th>
                  <th scope="col" className="px-4 py-3 font-bold text-slate-900 min-w-[160px]">Denominator / Basis</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-bold text-slate-900 min-w-[130px]">Typical Range (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-white">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-teal-800">TikTok Ad CPM</th>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">Advertiser / Brand</td>
                  <td className="px-4 py-3 text-slate-700">Advertiser pays TikTok Ads Manager</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">Per 1,000 Ad Impressions</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-900 font-mono font-semibold">$3.00 – $10.00</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-teal-800">Creator Rewards RPM</th>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">Creator / Publisher</td>
                  <td className="px-4 py-3 text-slate-700">TikTok pays Creator</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">Per 1,000 Qualified Views (&gt;1 min)</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-900 font-mono font-semibold">$0.40 – $1.80</td>
                </tr>
                <tr className="bg-white">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-teal-800">Sponsorship CPM</th>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">Influencer / Creator</td>
                  <td className="px-4 py-3 text-slate-700">Brand pays Creator directly</td>
                  <td className="px-4 py-3 text-slate-700 font-mono">Per 1,000 Expected Views</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-900 font-mono font-semibold">$12.00 – $42.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-900 sm:text-sm">
            <strong>Key Insight:</strong> Never confuse Creator Rewards RPM with Ad CPM. TikTok retains a substantial platform share and only monetizes qualified, non-fraudulent views lasting over 5 seconds on 1-minute+ videos.
          </div>
        </section>

        {/* ===================================================================
            SECTION 4 — AVERAGE TIKTOK CPM RATES & OBJECTIVE BENCHMARKS
           =================================================================== */}
        <section
          id="cpm-benchmarks"
          aria-labelledby="section-4-heading"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-4-heading"
            icon="chart"
            title={t('cpmCalculator.content.averageRates.title', 'Average TikTok CPM Rates & Objective Benchmarks')}
            description={t(
              'cpmCalculator.content.averageRates.description',
              'TikTok auction CPM rates are dynamic. Bids fluctuate based on campaign objective, audience demographics, target country, and industry competition. The table below outlines standard benchmarks across major marketing objectives in Tier-1 markets (US, UK, CA, AU):'
            )}
          />

          {/* Mobile Scroll Hint */}
          <div className="mt-6 flex items-center justify-between gap-1 pb-1 text-[11px] font-medium text-slate-500 sm:hidden">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-teal-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>Swipe table horizontally &rarr;</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">3 columns</span>
          </div>

          <div className="table-scroll-container rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[580px] w-full border-collapse text-left text-xs sm:text-sm">
              <caption className="sr-only">TikTok Advertising CPM Benchmarks by Campaign Objective</caption>
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-bold text-slate-900 min-w-[190px]">Campaign Objective</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-bold text-slate-900 min-w-[160px]">Typical Benchmark (USD)</th>
                  <th scope="col" className="px-4 py-3 font-bold text-slate-900 min-w-[230px]">Targeting & Strategy Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-white">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-slate-800">Brand Awareness & Reach</th>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-teal-800">$1.50 – $3.50</td>
                  <td className="px-4 py-3 text-slate-600">Broadest audience reach; lowest cost per impression.</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-slate-800">Video Views & Hook Focus</th>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-teal-800">$2.00 – $4.50</td>
                  <td className="px-4 py-3 text-slate-600">Optimized for watch time and 2s / 6s completion rate.</td>
                </tr>
                <tr className="bg-white">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-slate-800">Traffic & Landing Page Clicks</th>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-teal-800">$3.00 – $6.50</td>
                  <td className="px-4 py-3 text-slate-600">Targets users likely to click external link buttons.</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-slate-800">Lead Generation & App Installs</th>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-teal-800">$5.00 – $9.00</td>
                  <td className="px-4 py-3 text-slate-600">Higher bid density due to direct conversion value.</td>
                </tr>
                <tr className="bg-white">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-slate-800">Conversions & Catalog Sales</th>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-teal-800">$7.00 – $14.00+</td>
                  <td className="px-4 py-3 text-slate-600">High intent; competitive auction bids in checkout funnels.</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <th scope="row" className="whitespace-nowrap px-4 py-3 font-bold text-slate-800">Spark Ads (Creator UGC Boost)</th>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-teal-800">$3.50 – $7.50</td>
                  <td className="px-4 py-3 text-slate-600">High organic engagement frequently lowers effective CPM.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs leading-relaxed text-slate-600 sm:text-sm">
            <strong>Geographic Market Tiers:</strong> Tier-1 countries (United States, United Kingdom, Canada, Australia) typically exhibit CPMs between $5.00 and $12.00, Tier-2 countries (Western Europe, Japan) range from $3.00 to $7.00, and Tier-3 emerging markets often see CPMs between $0.50 and $2.50.
          </div>
        </section>

        {/* ===================================================================
            SECTION 5 — KEY FACTORS DRIVING TIKTOK CPM UP OR DOWN
           =================================================================== */}
        <section
          id="cpm-drivers"
          aria-labelledby="section-5-heading"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-5-heading"
            icon="gears"
            title={t('cpmCalculator.content.drivers.title', 'Key Factors That Drive TikTok CPM Up or Down')}
            description={t(
              'cpmCalculator.content.drivers.description',
              "TikTok's ad auction uses an automated bidding algorithm that balances bid price, estimated action rate, and ad quality. These five factors have the greatest influence on your final CPM:"
            )}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <span className="font-mono text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">01 / Location</span>
              <h3 className="text-base font-bold text-slate-800 font-display">Target Geography</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Targeting users in high purchasing-power markets (US, UK, Germany) increases CPM because more advertisers compete for the same user feeds.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <span className="font-mono text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">02 / Industry</span>
              <h3 className="text-base font-bold text-slate-800 font-display">Industry & Vertical</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                High customer lifetime value niches—finance, SaaS, beauty, luxury—command much higher CPMs than general entertainment or gaming.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <span className="font-mono text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">03 / Quality</span>
              <h3 className="text-base font-bold text-slate-800 font-display">Creative Quality & CTR</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                TikTok rewards ads that keep users watching. Videos with strong 2-second hooks and high completion rates earn quality discounts in the auction.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <span className="font-mono text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">04 / Season</span>
              <h3 className="text-base font-bold text-slate-800 font-display">Seasonality & Holidays</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                CPMs peak in Q4 (Black Friday, Cyber Monday, Christmas) as retail budgets flood the auction, then reset to annual lows in January (Q1).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 md:col-span-2 lg:col-span-2">
              <span className="font-mono text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">05 / Format</span>
              <h3 className="text-base font-bold text-slate-800 font-display">Ad Placement & Format Type</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Standard In-Feed auction ads are the most cost-effective. Spark Ads (boosting organic creator UGC) often generate higher CTR and lower effective CPM, while TopView full-screen takeovers require fixed high-dollar investments.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 6 — 5 PROVEN STRATEGIES TO LOWER YOUR TIKTOK AD CPM
           =================================================================== */}
        <section
          id="lower-cpm-tips"
          aria-labelledby="section-6-heading"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-6-heading"
            icon="lightbulb"
            title={t('cpmCalculator.content.strategies.title', '5 Proven Strategies to Lower Your TikTok Ad CPM')}
            description={t(
              'cpmCalculator.content.strategies.intro',
              'To improve campaign cost-efficiency and get more impressions from your budget, apply these proven media-buying practices:'
            )}
          />

          <div className="mt-6 space-y-3.5">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-900 font-display">
                1. Hook Viewers in the First 2 Seconds
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 sm:text-sm leading-relaxed">
                TikTok&apos;s algorithm prioritizes watch retention. Videos that prevent immediate swipe-aways earn higher relevance scores, which directly discounts auction costs.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-900 font-display">
                2. Leverage Spark Ads Over Standard In-Feed Commercials
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 sm:text-sm leading-relaxed">
                Spark Ads allow you to boost real creator posts. Because they retain authentic comments, likes, and music attribution, they often generate 20–40% higher CTR and lower CPM.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-900 font-display">
                3. Avoid Over-Narrow Audience Restrictions Early On
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 sm:text-sm leading-relaxed">
                Stacking too many narrow interests or demographic exclusions restricts auction liquidity and forces higher CPMs. Allow the TikTok algorithm to find optimal pockets of reach.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-900 font-display">
                4. Refresh Creative Assets Every 7 to 14 Days
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 sm:text-sm leading-relaxed">
                Creative fatigue occurs rapidly on TikTok. When CTR drops, CPM automatically increases. Rotating fresh video angles regularly sustains optimal cost efficiency.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-900 font-display">
                5. Optimize for TikTok-Native 9:16 Vertical Video
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 sm:text-sm leading-relaxed">
                Repurposed horizontal commercials look out of place. Native vertical videos with trending sounds, quick cuts, and captions achieve higher engagement and lower CPM.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 7 — CPM VS CPC, CPV, AND CTR COMPARISON
           =================================================================== */}
        <section
          id="cpm-vs-cpc"
          aria-labelledby="section-7-heading"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-7-heading"
            icon="metrics"
            title={t('cpmCalculator.content.metricsComparison.title', 'TikTok CPM vs. CPC, CPV, and CTR: Key Metric Comparisons')}
            description={t(
              'cpmCalculator.content.metricsComparison.description',
              'CPM is one component of your overall TikTok advertising scorecard. Here is how it connects with other primary performance indicators:'
            )}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-800 font-display">CPM vs. CPC</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed sm:text-sm">
                <strong>CPM (Cost Per Mille)</strong> measures visibility cost, while <strong>CPC (Cost Per Click)</strong> measures action cost. If CPM is low but CPC is high, your ad reaches people but fails to compel them to visit your link.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-800 font-display">CPM vs. CPV</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed sm:text-sm">
                <strong>CPV (Cost Per View)</strong> bills when a user watches 2 or 6 seconds of video. CPM measures raw screen impressions regardless of watch duration. CPV is ideal for assessing hook retention.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
              <h3 className="text-base font-bold text-slate-800 font-display">CPM and CTR</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed sm:text-sm">
                <strong>CTR (Click-Through Rate)</strong> is the percentage of impressions that turn into clicks. A higher CTR boosts your ad quality score in the auction, which actively lowers your future CPM.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 8 — RELATED TIKTOK CALCULATORS (INTERNAL CROSS-LINKING)
           =================================================================== */}
        <section
          id="related-tools"
          aria-labelledby="section-8-heading"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-8-heading"
            icon="tools"
            title={t('cpmCalculator.content.relatedTools.title', 'Explore More Free TikTok Calculators')}
            description={t(
              'cpmCalculator.content.relatedTools.description',
              'Combine CPM planning with our companion tools to evaluate creator rates and audience engagement:'
            )}
          />

          {(() => {
            const moneyRaw = t(
              'cpmCalculator.content.relatedTools.moneyCalculator',
              'TikTok Money Calculator: Look up any public TikTok profile by username to calculate estimated single-video brand sponsorship valuation based on real views and engagement.'
            );
            const [moneyTitle, ...moneyDescParts] = moneyRaw.split(': ');
            const moneyDesc = moneyDescParts.join(': ') || moneyRaw;

            const engRaw = t(
              'cpmCalculator.content.relatedTools.engagementCalculator',
              'TikTok Engagement Rate Calculator: Calculate exact engagement depth using total likes, video counts, and follower totals with zero login.'
            );
            const [engTitle, ...engDescParts] = engRaw.split(': ');
            const engDesc = engDescParts.join(': ') || engRaw;

            return (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-5 flex flex-col justify-between hover:border-teal-300 transition">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      <Link to="/" className="hover:text-teal-700 transition">
                        {moneyTitle}
                      </Link>
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed sm:text-sm">
                      {moneyDesc}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 underline underline-offset-2"
                    >
                      {moneyTitle} &rarr;
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-5 flex flex-col justify-between hover:border-teal-300 transition">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      <Link to="/tiktok-engagement-calculator" className="hover:text-teal-700 transition">
                        {engTitle}
                      </Link>
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed sm:text-sm">
                      {engDesc}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/tiktok-engagement-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 underline underline-offset-2"
                    >
                      {engTitle} &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* ===================================================================
            SECTION 9 — FREQUENTLY ASKED QUESTIONS (FAQS)
           =================================================================== */}
        <section
          id="faq"
          aria-labelledby="section-9-heading"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-9-heading"
            icon="faq"
            title={t('cpmCalculator.content.faq.title', 'Frequently Asked Questions About TikTok CPM')}
            description="Clear, verified answers to common questions about TikTok CPM calculation, auction benchmarks, and campaign budgeting."
          />

          <div id="cpm-faq" className="mt-6 space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = Boolean(openFaqIndices[idx]);
              const panelId = `cpm-faq-panel-${idx}`;
              return (
                <article
                  key={idx}
                  className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/60 transition-colors hover:border-slate-300"
                >
                  <h3 className="m-0 font-display text-sm font-bold text-slate-900 sm:text-base">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm font-bold text-slate-900 transition-colors hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:px-6 sm:py-[18px] sm:text-base"
                    >
                      <span>{item.q}</span>
                      <span
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors group-hover:border-slate-300 group-hover:text-slate-700"
                        aria-hidden="true"
                      >
                        <svg
                          className={`h-3.5 w-3.5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div id={panelId} hidden={!isOpen} className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-600 sm:px-6 sm:pb-6 sm:text-sm">
                    <p>{item.a}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ===================================================================
            SECTION 10 — CLOSING CTA
           =================================================================== */}
        <section
          id="cpm-closing-cta"
          aria-labelledby="section-10-heading"
          className="mt-10 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-slate-50 to-white p-6 text-center shadow-sm sm:p-8 lg:p-10"
        >
          <div className="mx-auto max-w-2xl">
            <h2 id="section-10-heading" className="font-display text-xl font-bold tracking-tight text-teal-900 sm:text-2xl md:text-3xl">
              {t('cpmCalculator.content.closing.title', 'Ready to Benchmark Your TikTok CPM & Ad Reach?')}
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm md:text-base">
              {t(
                'cpmCalculator.content.closing.description',
                'Use the calculator above to test your campaign budget scenarios, or explore our companion tools to evaluate creator rates and engagement metrics.'
              )}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={scrollToCalculator}
                className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer"
              >
                {t('cpmCalculator.content.closing.button', 'Return to Calculator')}
              </button>
              <Link
                to="/"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition"
              >
                TikTok Money Calculator
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default TikTokCPMCalculator;
