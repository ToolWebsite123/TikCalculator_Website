import React, { useState } from 'react';
import Link from './LocaleLink';
import { useActiveLang } from '../contexts/LocaleContext';
import {
  DATE_LOCALE_BY_LANG,
  useHomeLocalePack,
} from '../locales/homeContentRegistry';

const ACCOUNT_METRICS_GUIDE = [
  {
    name: 'Followers',
    tag: 'Audience Reach',
    description:
      'Total TikTok accounts following the creator. Indicates audience size and social proof, applying a secondary scale multiplier.',
  },
  {
    name: 'Total Likes',
    tag: 'Lifetime Likes',
    description:
      'Cumulative likes across all public videos currently on the profile.',
  },
  {
    name: 'Total Videos',
    tag: 'Uploaded Videos',
    description:
      'Total number of public videos published on the account.',
  },
  {
    name: 'Following',
    tag: 'Accounts Followed',
    description:
      'Total number of profiles the creator follows.',
  },
  {
    name: 'Est. Avg Views',
    tag: 'Views per Video',
    description:
      'Mean views per video from recent public uploads, or estimated from follower count when recent video views are unavailable.',
  },
  {
    name: 'Engagement',
    tag: 'Interaction Rate',
    description:
      'Combined likes, comments, and shares divided by total video views across sampled recent videos (or estimated from total likes, videos, and followers in fallback mode).',
  },
];

const CPM_TIERS_DATA = [
  {
    tier: 'Tier 1 Markets',
    regions: 'US, CA, UK, GB, AU, NZ, DE',
    min: '$22.00',
    avg: '$30.00',
    max: '$42.00',
    featured: true,
  },
  {
    tier: 'Tier 2 Markets',
    regions: 'FR, ES, IT, PT, BR, MX, SG, NL, BE, SE, NO, DK, FI, IE, CH',
    min: '$16.00',
    avg: '$22.00',
    max: '$32.00',
    featured: false,
  },
  {
    tier: 'Tier 3 / Global Default',
    regions: 'All other regions or when no region code is present on the profile',
    min: '$12.00',
    avg: '$18.00',
    max: '$26.00',
    featured: false,
  },
];

const FOLLOWER_SCALE_TIERS = [
  { range: 'Up to 10,000 followers', factor: '1.00x' },
  { range: '10,001 to 100,000 followers', factor: '1.02x' },
  { range: '100,001 to 500,000 followers', factor: '1.08x' },
  { range: '500,001 to 2,000,000 followers', factor: '1.12x' },
  { range: 'Over 2,000,000 followers', factor: '1.18x' },
];

const CHANNEL_COMPARISON_ROWS = [
  {
    feature: 'Payment Source',
    sponsorships: 'External brands, advertisers, or marketing agencies',
    rewards: 'TikTok (ByteDance) directly via in-app creator balance',
  },
  {
    feature: 'Pricing / Payout Metric',
    sponsorships: 'Negotiated fee benchmarked via Sponsorship CPM (Cost Per 1,000 Views)',
    rewards: 'Variable platform RPM (Revenue Per 1,000 Qualified Views) set by TikTok',
  },
  {
    feature: 'Video Length Rules',
    sponsorships: 'Any video length agreed upon in the sponsor brief',
    rewards: "Must meet TikTok's minimum video length and originality rules",
  },
  {
    feature: 'Follower Threshold',
    sponsorships: 'No mandatory platform minimum; depends on brand fit and reach',
    rewards: "Requires meeting TikTok's official follower and 30-day view requirements",
  },
  {
    feature: 'Modeled by KalkulatorTik?',
    sponsorships: 'Yes — Modeled by our homepage TikTok Money Calculator',
    rewards: 'No — Requires private in-app qualified view and RPM data',
    isStatusRow: true,
  },
];

const REAL_WORLD_FACTORS = [
  {
    num: '01',
    title: 'Verified Audience Demographics',
    body: "Profile region codes are only a proxy. Brands typically request TikTok Studio screenshots showing viewer countries, age brackets, and gender splits.",
  },
  {
    num: '02',
    title: 'Content Category or Niche',
    body: 'High-intent verticals—personal finance, software, B2B, skincare, fitness, and tech—generally command higher fees than broad entertainment.',
  },
  {
    num: '03',
    title: 'Deliverables & Production Scope',
    body: 'A 15-second mention in a routine vlog requires less production effort than a scripted 60-second tutorial with custom studio lighting or location shoots.',
  },
  {
    num: '04',
    title: 'Usage Rights & Licensing',
    body: "Baseline fees cover organic posting on the creator's feed. Reposting rights on brand websites, emails, or paid channels warrant an extra licensing fee.",
  },
  {
    num: '05',
    title: 'Spark Ads & Paid Amplification',
    body: 'Sharing a Spark Ads code (whitelisting) puts paid spend behind your handle and likeness—typically billed monthly in 30-, 60-, or 90-day increments.',
  },
  {
    num: '06',
    title: 'Category Exclusivity',
    body: 'Agreeing not to promote competing products for a set window restricts other sponsorship income and justifies an exclusivity premium.',
  },
  {
    num: '07',
    title: 'Multi-Video Campaign Packages',
    body: 'Guaranteeing three to five sponsored posts across a quarter often unlocks a moderate per-video bundle discount in exchange for higher total revenue.',
  },
  {
    num: '08',
    title: 'Timing & Negotiation Leverage',
    body: 'Peak retail seasons, tight turnarounds, creator demand, and proven past campaign conversions routinely shift final negotiated contract fees.',
  },
];

const CREATOR_COMPARISON_ROWS = [
  {
    metric: 'Total Followers',
    creatorA: '500,000 followers',
    creatorB: '50,000 followers',
    insight: 'Creator A has 10× more followers than Creator B.',
  },
  {
    metric: 'Follower Scale Factor',
    creatorA: '1.08x (>100K tier)',
    creatorB: '1.02x (>10K tier)',
    insight: 'Creator A receives a higher follower scale multiplier.',
  },
  {
    metric: 'Average Video Views',
    creatorA: '8,000 views per video',
    creatorB: '65,000 views per video',
    insight: 'Creator B delivers more than 8× the video views per post.',
  },
  {
    metric: 'Engagement Rate',
    creatorA: '1.20% interaction rate',
    creatorB: '9.40% interaction rate',
    insight: "Creator B's viewers actively like, comment, and share.",
  },
  {
    metric: 'Engagement Factor',
    creatorA: '0.924x',
    creatorB: '1.088x',
    insight: "Strong engagement lifts Creator B's CPM multiplier.",
  },
  {
    metric: 'Profile Region Tier',
    creatorA: 'Tier 3 / Global ($18.00 base avg CPM)',
    creatorB: 'Tier 1 / US ($30.00 base avg CPM)',
    insight: 'Regional ad market assumptions further separate baseline CPM.',
  },
  {
    metric: 'Adjusted Model CPM',
    creatorA: '$17.96 (Range: $11.98 – $25.95)',
    creatorB: '$33.29 (Range: $24.41 – $46.61)',
    insight: 'Active engagement and market tier nearly double the CPM.',
  },
  {
    metric: 'Estimated Sponsorship Value',
    creatorA: '$143.68 per video ($95.84 – $207.60)',
    creatorB: '$2,163.85 per video ($1,586.65 – $3,029.65)',
    insight: 'Delivered views and engagement drive the higher estimate.',
    highlight: true,
  },
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: '1. What does a TikTok money calculator estimate?',
    schemaAnswer:
      'A TikTok money calculator like KalkulatorTik estimates the potential commercial brand sponsorship earnings for a single sponsored video on a public TikTok profile. Rather than acting as a generic TikTok income calculator for in-app ad shares, it provides a primary per-video dollar benchmark and an estimated low-to-high range representing what an advertiser or agency might pay for a dedicated integration based on public reach, engagement rate, and regional CPM benchmarks.',
    answer: (
      <p>
        A TikTok money calculator like <strong>KalkulatorTik</strong> estimates the{' '}
        <strong>potential commercial brand sponsorship earnings for a single sponsored video</strong> on a public TikTok
        profile. Rather than acting as a generic TikTok income calculator for in-app ad shares, it provides a primary
        per-video dollar benchmark and an estimated low-to-high range representing what an advertiser or agency might
        pay for a dedicated integration based on public reach, engagement rate, and regional CPM benchmarks.
      </p>
    ),
  },
  {
    id: 'faq-2',
    question: '2. Is this estimate the same as TikTok Creator Rewards payouts?',
    schemaAnswer:
      "No. Brand sponsorships and TikTok's Creator Rewards Program are completely separate income streams. Creator Rewards pays eligible creators directly from TikTok based on qualified views on original 1+ minute videos under TikTok's dynamic RPM rates, and requires at least 10,000 followers, 100,000 video views in the last 30 days, age 18+ (or 19+ in South Korea), good standing, and an eligible region. Our homepage calculator estimates private brand sponsorship fees, which are negotiated directly with advertisers and have no fixed follower minimum.",
    answer: (
      <p>
        <strong>No.</strong> Brand sponsorships and TikTok&apos;s Creator Rewards Program are completely separate
        income streams. Creator Rewards pays eligible creators directly from TikTok based on qualified views on
        original <code>1+ minute</code> videos under TikTok&apos;s dynamic RPM rates, and requires at least{' '}
        <code>10,000</code> followers, <code>100,000</code> video views in the last 30 days, age <code>18+</code> (or{' '}
        <code>19+</code> in South Korea), good standing, and an eligible region. Our homepage calculator estimates{' '}
        <strong>private brand sponsorship fees</strong>, which are negotiated directly with advertisers and have no
        fixed follower minimum.
      </p>
    ),
  },
  {
    id: 'faq-3',
    question: '3. How is a TikTok sponsorship estimate calculated on KalkulatorTik?',
    schemaAnswer:
      "Our calculator divides a profile's Average Video Views by 1,000 and multiplies that number by an Adjusted CPM (Cost Per Mille). Starting from our internal regional CPM brackets ($12–$42 across Tier 1–Tier 3 low-to-high ranges, with midpoint baselines of $18–$30), the model applies an engagement multiplier (0.90x to 1.20x) and a follower scale uplift (1.00x to 1.18x), then clamps the final CPM between $7.00 and $80.00.",
    answer: (
      <p>
        Our calculator divides a profile&apos;s <strong>Average Video Views</strong> by <code>1,000</code> and
        multiplies that number by an <strong>Adjusted CPM (Cost Per Mille)</strong>. Starting from our internal regional
        CPM brackets (<code>$12&ndash;$42</code> across Tier 1&ndash;Tier 3 low-to-high ranges, with midpoint baselines
        of <code>$18&ndash;$30</code>), the model applies an engagement multiplier (<code>0.90x</code> to{' '}
        <code>1.20x</code>) and a follower scale uplift (<code>1.00x</code> to <code>1.18x</code>), then clamps the
        final CPM between <code>$7.00</code> and <code>$80.00</code>.
      </p>
    ),
  },
  {
    id: 'faq-4',
    question: '4. Do followers or video views matter more for sponsorship rates?',
    schemaAnswer:
      'Average video views usually matter more for single-video sponsorship pricing because views show how many people are likely to watch the sponsored post. Follower count still provides helpful social proof and adds a small scale uplift in our model, but an account with fewer followers and high, consistent video views will generally command a higher sponsorship benchmark than a large account with low recent viewership.',
    answer: (
      <p>
        <strong>Average video views usually matter more</strong> for single-video sponsorship pricing because views show
        how many people are likely to watch the sponsored post. Follower count still provides helpful social proof and
        adds a small scale uplift in our model, but an account with fewer followers and high, consistent video views
        will generally command a higher sponsorship benchmark than a large account with low recent viewership.
      </p>
    ),
  },
  {
    id: 'faq-5',
    question: '5. Can I calculate sponsorship earnings using only a TikTok username?',
    schemaAnswer:
      "Yes. Because KalkulatorTik works as a TikTok money calculator by username, you only need the creator's handle (with or without the @ symbol) for any Public account. The tool automatically pulls public profile statistics and recent video metrics needed to calculate estimated per-video sponsorship earnings.",
    answer: (
      <p>
        <strong>Yes.</strong> Because KalkulatorTik works as a <strong>TikTok money calculator by username</strong>,
        you only need the creator&apos;s handle (with or without the <code>@</code> symbol) for any{' '}
        <strong>Public</strong> account. The tool automatically pulls public profile statistics and recent video
        metrics needed to calculate estimated per-video sponsorship earnings.
      </p>
    ),
  },
  {
    id: 'faq-6',
    question: '6. Does the calculator require a TikTok password or account login?',
    schemaAnswer:
      'Never. KalkulatorTik does not ask for your TikTok password, email address, two-factor authentication codes, or TikTok Studio login access. Everything runs on public profile data. For your account security, never share your TikTok password with any third-party calculator website, and review our Privacy Policy for data handling details.',
    answer: (
      <p>
        <strong>Never.</strong> KalkulatorTik does not ask for your TikTok password, email address, two-factor
        authentication codes, or TikTok Studio login access. Everything runs on public profile data. For your account
        security, never share your TikTok password with any third-party calculator website, and review our{' '}
        <Link
          to="/privacy"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Privacy Policy
        </Link>{' '}
        for data handling details.
      </p>
    ),
  },
  {
    id: 'faq-7',
    question: '7. Is KalkulatorTik free to use?',
    schemaAnswer:
      'Yes. KalkulatorTik is free to use online with no subscription fees, credit card requirements, or forced account registration. Standard server rate limits apply to prevent automated abuse and keep the service responsive for all visitors. For additional questions about platform policies, visit our full FAQ page.',
    answer: (
      <p>
        <strong>Yes.</strong> KalkulatorTik is free to use online with no subscription fees, credit card requirements,
        or forced account registration. Standard server rate limits apply to prevent automated abuse and keep the
        service responsive for all visitors. For additional questions about platform policies, visit our full{' '}
        <Link
          to="/faq"
          className="font-semibold text-teal-700 dark:text-teal-400 underline underline-offset-2 hover:text-teal-800 dark:hover:text-teal-300"
        >
          FAQ page
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-8',
    question: '8. Can private TikTok profiles be analyzed?',
    schemaAnswer:
      "No. KalkulatorTik only accesses information that is publicly visible on TikTok. If an account is set to Private, its follower metrics and videos are restricted, and the calculator cannot retrieve data or generate a profile-based estimate. If you know a private account's totals manually, you can still test its numbers using our TikTok Engagement Calculator or TikTok CPM Calculator.",
    answer: (
      <p>
        <strong>No.</strong> KalkulatorTik only accesses information that is publicly visible on TikTok. If an account
        is set to Private, its follower metrics and videos are restricted, and the calculator cannot retrieve data or
        generate a profile-based estimate. If you know a private account&apos;s totals manually, you can still test its
        numbers using our{' '}
        <Link
          to="/tiktok-engagement-calculator"
          className="font-semibold text-teal-700 dark:text-teal-400 underline underline-offset-2 hover:text-teal-800 dark:hover:text-teal-300"
        >
          TikTok Engagement Calculator
        </Link>{' '}
        or{' '}
        <Link
          to="/tiktok-cpm-calculator"
          className="font-semibold text-teal-700 dark:text-teal-400 underline underline-offset-2 hover:text-teal-800 dark:hover:text-teal-300"
        >
          TikTok CPM Calculator
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-9',
    question: '9. Why might profile data be unavailable when I search a username?',
    schemaAnswer:
      "A lookup may fail if the username was mistyped, the creator recently changed their handle, the account is private or suspended, or TikTok's servers temporarily rate-limit automated requests during peak traffic. Double-check the spelling of the handle, confirm the profile is public, and wait a few seconds before trying again if a temporary network error occurs.",
    answer: (
      <p>
        A lookup may fail if the username was mistyped, the creator recently changed their handle, the account is
        private or suspended, or TikTok&apos;s servers temporarily rate-limit automated requests during peak traffic.
        Double-check the spelling of the handle, confirm the profile is public, and wait a few seconds before trying
        again if a temporary network error occurs.
      </p>
    ),
  },
  {
    id: 'faq-10',
    question: '10. What happens when recent video views are unavailable for a public profile?',
    schemaAnswer:
      "If a profile's main public stats (followers, total likes, and video count) load but its recent video view list cannot be retrieved, KalkulatorTik automatically switches to a fallback estimation model. It estimates average views at 8% of followers for accounts with 12,500+ followers (or 10% between 10,000 and 12,499 followers, with a minimum 1,000-view floor below 10,000) and estimates engagement from total likes, video count, and followers (or follower-tier defaults when counts are missing) so you still get a baseline estimate.",
    answer: (
      <p>
        If a profile&apos;s main public stats (followers, total likes, and video count) load but its recent video view
        list cannot be retrieved, KalkulatorTik automatically switches to a <strong>fallback estimation model</strong>.
        It estimates average views at <code>8%</code> of followers for accounts with <code>12,500+</code> followers (or{' '}
        <code>10%</code> between <code>10,000</code> and <code>12,499</code> followers, with a minimum{' '}
        <code>1,000</code>-view floor below <code>10,000</code>) and estimates engagement from total likes, video
        count, and followers (or follower-tier defaults when counts are missing) so you still get a baseline estimate.
      </p>
    ),
  },
  {
    id: 'faq-11',
    question: '11. Is the estimated sponsorship amount guaranteed?',
    schemaAnswer:
      'No. All figures produced by KalkulatorTik are non-binding educational benchmarks, not guaranteed income or official agency offers. Actual sponsorship fees depend on whether a brand chooses to partner with you, your specific content niche, audience demographics, deliverable complexity, and how you negotiate contract terms.',
    answer: (
      <p>
        <strong>No.</strong> All figures produced by KalkulatorTik are non-binding educational benchmarks, not
        guaranteed income or official agency offers. Actual sponsorship fees depend on whether a brand chooses to
        partner with you, your specific content niche, audience demographics, deliverable complexity, and how you
        negotiate contract terms.
      </p>
    ),
  },
  {
    id: 'faq-12',
    question: '12. How can creators use this estimate when negotiating with brands?',
    schemaAnswer:
      'Treat the primary estimate and low-to-high range as a starting baseline for one standard organic sponsored video: Use the average estimate to sense-check inbound sponsorship offers and avoid underpricing your reach. Quote toward or above the upper end of the range when a brand requests extra value—such as Spark Ads paid boosting permissions, 30-to-90-day usage rights, category exclusivity, or complex video production. Offer a slight per-video discount toward the lower end of the range when a brand commits to a multi-video package (for example, a 3-video or 5-video campaign bundle).',
    answer: (
      <div className="space-y-2">
        <p>
          Treat the primary estimate and low-to-high range as a{' '}
          <strong>starting baseline for one standard organic sponsored video</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Use the <strong>average estimate</strong> to sense-check inbound sponsorship offers and avoid underpricing
            your reach.
          </li>
          <li>
            Quote toward or above the <strong>upper end of the range</strong> when a brand requests extra value—such as
            Spark Ads paid boosting permissions, 30-to-90-day usage rights, category exclusivity, or complex video
            production.
          </li>
          <li>
            Offer a slight per-video discount toward the <strong>lower end of the range</strong> when a brand commits to
            a multi-video package (for example, a 3-video or 5-video campaign bundle).
          </li>
        </ul>
      </div>
    ),
  },
];

export const HOME_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://www.kalkulatortik.com/#faq',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.schemaAnswer,
    },
  })),
};

const SECTION_ICONS = {
  info: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
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
  calculator: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  ),
  compare: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
    />
  ),
  sliders: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  ),
  steps: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  ),
  tools: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.9}
      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
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

const SectionHeader = ({ id, icon, title, description, action, noDivider = false }) => (
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
    {action && <div className="mt-4">{action}</div>}
  </div>
);

const InfoSection = () => {
  const langCode = useActiveLang();
  const numberLocale = DATE_LOCALE_BY_LANG[langCode] || 'en-US';
  const formatCount = (value) => new Intl.NumberFormat(numberLocale).format(value);
  const localePack = useHomeLocalePack(langCode);
  const isId = Boolean(localePack);
  const idCopy = localePack?.copy;
  const activeMetricsGuide = localePack ? localePack.metricsGuide : ACCOUNT_METRICS_GUIDE;
  const activeCpmTiers = localePack ? localePack.cpmTiers : CPM_TIERS_DATA;
  const activeFollowerScaleTiers = localePack ? localePack.followerScaleTiers : FOLLOWER_SCALE_TIERS;
  const activeChannelRows = localePack ? localePack.channelRows : CHANNEL_COMPARISON_ROWS;
  const activeFactors = localePack ? localePack.factors : REAL_WORLD_FACTORS;
  const activeCreatorRows = localePack ? localePack.creatorRows : CREATOR_COMPARISON_ROWS;
  const activeFaqItems = localePack ? localePack.faqItems : FAQ_ITEMS;

  const [openFaqIds, setOpenFaqIds] = useState({
    'faq-1': true,
    'faq-2': false,
    'faq-3': false,
    'faq-4': false,
    'faq-5': false,
    'faq-6': false,
    'faq-7': false,
    'faq-8': false,
    'faq-9': false,
    'faq-10': false,
    'faq-11': false,
    'faq-12': false,
  });

  const toggleFaq = (id) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollToCalculator = (e) => {
    e.preventDefault();
    const inputEl = document.getElementById('tiktok-username');
    if (inputEl) {
      if (typeof inputEl.scrollIntoView === 'function') {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      inputEl.focus();
    } else if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
        {/* ===================================================================
            WHAT IS A TIKTOK MONEY CALCULATOR? (OPENING INTRO SECTION)
           =================================================================== */}
        <section
          id="what-is-tiktok-money-calculator"
          aria-labelledby="what-is-heading"
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="what-is-heading"
            icon="info"
            title={isId ? idCopy.intro.title : 'What Is a TikTok Money Calculator?'}
            description={
              isId
                ? idCopy.intro.description
                : 'A TikTok Money Calculator is a creator valuation tool that estimates what a public TikTok profile could charge for a sponsored video—and helps brands benchmark fair partnership rates.'
            }
          />

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            <p>
              {isId ? (
                idCopy.intro.p1
              ) : (
                <>
                  Instead of guessing how much money an account might earn from brand collaborations, this{' '}
                  <strong className="font-semibold text-slate-900">TikTok money calculator</strong> looks at publicly
                  available profile indicators—including{' '}
                  <strong className="font-semibold text-slate-900">average video views</strong>,{' '}
                  <strong className="font-semibold text-slate-900">audience engagement rate</strong>,{' '}
                  <strong className="font-semibold text-slate-900">profile region</strong>, and{' '}
                  <strong className="font-semibold text-slate-900">follower scale</strong>—to estimate a single-video
                  sponsorship rate in USD alongside a low-to-high negotiation range.
                </>
              )}
            </p>
            <p>
              {isId
                ? idCopy.intro.p2
                : 'Whether you are a creator preparing a rate card for upcoming brand deals or a marketer comparing creators before launching a campaign, KalkulatorTik gives you a transparent starting benchmark from any public TikTok username with no account login or password required.'}
            </p>
          </div>
        </section>

        {/* ===================================================================
            SECTION 2 — HOW TO USE THE CALCULATOR
           =================================================================== */}
        <section
          id="how-to-use"
          aria-labelledby="section-2-heading"
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-2-heading"
            icon="steps"
            title={isId ? idCopy.howToUse.title : 'How to Use the TikTok Money Calculator'}
            description={
              isId
                ? idCopy.howToUse.description
                : 'Calculate estimated TikTok sponsorship earnings by username in three quick steps—no login or account setup needed.'
            }
            action={
              <button
                type="button"
                onClick={scrollToCalculator}
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 sm:text-sm"
              >
                {isId ? idCopy.howToUse.actionLabel : <>Launch Calculator Above &uarr;</>}
              </button>
            }
          />

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6">
              <span className="inline-flex h-6 items-center rounded bg-teal-700 px-2.5 font-mono text-[11px] font-bold text-white">
                {isId ? idCopy.howToUse.steps[0].badge : 'STEP 01'}
              </span>
              <h3 className="mt-3 text-base font-bold font-display text-slate-800">
                {isId ? idCopy.howToUse.steps[0].title : <>Enter Username &amp; Calculate</>}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {isId ? (
                  idCopy.howToUse.steps[0].body
                ) : (
                  <>
                    Enter any public TikTok username (such as <code>khaby.lame</code> or <code>@mrbeast</code>) into the
                    calculator above&mdash;leading <code>@</code> symbols strip automatically&mdash;and click{' '}
                    <strong>Calculate Sponsorship Value</strong> to compute an instant per-video earnings range.
                  </>
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6">
              <span className="inline-flex h-6 items-center rounded bg-teal-700 px-2.5 font-mono text-[11px] font-bold text-white">
                {isId ? idCopy.howToUse.steps[1].badge : 'STEP 02'}
              </span>
              <h3 className="mt-3 text-base font-bold font-display text-slate-800">
                {isId ? idCopy.howToUse.steps[1].title : <>Review Profile &amp; Data Source</>}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {isId ? (
                  idCopy.howToUse.steps[1].body
                ) : (
                  <>
                    Check the status banner above your results to see whether metrics came from a{' '}
                    <strong>live recent-video sample</strong> or <strong>profile fallback mode</strong>, then review your{' '}
                    <strong>Estimated Value &amp; Range</strong>, <strong>CPM Benchmark</strong>, and 6 stat cards.
                  </>
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6">
              <span className="inline-flex h-6 items-center rounded bg-teal-700 px-2.5 font-mono text-[11px] font-bold text-white">
                {isId ? idCopy.howToUse.steps[2].badge : 'STEP 03'}
              </span>
              <h3 className="mt-3 text-base font-bold font-display text-slate-800">
                {isId ? idCopy.howToUse.steps[2].title : 'Apply to Deal Terms'}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {isId ? (
                  idCopy.howToUse.steps[2].body
                ) : (
                  <>
                    <strong>Creators:</strong> Use the average estimate as an organic single-post baseline before adding
                    Spark Ads, usage licensing, or exclusivity. <strong>Brands:</strong> Cross-check quoted fees against
                    expected reach and engagement quality.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold font-display text-slate-800">
                {isId ? idCopy.howToUse.troubleshootingTitle : <>Troubleshooting &amp; Manual Cache Refresh</>}
              </h3>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
              <p>
                {isId ? (
                  idCopy.howToUse.troubleshootingP1
                ) : (
                  <>
                    <strong className="text-slate-900">Public Lookups &amp; Temporary Throttles:</strong> Only public
                    accounts can be analyzed. If upstream TikTok limits trigger a brief pause, wait a few seconds before
                    retrying your search.
                  </>
                )}
              </p>
              <p>
                {isId ? (
                  idCopy.howToUse.troubleshootingP2
                ) : (
                  <>
                    <strong className="text-slate-900">1-Hour Cache &amp; Fresh Pulls:</strong> Results cache up to 1
                    hour for speed. If your post stats just spiked, use Refresh Data in the{' '}
                    <Link to="/calculator" className="font-semibold text-teal-700 underline underline-offset-2">
                      Standalone Cache-Refresh View
                    </Link>{' '}
                    to bypass the cache.
                  </>
                )}
              </p>
            </div>
            <p className="mt-4 border-t border-slate-200/80 pt-3 text-xs text-slate-600">
              {isId
                ? idCopy.howToUse.footerNote
                : 'Below, each valuation card and public profile metric referenced in Step 02 is explained in detail.'}
            </p>
          </div>
        </section>

        {/* ===================================================================
            SECTION 3 — UNDERSTANDING YOUR CALCULATOR RESULTS
           =================================================================== */}
        <section
          id="results-explanation"
          aria-labelledby="section-3-heading"
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-3-heading"
            icon="chart"
            title={isId ? idCopy.results.title : 'Profile Performance & Estimated Sponsorship Value'}
            description={
              isId
                ? idCopy.results.description
                : 'Every TikTok username lookup turns raw public profile signals into an estimated sponsorship earnings and rate breakdown for a single sponsored video.'
            }
          />

          <div className="mt-7 space-y-6">
            {/* Row 1: Primary Valuation Output (Clean Light Panel) */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3.5">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                  {isId ? idCopy.results.primaryEyebrow : 'Primary Valuation Output'}
                </span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                  {isId ? idCopy.results.usdBadge : 'USD Benchmark'}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold font-display text-slate-800 sm:text-xl">
                  {isId ? idCopy.results.primaryTitle : 'Estimated Sponsorship Value per Video'}
                </h3>
                <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
                  {isId ? (
                    idCopy.results.primaryLead
                  ) : (
                    <>
                      The headline dollar figure is your{' '}
                      <strong className="font-semibold text-slate-900">
                        estimated baseline rate for one sponsored video
                      </strong>
                      . Because real deal pricing moves with deliverables, two supporting reference figures frame the
                      quote:
                    </>
                  )}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div className="rounded-xl border border-slate-200/90 border-l-4 border-l-teal-600 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                      {isId ? idCopy.results.rangeTitle : 'Estimated Sponsorship Range'}
                    </span>
                    <code className="rounded-md bg-teal-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-teal-800">
                      $Min &ndash; $Max
                    </code>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {isId
                      ? idCopy.results.rangeBody
                      : 'Quick mentions or multi-video bundles often settle near the lower end, while competitive commercial niches or expanded deliverables trend toward the upper end.'}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/90 border-l-4 border-l-teal-600 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                      {isId ? idCopy.results.cpmTitle : 'Model CPM Benchmark'}
                    </span>
                    <code className="rounded-md bg-teal-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-teal-800">
                      $CPM Min &ndash; $CPM Max
                    </code>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {isId
                      ? idCopy.results.cpmBody
                      : 'The assumed gross advertiser rate per 1,000 video views after adjusting for profile region tier, engagement rate, and follower scale.'}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-600">
                {isId
                  ? idCopy.results.cacheNote
                  : 'Values reflect public profile data retrieved on lookup (or cached up to 1 hour).'}
              </p>
            </div>

            {/* Row 2: Public Profile Overview */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold font-display text-slate-800 sm:text-lg">
                  {isId ? idCopy.results.profileOverviewTitle : 'Public Profile Overview'}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-600">
                  {isId ? idCopy.results.profileOverviewBadge : 'Identity Signals'}
                </span>
              </div>
              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
                {isId ? (
                  idCopy.results.profileOverviewBody
                ) : (
                  <>
                    Displays available public profile details&mdash;display name, <code>@handle</code>, TikTok verified
                    badge (when present), public bio, region code (when exposed), TikTok ID, and account creation date.
                  </>
                )}
              </p>
            </div>

            {/* Row 3: Account Overview & Activity Benchmarks (Strict 1 Metric Per Row Ledger) */}
            <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/90 px-5 py-3.5 sm:px-6">
                <h3 className="text-base font-bold font-display text-slate-800">
                  {isId ? idCopy.results.metricsTitle : <>Account Overview &amp; Activity Benchmarks</>}
                </h3>
                <span className="font-mono text-[11px] text-slate-500">
                  {isId ? idCopy.results.metricsBadge : '6 Public Indicators'}
                </span>
              </div>

              <dl className="divide-y divide-slate-200">
                {activeMetricsGuide.map((item, idx) => {
                  const isDriver = idx >= 4;
                  return (
                    <div
                      key={item.name}
                      className={`grid grid-cols-1 items-baseline gap-2 px-5 py-4 sm:px-6 md:grid-cols-12 md:gap-6 ${
                        isDriver ? 'bg-teal-50/35' : ''
                      }`}
                    >
                      <dt className="flex flex-wrap items-center justify-between gap-2.5 md:col-span-4 md:justify-start">
                        <span
                          className={`font-mono text-xs font-semibold tabular-nums ${
                            isDriver ? 'text-teal-700' : 'text-slate-500'
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{item.name}</span>
                        <span
                          className={`rounded px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide whitespace-nowrap ${
                            isDriver ? 'bg-teal-100/80 text-teal-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.tag}
                        </span>
                      </dt>
                      <dd className="text-sm leading-relaxed text-slate-600 md:col-span-8">{item.description}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            {/* Row 4: How to Read Results + Limitations */}
            <div className="space-y-4 border-t border-slate-200 pt-5">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-800">
                  {isId ? idCopy.results.howToReadTitle : 'How to Read Your Calculator Results'}
                </h3>
                <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
                  {isId ? (
                    idCopy.results.howToReadBody
                  ) : (
                    <>
                      Whether you use this tool as a TikTok earnings calculator to sense-check inbound offers or build a
                      baseline rate card, treat the estimate as a practical negotiation starting point&mdash;never a
                      fixed price tag or guaranteed creator income.{' '}
                      <strong className="text-slate-900">Creators</strong> can establish a per-video quote before adding
                      fees for usage rights or exclusivity. <strong className="text-slate-900">Brands and marketers</strong>{' '}
                      can check whether a creator&apos;s quote aligns with public reach and engagement. To see exactly
                      how those figures are computed from raw views and region tiers, walk through the formula below.
                    </>
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-amber-200/90 border-l-4 border-l-amber-500 bg-amber-50/70 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  {isId ? idCopy.results.limitationsBadge : 'Estimate Limitations'}
                </p>
                <p className="mt-1.5 max-w-4xl text-xs leading-relaxed text-amber-950/90 sm:text-sm">
                  {isId
                    ? idCopy.results.limitationsBody
                    : 'This output relies strictly on public profile indicators. It cannot inspect private TikTok Studio analytics, viewer age or income brackets, watch-time completion rates, or invalid engagement. When recent video views cannot be retrieved, a profile-based fallback model applies.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 4 — HOW THE CALCULATION WORKS
           =================================================================== */}
        <section
          id="how-calculation-works"
          aria-labelledby="section-4-heading"
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-4-heading"
            icon="calculator"
            title={isId ? idCopy.calculation.title : 'How the TikTok Money Calculator Estimates Sponsorship Value'}
            description={
              isId
                ? idCopy.calculation.description
                : 'Instead of hiding behind a black-box score, KalkulatorTik applies a transparent, step-by-step media model to calculate how much a creator might earn—and what an advertiser might budget—for a single sponsored video.'
            }
          />

          {/* Core Valuation Formula Display (Clean Light Card) */}
          <div className="mt-7 rounded-xl border border-slate-200/90 bg-slate-50/80 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="lg:max-w-md">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                  {isId ? idCopy.calculation.eqBadge : 'Core Valuation Equation'}
                </span>
                <h3 className="mt-1.5 text-lg font-bold font-display text-slate-800 sm:text-xl">
                  {isId ? idCopy.calculation.eqTitle : 'The Core Sponsorship Valuation Formula'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {isId
                    ? idCopy.calculation.eqBody
                    : 'Built on digital media Cost Per Mille (CPM)—the rate paid per 1,000 video views. Calculating minimum, average, and maximum Adjusted CPM yields both your headline benchmark and negotiation range.'}
                </p>
              </div>

              <div className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs sm:gap-3 sm:text-sm">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-800">
                    {isId ? idCopy.calculation.eqPart1 : <>Average Video Views &divide; 1,000</>}
                  </span>
                  <span className="font-bold text-teal-700">&times;</span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-800">
                    {isId ? idCopy.calculation.eqPart2 : 'Adjusted CPM'}
                  </span>
                  <span className="font-bold text-teal-700">=</span>
                  <span className="rounded-md border border-teal-200 bg-teal-50 px-3 py-1.5 font-bold text-teal-800">
                    {isId ? idCopy.calculation.eqPart3 : 'Estimated Video Rate'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Step Spine */}
          <div className="mt-9 space-y-9 border-l-2 border-teal-600/30 pl-5 sm:pl-8">
            {/* Step 01: Views & Engagement */}
            <div className="relative">
              <span
                className="absolute -left-[29px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-teal-600 bg-white font-mono text-[10px] font-bold text-teal-700 sm:-left-[41px]"
                aria-hidden="true"
              >
                1
              </span>
              <h3 className="text-lg font-bold font-display text-slate-800 sm:text-xl">
                {isId ? idCopy.calculation.step1Title : 'Step 1: Calculating Average Video Views and Engagement Rate'}
              </h3>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">
                {isId
                  ? idCopy.calculation.step1Desc
                  : 'When a public username is searched, the calculator inspects up to 30 recent public videos that report play counts:'}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
                  <p className="text-sm font-bold text-slate-900">
                    {isId ? idCopy.calculation.avgViewsTitle : 'Average Video Views'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {isId
                      ? idCopy.calculation.avgViewsDesc
                      : 'Computes the simple arithmetic mean across recent public videos (with > 0 views). Because advertisers price partnerships on verified impressions rather than follower counts alone, evaluating TikTok earnings by views gives creators and brands a realistic sponsorship baseline:'}
                  </p>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs font-medium text-slate-800">
                    {isId ? idCopy.calculation.avgViewsFormula : <>Avg Views = Sum of Recent Views &divide; Analyzed Videos</>}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
                  <p className="text-sm font-bold text-slate-900">
                    {isId ? idCopy.calculation.engTitle : 'Engagement Rate'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {isId
                      ? idCopy.calculation.engDesc
                      : 'Measures total public interactions relative to total views across those sampled videos:'}
                  </p>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs font-medium text-slate-800">
                    {isId ? idCopy.calculation.engFormula : <>Engagement (%) = ((Likes + Comments + Shares) &divide; Views) &times; 100</>}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 02: Baseline CPM Tiers */}
            <div className="relative">
              <span
                className="absolute -left-[29px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-teal-600 bg-white font-mono text-[10px] font-bold text-teal-700 sm:-left-[41px]"
                aria-hidden="true"
              >
                2
              </span>
              <h3 className="text-lg font-bold font-display text-slate-800 sm:text-xl">
                {isId ? idCopy.calculation.step2Title : 'Step 2: Selecting the Baseline CPM Tier (Model Assumptions)'}
              </h3>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">
                {isId
                  ? idCopy.calculation.step2Desc
                  : "Because advertiser demand varies across regions, KalkulatorTik assigns an internal starting USD baseline CPM bracket from the profile's exposed region code (or defaults to Tier 3 when region metadata is unavailable):"}
              </p>

              {/* Mobile View: Vertical Card Stack (No horizontal scroll needed) */}
              <div className="mt-4 sm:hidden space-y-3">
                {activeCpmTiers.map((item) => (
                  <div
                    key={item.tier}
                    className={`rounded-xl border p-4 shadow-sm bg-white ${
                      item.featured ? 'border-teal-300 ring-1 ring-teal-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <span className="font-bold text-slate-900 text-sm">{item.tier}</span>
                      <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        {isId ? 'Rata-rata: ' : 'Avg: '}{item.avg}
                      </span>
                    </div>
                    <div className="mb-2 text-xs text-slate-600">
                      <span className="font-medium text-slate-500">{isId ? idCopy.calculation.thCountries : 'Region Codes'}: </span>
                      <code className="text-xs break-words">{item.regions}</code>
                    </div>
                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px] font-sans">{isId ? idCopy.calculation.thMin : 'Baseline Min'}</span>
                        <span className="font-semibold text-slate-800">{item.min}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] font-sans">{isId ? idCopy.calculation.thMax : 'Baseline Max'}</span>
                        <span className="font-semibold text-slate-800">{item.max}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Full Data Table */}
              <div className="mt-4 hidden sm:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                  <caption className="sr-only">
                    {isId ? idCopy.calculation.tableCaption : 'Internal KalkulatorTik baseline CPM assumptions (USD per 1,000 views).'}
                  </caption>
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                        {isId ? idCopy.calculation.thTier : 'Market Tier'}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-slate-700">
                        {isId ? idCopy.calculation.thCountries : 'Profile Region Codes'}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-slate-700">
                        {isId ? idCopy.calculation.thMin : 'Baseline Min'}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-teal-700">
                        {isId ? idCopy.calculation.thAvg : 'Baseline Avg'}
                      </th>
                      <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-slate-700">
                        {isId ? idCopy.calculation.thMax : 'Baseline Max'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeCpmTiers.map((item) => (
                      <tr key={item.tier} className={item.featured ? 'bg-teal-50/40' : ''}>
                        <th scope="row" className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                          {item.tier}
                        </th>
                        <td className="px-4 py-3 text-slate-600 min-w-[200px]">
                          <code className="text-xs break-words">{item.regions}</code>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono tabular-nums text-slate-700">{item.min}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono font-bold tabular-nums text-teal-700">{item.avg}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono tabular-nums text-slate-700">{item.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 rounded-lg border border-amber-200/80 border-l-4 border-l-amber-500 bg-amber-50/70 px-4 py-3">
                <p className="text-xs leading-relaxed text-amber-950">
                  {isId ? (
                    idCopy.calculation.step2Note
                  ) : (
                    <>
                      <strong>Methodology Note:</strong> These CPM tiers are internal KalkulatorTik benchmarking
                      assumptions&mdash;not official TikTok rates or guaranteed industry averages. Profile region codes
                      do not guarantee where every viewer resides.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Step 03: Multipliers + Clamping + Fallback */}
            <div className="relative">
              <span
                className="absolute -left-[29px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-teal-600 bg-white font-mono text-[10px] font-bold text-teal-700 sm:-left-[41px]"
                aria-hidden="true"
              >
                3
              </span>
              <h3 className="text-lg font-bold font-display text-slate-800 sm:text-xl">
                {isId ? idCopy.calculation.step3Title : 'Step 3: Applying Engagement and Follower Scale Multipliers'}
              </h3>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">
                {isId ? (
                  idCopy.calculation.step3Desc
                ) : (
                  <>
                    Two performance multipliers adjust the starting CPM before capping the result between{' '}
                    <strong>$7.00</strong> and <strong>$80.00</strong> per 1,000 views:
                  </>
                )}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
                  <p className="text-sm font-bold text-slate-900">
                    {isId ? (
                      idCopy.calculation.engAdjTitle
                    ) : (
                      <>
                        Engagement Adjustment (<code>0.90x&ndash;1.20x</code>)
                      </>
                    )}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {isId ? (
                      idCopy.calculation.engAdjBody
                    ) : (
                      <>
                        Scaled linearly from <code>0%</code> engagement (<code>0.90x</code>) through a{' '}
                        <code>5.0%</code> neutral point (<code>1.00x</code>) and <code>7.5%</code> (<code>1.05x</code>),
                        capping at <code>1.20x</code> for <code>15%+</code> engagement.
                      </>
                    )}
                  </p>
                  <div className="mt-3 space-y-1 rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-[11px] text-slate-700">
                    <p>{isId ? idCopy.calculation.engAdjBox1 : <>0% = 0.90x &middot; 5.0% = 1.00x (Neutral)</>}</p>
                    <p>{isId ? idCopy.calculation.engAdjBox2 : <>7.5% = 1.05x &middot; 15%+ = 1.20x (Cap)</>}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
                  <p className="text-sm font-bold text-slate-900">
                    {isId ? (
                      idCopy.calculation.scaleTitle
                    ) : (
                      <>
                        Follower Scale (<code>1.00x&ndash;1.18x</code>)
                      </>
                    )}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {isId ? idCopy.calculation.scaleSub : 'Uplift-only social-proof scale (smaller creators are never penalized):'}
                  </p>
                  <ul className="mt-2.5 divide-y divide-slate-200/80 text-xs">
                    {activeFollowerScaleTiers.map((tier) => (
                      <li key={tier.range} className="flex items-center justify-between py-1.5">
                        <span className="text-slate-600">{tier.range}</span>
                        <span className="font-mono font-bold tabular-nums text-teal-700">{tier.factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {isId ? (
                        idCopy.calculation.boundsTitle
                      ) : (
                        <>
                          CPM Floor &amp; Ceiling (<code>$7.00&ndash;$80.00</code>)
                        </>
                      )}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {isId ? (
                        idCopy.calculation.boundsBody
                      ) : (
                        <>
                          Each Low, Baseline, and High CPM is multiplied by both factors and bounded between a{' '}
                          <code>$7.00</code> minimum and an <code>$80.00</code> maximum.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-[11px] text-slate-700">
                    {isId ? idCopy.calculation.boundsBox : <>Adjusted CPM = Base &times; Eng &times; Scale (Bounded $7&ndash;$80)</>}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
                <h4 className="text-sm font-bold font-display text-slate-800">
                  {isId ? idCopy.calculation.fallbackTitle : 'Fallback Estimates When Recent Video Views Are Unavailable'}
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-3 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  <p>
                    {isId ? (
                      idCopy.calculation.fallbackViews
                    ) : (
                      <>
                        <strong className="text-slate-900">Fallback Average Views:</strong> Estimated at <code>8%</code> of
                        followers for accounts with <code>12,500+</code> followers, <code>10%</code> between{' '}
                        <code>10,000</code> and <code>12,499</code> followers, and a minimum <code>1,000</code>-view floor
                        below <code>10,000</code> followers.
                      </>
                    )}
                  </p>
                  <p>
                    {isId ? (
                      idCopy.calculation.fallbackEng
                    ) : (
                      <>
                        <strong className="text-slate-900">Fallback Engagement Rate:</strong> Derived from total likes
                        divided by total videos and followers (bounded between <code>1.0%</code> and <code>50.0%</code>),
                        or follower-tier defaults (<code>8.0%</code> up to 100K, <code>5.0%</code> above 100K,{' '}
                        <code>3.0%</code> above 1M, and <code>2.0%</code> above 10M) when counts are missing.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Worked Example Ledger Block */}
          <div className="mt-9 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                  {isId ? idCopy.calculation.exampleBadge : 'Hypothetical Model Example'}
                </span>
                <h3 className="mt-0.5 text-base font-bold font-display text-slate-800 sm:text-lg">
                  {isId ? idCopy.calculation.exampleTitle : <>Worked Example: Calculating a Creator&apos;s Sponsorship Benchmark</>}
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-600">
                {isId ? idCopy.calculation.exampleTag : 'Sample Profile Trace'}
              </span>
            </div>

            <div className="grid grid-cols-2 divide-y divide-slate-200 border-b border-slate-200 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
              <div className="p-4">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-600">
                  {isId ? idCopy.calculation.exRegionLabel : 'Profile Region'}
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {isId ? idCopy.calculation.exRegionVal : 'US (Tier 1)'}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-slate-600">$22.00 &middot; $30.00 &middot; $42.00</p>
              </div>
              <div className="border-l border-slate-200 p-4">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-600">
                  {isId ? idCopy.calculation.exFollowersLabel : 'Followers'}
                </span>
                <p className="mt-1 text-sm font-bold tabular-nums text-slate-900">{formatCount(250000)}</p>
                <p className="mt-0.5 font-mono text-[11px] text-teal-700">
                  {isId ? idCopy.calculation.exFollowersSub : 'Scale = 1.08x'}
                </p>
              </div>
              <div className="p-4">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-600">
                  {isId ? idCopy.calculation.exViewsLabel : 'Average Views'}
                </span>
                <p className="mt-1 text-sm font-bold tabular-nums text-slate-900">
                  {isId ? idCopy.calculation.exViewsVal : '50,000 / video'}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-slate-600">
                  {isId ? idCopy.calculation.exViewsSub : '50.0 view units'}
                </p>
              </div>
              <div className="border-l border-slate-200 p-4">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-600">
                  {isId ? idCopy.calculation.exEngLabel : 'Engagement Rate'}
                </span>
                <p className="mt-1 text-sm font-bold tabular-nums text-slate-900">9.00%</p>
                <p className="mt-0.5 font-mono text-[11px] text-teal-700">
                  {isId ? idCopy.calculation.exEngSub : 'Factor = 1.08x'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 divide-y divide-slate-200 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              <ol className="space-y-2 p-5 text-xs text-slate-700 sm:text-sm lg:col-span-8">
                <li className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 py-1">
                  <span>
                    <strong className="text-slate-900">
                      {isId ? idCopy.calculation.exStep1 : '1. Normalized Engagement:'}
                    </strong>{' '}
                    <code>9.00 &divide; 7.5</code>
                  </span>
                  <span className="font-mono font-semibold text-slate-900">1.20</span>
                </li>
                <li className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 py-1">
                  <span>
                    <strong className="text-slate-900">
                      {isId ? idCopy.calculation.exStep2 : '2. Engagement Factor:'}
                    </strong>{' '}
                    <code>0.9 + (1.20 &times; 0.15)</code>
                  </span>
                  <span className="font-mono font-semibold text-slate-900">1.08x</span>
                </li>
                <li className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 py-1">
                  <span>
                    <strong className="text-slate-900">
                      {isId ? idCopy.calculation.exStep3 : '3. Combined Multiplier:'}
                    </strong>{' '}
                    <code>1.08 &times; 1.08</code>
                  </span>
                  <span className="font-mono font-semibold text-slate-900">1.1664</span>
                </li>
                <li className="flex flex-wrap items-baseline justify-between gap-2 py-1">
                  <span>
                    <strong className="text-slate-900">
                      {isId ? idCopy.calculation.exStep4Label : '4. Adjusted CPM Range:'}
                    </strong>{' '}
                    {isId ? idCopy.calculation.exStep4Min : 'Min'} <code>$25.66</code> &middot;{' '}
                    {isId ? idCopy.calculation.exStep4Avg : 'Avg'} <code>$34.99</code> &middot;{' '}
                    {isId ? idCopy.calculation.exStep4Max : 'Max'} <code>$48.99</code>
                  </span>
                  <span className="font-mono font-semibold text-teal-700">
                    {isId ? idCopy.calculation.exStep4Tag : '$34.99 avg'}
                  </span>
                </li>
              </ol>

              <div className="flex flex-col justify-center bg-slate-50/80 p-5 lg:col-span-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  {isId ? idCopy.calculation.exStep5Title : <>5. Final Benchmark (50 &times; $34.99)</>}
                </span>
                <p className="mt-1 text-2xl font-extrabold tracking-tight tabular-nums text-slate-900 sm:text-3xl">
                  $1,749.50
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {isId ? idCopy.calculation.exPerVideo : 'per sponsored video'}
                </p>
                <p className="mt-2 font-mono text-xs font-medium text-slate-600">
                  {isId ? idCopy.calculation.exRange : <>Range: $1,283.00 &ndash; $2,449.50</>}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-[11px] text-slate-500">
                {isId
                  ? idCopy.calculation.exFooterNote
                  : 'Illustrative benchmark only; does not inspect private audience demographics or conversion rates.'}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-600">
            {isId
              ? idCopy.calculation.transitionNote
              : 'Because this benchmark models what external advertisers pay per video, it serves a fundamentally different purpose than direct in-app monetization from TikTok.'}
          </p>
        </section>

        {/* ===================================================================
            SECTION 5 — BRAND SPONSORSHIPS VS. TIKTOK CREATOR REWARDS
           =================================================================== */}
        <section
          id="sponsorships-vs-creator-rewards"
          aria-labelledby="section-5-heading"
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-5-heading"
            icon="compare"
            title={isId ? idCopy.channels.title : 'Brand Sponsorships vs. TikTok Creator Rewards: What Is the Difference?'}
            description={
              isId
                ? idCopy.channels.description
                : "Many creators open a TikTok income calculator expecting direct platform payouts, but commercial brand deals and TikTok's official Creator Rewards Program come from completely different payers and follow separate rules."
            }
          />

          <div className="mt-7 grid grid-cols-1 gap-5">
            {/* Left Track: Commercial Brand Sponsorships */}
            <div className="flex flex-col justify-between rounded-xl border border-teal-200/90 bg-teal-50/25 p-5 sm:p-6">
              <div>
                <span className="inline-flex items-center rounded bg-teal-100/80 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-teal-800">
                  {isId ? idCopy.channels.leftBadge : 'Estimated by This Calculator'}
                </span>
                <h3 className="mt-3 text-lg font-bold font-display text-slate-800 sm:text-xl">
                  {isId ? idCopy.channels.leftTitle : 'How Brand Sponsorships and Sponsored Videos Work'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {isId ? (
                    idCopy.channels.leftLead
                  ) : (
                    <>
                      A private commercial agreement where an external company or marketing agency pays a creator to
                      feature or demonstrate a product in a <strong>sponsored video</strong>.
                    </>
                  )}
                </p>

                <dl className="mt-5 divide-y divide-slate-200/70 text-xs sm:text-sm">
                  {(isId
                    ? idCopy.channels.leftItems
                    : [
                        ['Who Pays', 'External brands, businesses, or agencies directly via invoice or transfer.'],
                        [
                          'How Rates Are Set',
                          'Negotiated per video or campaign bundle based on expected reach, niche fit, production effort, and usage licensing.',
                        ],
                        [
                          'Eligibility',
                          'Open to creators of any size—including nano-creators below 10,000 followers—whose audience aligns with a sponsor.',
                        ],
                      ]
                  ).map(([dt, dd]) => (
                    <div key={dt} className="flex flex-col py-2.5 sm:flex-row sm:gap-4">
                      <dt className="flex-shrink-0 font-semibold text-slate-900 sm:w-44">{dt}</dt>
                      <dd className="text-slate-600">{dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Right Track: In-App Platform Payouts */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 p-5 sm:p-6">
              <div>
                <span className="inline-flex items-center rounded bg-slate-200/80 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                  {isId ? idCopy.channels.rightBadge : 'In-App Platform Program'}
                </span>
                <h3 className="mt-3 text-lg font-bold font-display text-slate-800 sm:text-xl">
                  {isId ? idCopy.channels.rightTitle : 'How the TikTok Creator Rewards Program Works'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {isId
                    ? idCopy.channels.rightLead
                    : 'Direct platform payouts administered by TikTok (replacing the former Creator Fund) through the in-app creator balance.'}
                </p>

                <dl className="mt-5 divide-y divide-slate-200/70 text-xs sm:text-sm">
                  {(isId
                    ? idCopy.channels.rightItems
                    : [
                        [
                          'Who Pays',
                          'TikTok distributes funds directly to enrolled creators under official platform payment terms.',
                        ],
                        [
                          'How Eligibility Works',
                          <>
                            Requires <code>10,000+</code> followers, <code>100,000+</code> video views in the last 30
                            days, age <code>18+</code> (<code>19+</code> in South Korea), good account standing, and
                            residing in an eligible region.
                          </>,
                        ],
                        [
                          'Payout Rules',
                          <>
                            Applies only to qualifying original videos <code>1+ minute</code> long using TikTok&apos;s
                            internal <strong>qualified views</strong> and dynamic RPM scoring rather than fixed brand
                            CPMs.
                          </>,
                        ],
                        [
                          'Other Features',
                          'LIVE Gifts during livestreams and TikTok Shop affiliate commissions each follow separate platform policies.',
                        ],
                      ]
                  ).map(([dt, dd]) => (
                    <div key={dt} className="flex flex-col py-2.5 sm:flex-row sm:gap-4">
                      <dt className="flex-shrink-0 font-semibold text-slate-900 sm:w-44">{dt}</dt>
                      <dd className="text-slate-600">{dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold font-display text-slate-800 sm:text-xl">
              {isId ? idCopy.channels.compareTitle : 'Side-by-Side Comparison: Brand Deals vs. Platform Monetization'}
            </h3>
            {/* Mobile View: Comparison Cards (No horizontal scroll needed) */}
            <div className="mt-4 sm:hidden space-y-3">
              {activeChannelRows.map((row) => (
                <div key={row.feature} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-2.5">
                    {row.feature}
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-lg bg-teal-50/70 border border-teal-200/60 p-2.5">
                      <span className="font-bold text-teal-900 block text-[11px] mb-1">
                        {isId ? idCopy.channels.thSponsor : 'Brand Sponsorships'}:
                      </span>
                      <div className="text-teal-950 leading-relaxed font-medium">
                        {row.isStatusRow ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-teal-700">
                            <span className="h-2 w-2 rounded-full bg-teal-500" aria-hidden="true" />
                            {row.sponsorships}
                          </span>
                        ) : (
                          row.sponsorships
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
                      <span className="font-bold text-slate-700 block text-[11px] mb-1">
                        {isId ? idCopy.channels.thRewards : 'TikTok Creator Rewards'}:
                      </span>
                      <div className="text-slate-600 leading-relaxed">
                        {row.isStatusRow ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                            <span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
                            {row.rewards}
                          </span>
                        ) : (
                          row.rewards
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View: Full Data Table */}
            <div className="mt-4 hidden sm:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                <caption className="sr-only">
                  {isId
                    ? idCopy.channels.tableCaption
                    : 'Key differences between commercial brand deals and official TikTok platform payouts.'}
                </caption>
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 min-w-[140px]">
                      {isId ? idCopy.channels.thFeature : 'Feature'}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-teal-800 min-w-[240px]">
                      {isId ? idCopy.channels.thSponsor : 'Brand Sponsorships (Sponsored Videos)'}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-800 min-w-[240px]">
                      {isId ? idCopy.channels.thRewards : 'TikTok Creator Rewards (Platform Monetization)'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {activeChannelRows.map((row) => (
                    <tr key={row.feature} className="transition-colors hover:bg-slate-50/70">
                      <th scope="row" className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                        {row.feature}
                      </th>
                      <td className="px-4 py-3 text-slate-700 min-w-[240px]">
                        {row.isStatusRow ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-teal-700">
                            <span className="h-2 w-2 rounded-full bg-teal-500" aria-hidden="true" />
                            {row.sponsorships}
                          </span>
                        ) : (
                          row.sponsorships
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 min-w-[240px]">
                        {row.isStatusRow ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                            <span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
                            {row.rewards}
                          </span>
                        ) : (
                          row.rewards
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-7 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold font-display text-slate-800 sm:text-lg">
                {isId ? idCopy.channels.whyTitle : 'Why a Sponsorship Estimate Is Not a Direct TikTok Payout'}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                {isId
                  ? idCopy.channels.whyBody
                  : "Private Creator Rewards metrics—qualified view share and per-video RPM—live exclusively inside a creator's TikTok Studio dashboard, so no external tool can inspect them. Brand deals also pay for custom production and product placement rather than passive ad shares. With commercial sponsorships clear, next look at what moves negotiated brand fees higher or lower between channels."}
              </p>
              <p className="text-[11px] italic text-slate-500">
                {isId
                  ? idCopy.channels.whyFootnote
                  : 'Creator Rewards rules, eligible countries, and payout terms are set solely by TikTok and may change over time.'}
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 6 — WHAT AFFECTS TIKTOK SPONSORSHIP RATES?
           =================================================================== */}
        <section
          id="sponsorship-pricing-factors"
          aria-labelledby="section-6-heading"
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-6-heading"
            icon="sliders"
            title={isId ? idCopy.factors.title : 'What Affects TikTok Sponsorship Rates?'}
            description={
              isId
                ? idCopy.factors.description
                : 'Two accounts with similar view counts can earn vastly different sponsorship fees. Separating public signals measured by this TikTok money calculator from private commercial terms helps you price brand deals realistically.'
            }
          />

          <div className="mt-7 rounded-xl border border-slate-200/90 border-l-4 border-l-teal-600 bg-slate-50/70 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold font-display text-slate-800 sm:text-base">
                {isId ? idCopy.factors.measuredTitle : 'Measured Automatically in the Calculator Formula'}
              </h3>
              <span className="rounded bg-teal-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-teal-800">
                {isId ? idCopy.factors.measuredBadge : '4 Public Signals'}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {isId ? (
                idCopy.factors.measuredBody
              ) : (
                <>
                  The estimator above already weights <strong>Average Video Views</strong>,{' '}
                  <strong>Engagement Rate</strong>, <strong>Region Proxy</strong>, and <strong>Follower Scale</strong>{' '}
                  before negotiation adjustments apply.
                </>
              )}
            </p>
          </div>

          <div className="mt-9">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-display text-slate-800">
                {isId ? idCopy.factors.unmeasuredTitle : 'Real-World Negotiation Factors Not Measured by the Calculator'}
              </h3>
              <span className="rounded border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-900">
                {isId ? idCopy.factors.unmeasuredBadge : 'Negotiated Privately'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3.5">
              {activeFactors.map((factor) => (
                <div key={factor.num} className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-slate-500">{factor.num}</span>
                    <h4 className="text-sm font-bold font-display text-slate-800 sm:text-base">{factor.title}</h4>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">{factor.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-teal-200/80 bg-teal-50/30 p-5">
            <h3 className="text-base font-bold font-display text-slate-800">
              {isId ? idCopy.factors.adjustTitle : 'How to Adjust Your Quote Based on Campaign Terms'}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {isId ? (
                idCopy.factors.adjustBody
              ) : (
                <>
                  Treat the calculator output as your <strong>baseline for one organic sponsored post</strong>, then add
                  separate line items for Spark Ads amplification, licensing usage windows, exclusivity, or complex shoots.
                  Understanding why average views sit first&mdash;even ahead of total followers&mdash;is clearest when
                  you compare two contrasting creator profiles directly.
                </>
              )}
            </p>
          </div>
        </section>

        {/* ===================================================================
            SECTION 7 — FOLLOWERS VS. VIDEO VIEWS
           =================================================================== */}
        <section
          id="followers-vs-views"
          aria-labelledby="section-7-heading"
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-7-heading"
            icon="users"
            title={
              isId
                ? idCopy.followersVsViews.title
                : 'Followers vs. Video Views: Which Matters More for TikTok Sponsorships?'
            }
            description={
              isId
                ? idCopy.followersVsViews.description
                : "Unlike chronological follower feeds, TikTok's For You feed distributes every post based on viewer interest, watch time, and engagement. As a result, a dormant large channel and an active mid-sized channel deliver very different sponsor reach."
            }
          />

          <div className="mt-7 grid grid-cols-1 gap-5">
            {/* Creator A Panel */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {isId ? idCopy.followersVsViews.creatorATag : <>Hypothetical Creator A &middot; Dormant Large Account</>}
                </span>
                <span className="font-mono text-xs font-bold tabular-nums text-slate-700">
                  {isId ? idCopy.followersVsViews.creatorAPrice : '$143.68 / video'}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                {isId ? (
                  idCopy.followersVsViews.creatorABody
                ) : (
                  <>
                    Built <strong>500,000 followers</strong> from an older viral trend, but recent videos average{' '}
                    <strong>8,000 views</strong> with a <code>1.20%</code> engagement rate (Tier 3 region).
                  </>
                )}
              </p>

              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600">{isId ? idCopy.followersVsViews.labelFollowers : 'Followers'}</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-900">
                      {formatCount(500000)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-slate-500" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600">
                      {isId ? idCopy.followersVsViews.labelViews : 'Average Views per Video'}
                    </span>
                    <span className="font-mono font-semibold tabular-nums text-slate-900">
                      {formatCount(8000)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Creator B Panel */}
            <div className="rounded-xl border border-teal-200 bg-teal-50/30 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                  {isId ? idCopy.followersVsViews.creatorBTag : <>Hypothetical Creator B &middot; High Active Reach</>}
                </span>
                <span className="font-mono text-sm font-bold tabular-nums text-teal-700">
                  {isId ? idCopy.followersVsViews.creatorBPrice : '$2,163.85 / video'}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                {isId ? (
                  idCopy.followersVsViews.creatorBBody
                ) : (
                  <>
                    A focused niche channel with <strong>50,000 followers</strong> that generates{' '}
                    <strong>65,000 average views</strong> per post and a <code>9.40%</code> engagement rate (Tier 1
                    region).
                  </>
                )}
              </p>

              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600">{isId ? idCopy.followersVsViews.labelFollowers : 'Followers'}</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-900">
                      {formatCount(50000)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-slate-400" style={{ width: '10%' }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600">
                      {isId ? idCopy.followersVsViews.labelViews : 'Average Views per Video'}
                    </span>
                    <span className="font-mono font-semibold tabular-nums text-teal-700">
                      {formatCount(65000)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-teal-600" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold font-display text-slate-800 sm:text-xl">
              {isId
                ? idCopy.followersVsViews.compareTitle
                : 'Model Comparison: High Followers vs. Consistent Video Views'}
            </h3>
            {/* Mobile View: Creator Comparison Cards (No horizontal scroll needed) */}
            <div className="mt-4 sm:hidden space-y-3">
              {activeCreatorRows.map((row) => (
                <div
                  key={row.metric}
                  className={`rounded-xl border p-4 shadow-sm bg-white ${
                    row.highlight ? 'border-teal-300 ring-1 ring-teal-500/20 bg-teal-50/20' : 'border-slate-200'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-2.5">
                    {row.metric}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2.5">
                    <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                      <span className="font-semibold text-slate-500 block text-[10px]">
                        Creator A (500K)
                      </span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">{row.creatorA}</span>
                    </div>
                    <div className="rounded-lg bg-teal-50/80 p-2.5 border border-teal-200">
                      <span className="font-semibold text-teal-700 block text-[10px]">
                        Creator B (50K)
                      </span>
                      <span className="font-bold text-teal-800 text-sm mt-0.5 block">{row.creatorB}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
                    <span className="font-semibold text-slate-700">Takeaway: </span>{row.insight}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop View: Full Data Table */}
            <div className="mt-4 hidden sm:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                <caption className="sr-only">
                  {isId
                    ? idCopy.followersVsViews.compareCaption
                    : 'Hypothetical comparison calculated using the KalkulatorTik valuation formula.'}
                </caption>
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 min-w-[130px]">
                      {isId ? idCopy.followersVsViews.thMetric : 'Metric / Model Step'}
                    </th>
                    <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 min-w-[140px]">
                      {isId ? idCopy.followersVsViews.thCreatorA : 'Creator A (500K Followers)'}
                    </th>
                    <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold text-teal-800 min-w-[140px]">
                      {isId ? idCopy.followersVsViews.thCreatorB : 'Creator B (50K Followers)'}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-900 min-w-[190px]">
                      {isId ? idCopy.followersVsViews.thWhy : 'Why It Matters'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {activeCreatorRows.map((row) => (
                    <tr
                      key={row.metric}
                      className={row.highlight ? 'bg-teal-50/70 font-semibold' : 'transition-colors hover:bg-slate-50/70'}
                    >
                      <th scope="row" className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                        {row.metric}
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">{row.creatorA}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-teal-800">{row.creatorB}</td>
                      <td className="px-4 py-3 text-slate-600 min-w-[190px]">{row.insight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2.5 text-xs italic text-slate-500">
              {isId
                ? idCopy.followersVsViews.tier3Note
                : "Note: Even inside the same Tier 3 market ($18.00 base avg CPM), Creator B's 65,000 average views and 9.40% engagement yield $1,298.70 per video ($19.98 Adjusted CPM)—9× more than Creator A's $143.68. Creator A and Creator B are hypothetical formula illustrations."}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-slate-200 pt-6">
            <div>
              <h3 className="text-base font-bold font-display text-slate-800 sm:text-lg">
                {isId ? idCopy.followersVsViews.stillMattersTitle : 'When Follower Count Still Matters'}
              </h3>
              <ol className="mt-2.5 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {(isId
                  ? idCopy.followersVsViews.stillMattersList
                  : [
                      <>
                        <strong>Brand Perception &amp; Social Proof:</strong> Some advertisers filter by follower
                        milestones as a quick baseline for creator authority.
                      </>,
                      <>
                        <strong>Community Familiarity:</strong> Repeat viewers from the Following tab often trust product
                        recommendations more than one-time viral traffic.
                      </>,
                      <>
                        <strong>Platform Feature Eligibility:</strong> Follower thresholds unlock native features such
                        as LIVE broadcasting and monetization applications.
                      </>,
                    ]
                ).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 p-5">
              <div>
                <h3 className="text-base font-bold font-display text-slate-800 sm:text-lg">
                  {isId ? idCopy.followersVsViews.rateCardTitle : 'Building a Balanced Creator Rate Card'}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {isId ? (
                    idCopy.followersVsViews.rateCardBody
                  ) : (
                    <>
                      Lead your media kit with <strong>average views across recent posts</strong>,{' '}
                      <strong>engagement rate</strong>, and high-retention examples. Followers reflect past growth;
                      recent video views reflect present commercial reach.
                    </>
                  )}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200 pt-3">
                <span className="text-[11px] font-medium text-slate-500">
                  {isId ? idCopy.followersVsViews.rateCardPrompt : 'Ready to run your own handle?'}
                </span>
                <button
                  type="button"
                  onClick={scrollToCalculator}
                  className="cursor-pointer text-xs font-semibold text-teal-700 hover:underline sm:text-sm"
                >
                  {isId ? idCopy.followersVsViews.rateCardBtn : <>Check Your Profile Benchmark &uarr;</>}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 8 — SPECIALIZED TIKTOK CALCULATOR TOOLS
           =================================================================== */}
        <section
          id="related-calculator-tools"
          aria-labelledby="section-8-heading"
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-8-heading"
            icon="tools"
            title={isId ? idCopy.relatedTools.title : 'Explore More Free TikTok Calculators'}
            description={
              isId
                ? idCopy.relatedTools.description
                : 'Sponsorship pricing works best alongside direct campaign cost modeling and manual interaction audits. Switch seamlessly between our specialized companion utilities below.'
            }
          />

          <div className="mt-7 grid grid-cols-1 gap-5">
            {/* Tool 1 */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 p-6 transition-colors hover:border-teal-400/80">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                    {isId ? idCopy.relatedTools.tool1Tag : 'Follower Interaction Audit'}
                  </span>
                  <span className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-600">
                    {isId ? idCopy.relatedTools.tool1Badge : 'Manual Input'}
                  </span>
                </div>
                <h3 className="mt-2.5 text-xl font-bold font-display text-slate-800">
                  <Link to="/tiktok-engagement-calculator" className="transition-colors hover:text-teal-700">
                    {isId ? idCopy.relatedTools.tool1Title : 'TikTok Engagement Rate Calculator'}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {isId ? (
                    idCopy.relatedTools.tool1Desc
                  ) : (
                    <>
                      Computes average like engagement per video from <strong>Total Likes</strong>,{' '}
                      <strong>Total Videos</strong>, and <strong>Total Followers</strong> (accepting full numbers or
                      shorthand like <code>277.8K</code> or <code>4.2M</code>) and compares results against follower-tier
                      benchmarks from <code>1K&ndash;5K</code> to <code>1M+</code>.
                    </>
                  )}
                </p>
                <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-xs text-slate-800">
                  {isId ? (
                    idCopy.relatedTools.tool1Formula
                  ) : (
                    <>((Total Likes &divide; Total Followers) &divide; Total Videos) &times; 100</>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  {isId
                    ? idCopy.relatedTools.tool1Best
                    : 'Best for creators auditing channel health, media-kit updates, and manual private-profile checks.'}
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <Link
                  to="/tiktok-engagement-calculator"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-teal-800 sm:w-auto sm:text-sm"
                >
                  {isId ? idCopy.relatedTools.tool1Cta : <>Open TikTok Engagement Rate Calculator &rarr;</>}
                </Link>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 p-6 transition-colors hover:border-teal-400/80">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                    {isId ? idCopy.relatedTools.tool2Tag : <>Advertising &amp; Campaign Math</>}
                  </span>
                  <span className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-600">
                    {isId ? idCopy.relatedTools.tool2Badge : '7 Currencies'}
                  </span>
                </div>
                <h3 className="mt-2.5 text-xl font-bold font-display text-slate-800">
                  <Link to="/tiktok-cpm-calculator" className="transition-colors hover:text-teal-700">
                    {isId ? idCopy.relatedTools.tool2Title : 'TikTok CPM Calculator'}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {isId ? (
                    idCopy.relatedTools.tool2Desc
                  ) : (
                    <>
                      A three-mode campaign planning utility across <code>USD</code>, <code>EUR</code>,{' '}
                      <code>GBP</code>, <code>CAD</code>, <code>AUD</code>, <code>INR</code>, and <code>PKR</code>.
                      Ideal for comparing a creator&apos;s quoted fee directly against paid TikTok ad impressions.
                    </>
                  )}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(isId
                    ? idCopy.relatedTools.tool2Modes
                    : ['Solve for CPM', 'Solve for Ad Spend', 'Solve for Impressions']
                  ).map((modeLabel) => (
                    <span
                      key={modeLabel}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs font-medium text-slate-700"
                    >
                      {modeLabel}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  {isId
                    ? idCopy.relatedTools.tool2Best
                    : 'Best for media buyers, marketing managers, and creators validating sponsorship ROI.'}
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <Link
                  to="/tiktok-cpm-calculator"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-900 transition-colors hover:border-teal-600 sm:w-auto sm:text-sm"
                >
                  {isId ? idCopy.relatedTools.tool2Cta : <>Open TikTok CPM Calculator &rarr;</>}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:flex-row sm:items-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  {isId ? idCopy.relatedTools.refreshTag : 'Standalone Refresh View'}
                </span>
                <span className="text-slate-400" aria-hidden="true">&middot;</span>
                <span className="text-xs font-medium text-teal-700">
                  {isId ? idCopy.relatedTools.refreshBadge : 'Includes Cache Refresh'}
                </span>
              </div>
              <h3 className="mt-1 text-base font-bold font-display text-slate-800">
                {isId ? idCopy.relatedTools.refreshTitle : 'Manual Cache-Refresh Profile Lookup'}
              </h3>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                {isId ? (
                  idCopy.relatedTools.refreshDesc
                ) : (
                  <>
                    Need to force a live re-fetch past the 1-hour server cache while checking an updated creator handle?
                    Use our dedicated refresh view with manual <strong>Refresh Data</strong> control.
                  </>
                )}
              </p>
            </div>
            <Link
              to="/calculator"
              className="inline-flex flex-shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-teal-600 sm:text-sm"
            >
              {isId ? idCopy.relatedTools.refreshCta : <>Open Cache-Refresh View &rarr;</>}
            </Link>
          </div>
        </section>

        {/* ===================================================================
            SECTION 9 — FREQUENTLY ASKED QUESTIONS
           =================================================================== */}
        <section
          id="frequently-asked-questions"
          aria-labelledby="section-9-heading"
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <SectionHeader
            id="section-9-heading"
            icon="faq"
            title={isId ? idCopy.faq.title : 'TikTok Money Calculator & Sponsorship Valuation FAQs'}
            description={
              isId
                ? idCopy.faq.description
                : 'Direct answers covering sponsorship methodology, public data privacy, fallback handling, and rate card negotiation.'
            }
            noDivider
          />

          <div className="mt-6 space-y-3">
            {activeFaqItems.map((item) => {
              const isOpen = Boolean(openFaqIds[item.id]);
              const panelId = `${item.id}-panel`;
              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/60 transition-colors hover:border-slate-300"
                >
                  <h3 className="m-0 font-display text-sm font-bold text-slate-900 sm:text-base">
                    <button
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-label={`${idCopy?.faq?.ariaTogglePrefix || 'Toggle answer for: '}${item.question}`}
                      className="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm font-bold text-slate-900 transition-colors hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:px-6 sm:py-[18px] sm:text-base"
                    >
                      <span>{item.question}</span>
                      <span
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors group-hover:border-slate-300 group-hover:text-slate-700"
                        aria-hidden="true"
                      >
                        <svg
                          className={`h-3.5 w-3.5 transform transition-transform duration-200 motion-reduce:transition-none ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    hidden={!isOpen}
                    className={`border-t border-slate-200/70 px-5 pb-5 pt-3.5 sm:px-6 ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <div className="text-xs leading-relaxed text-slate-600 sm:text-sm [&_code]:font-sans [&_code]:font-normal [&_code]:text-slate-600">
                      {item.answer}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs italic text-slate-600">
              {isId
                ? idCopy.faq.disclaimer
                : 'Answers reflect current methodology and general influencer marketing practices, and do not constitute financial, legal, or tax advice.'}
            </p>
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 sm:text-sm"
            >
              {isId ? idCopy.faq.viewAllLink : <>View Full Monetization FAQ &rarr;</>}
            </Link>
          </div>
        </section>

        {/* ===================================================================
            SECTION 10 — FINAL CTA AND DISCLAIMERS (CLEAN LIGHT CARDS)
           =================================================================== */}
        <section
          id="homepage-closing"
          aria-labelledby="section-10-heading"
          aria-label={
            idCopy?.closing?.sectionAriaLabel || 'Start a TikTok profile calculation or explore related tools'
          }
          className="space-y-6"
        >
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <SectionHeader
              id="section-10-heading"
              icon="cta"
              title={isId ? idCopy.closing.title : 'Ready to Benchmark Your TikTok Sponsorship Value?'}
              description={
                isId
                  ? idCopy.closing.description
                  : 'Whether calculating creator income for a rate card, validating an inbound sponsorship offer, or comparing campaign CPMs, enter a public TikTok username above or open a specialized calculator.'
              }
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToCalculator}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                {isId ? idCopy.closing.btnPrimary : <>Calculate by TikTok Username &uarr;</>}
              </button>
              <Link
                to="/tiktok-cpm-calculator"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-800 transition-colors hover:border-teal-600 hover:bg-white sm:text-sm"
              >
                {isId ? idCopy.closing.btnCpm : 'Open CPM Calculator'}
              </Link>
              <Link
                to="/tiktok-engagement-calculator"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-800 transition-colors hover:border-teal-600 hover:bg-white sm:text-sm"
              >
                {isId ? idCopy.closing.btnEng : 'Open Engagement Calculator'}
              </Link>
            </div>

            <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
              {isId ? (
                idCopy.closing.aboutLine
              ) : (
                <>
                  KalkulatorTik is an independent creator analytics platform. Learn more on our{' '}
                  <Link to="/about" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                    About KalkulatorTik
                  </Link>{' '}
                  page or read full platform answers in the{' '}
                  <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                    TikTok Monetization FAQ
                  </Link>
                  .
                </>
              )}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              {idCopy?.closing?.legalNotice || (
                <>
                  KalkulatorTik is not affiliated with, endorsed by, or officially connected to TikTok Inc. or ByteDance
                  Ltd.; all trademarks belong to their respective owners. Figures are informational estimates—review our{' '}
                  <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/terms" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                    Terms and Conditions
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(InfoSection);
