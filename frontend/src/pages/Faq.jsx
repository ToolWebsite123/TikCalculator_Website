import React, { useState } from 'react';
import Link from '../components/LocaleLink';
import { useTranslation } from 'react-i18next';
import useSEO from '../utils/useSEO';

const Faq = () => {
  const { t } = useTranslation();

  useSEO({
    title: t(
      'seo.faq.title',
      'TikTok Monetization & Money Calculator FAQ | KalkulatorTik'
    ),
    description: t(
      'seo.faq.description',
      'Find verified answers on TikTok Creator Rewards eligibility, qualified views, RPM calculation, and how KalkulatorTik calculates creator earning metrics.'
    ),
    canonicalPath: '/faq',
  });

  // State to track expanded questions (default all open or open on click)
  const [openItems, setOpenItems] = useState({
    's1-q1': true,
    's1-q2': true,
    's1-q3': true,
    's2-q1': true,
    's2-q2': true,
    's2-q3': true,
    's3-q1': true,
    's3-q2': true,
    's3-q3': true,
    's3-q4': true,
    's4-q1': true,
    's4-q2': true,
  });

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Structured Sections and Questions
  const sections = [
    {
      id: 'section1',
      title: t('faq.sections.section1.title'),
      items: [
        {
          key: 's1-q1',
          q: t('faq.sections.section1.q1.question'),
          a: t('faq.sections.section1.q1.answer'),
        },
        {
          key: 's1-q2',
          q: t('faq.sections.section1.q2.question'),
          a: t('faq.sections.section1.q2.answer'),
        },
        {
          key: 's1-q3',
          q: t('faq.sections.section1.q3.question'),
          a: t('faq.sections.section1.q3.answer'),
        },
      ],
    },
    {
      id: 'section2',
      title: t('faq.sections.section2.title'),
      items: [
        {
          key: 's2-q1',
          q: t('faq.sections.section2.q1.question'),
          a: t('faq.sections.section2.q1.answer'),
        },
        {
          key: 's2-q2',
          q: t('faq.sections.section2.q2.question'),
          a: t('faq.sections.section2.q2.answer'),
        },
        {
          key: 's2-q3',
          q: t('faq.sections.section2.q3.question'),
          a: t('faq.sections.section2.q3.answer'),
        },
      ],
    },
    {
      id: 'section3',
      title: t('faq.sections.section3.title'),
      items: [
        {
          key: 's3-q1',
          q: t('faq.sections.section3.q1.question'),
          a: t('faq.sections.section3.q1.answer'),
          link: {
            to: '/',
            text: 'TikTok Money Calculator',
          },
        },
        {
          key: 's3-q2',
          q: t('faq.sections.section3.q2.question'),
          a: t('faq.sections.section3.q2.answer'),
          link: {
            to: '/tiktok-cpm-calculator',
            text: 'TikTok CPM Calculator',
          },
        },
        {
          key: 's3-q3',
          q: t('faq.sections.section3.q3.question'),
          a: t('faq.sections.section3.q3.answer'),
          link: {
            to: '/tiktok-engagement-calculator',
            text: 'TikTok Engagement Calculator',
          },
        },
        {
          key: 's3-q4',
          q: t('faq.sections.section3.q4.question'),
          a: t('faq.sections.section3.q4.answer'),
          link: {
            to: '/privacy',
            text: 'Privacy Policy',
          },
        },
      ],
    },
    {
      id: 'section4',
      title: t('faq.sections.section4.title'),
      items: [
        {
          key: 's4-q1',
          q: t('faq.sections.section4.q1.question'),
          a: t('faq.sections.section4.q1.answer'),
        },
        {
          key: 's4-q2',
          q: t('faq.sections.section4.q2.question'),
          a: t('faq.sections.section4.q2.answer'),
        },
      ],
    },
  ];

  // Build FAQPage Schema JSON-LD for rich snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sections.flatMap((section) =>
      section.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto max-w-4xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        {/* Page Header with Single H1 */}
        <header className="text-center mb-10 sm:mb-12 md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 sm:text-sm mb-2">
            KalkulatorTik Knowledge Base
          </p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            {t('faq.pageTitle')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
            {t('faq.pageSubtitle')}
          </p>
        </header>

        {/* 4 Thematic Sections */}
        <div className="space-y-10 sm:space-y-12 md:space-y-14">
          {sections.map((section) => (
            <section key={section.id} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl pb-2 border-b border-slate-200">
                {section.title}
              </h2>

              <div className="space-y-3 sm:space-y-4 pt-2">
                {section.items.map((item) => {
                  const isOpen = openItems[item.key];
                  return (
                    <article
                      key={item.key}
                      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 transition-all shadow-sm hover:border-teal-300 hover:shadow"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(item.key)}
                        className="flex w-full items-start justify-between text-left gap-4 text-slate-900 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 rounded-md cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <h3 className="text-base font-semibold text-inherit sm:text-lg">
                          {item.q}
                        </h3>
                        <span className="ml-2 flex-shrink-0 text-slate-600" aria-hidden="true">
                          <svg
                            className={`h-5 w-5 transform transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </button>

                      {isOpen && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                            {item.a}
                          </p>
                          {item.link && (
                            <div className="mt-3">
                              <Link
                                to={item.link.to}
                                className="inline-flex items-center rounded-md px-1 py-0.5 text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 transition"
                              >
                                <span>Go to {item.link.text} &rarr;</span>
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA / Verification Notice */}
        <div className="mt-14 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
            Need to calculate your specific profile metrics?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-4">
            Try our suite of free tools to estimate earnings benchmarks, calculate ad campaign CPM, and analyze video engagement.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs sm:text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 transition shadow-sm"
            >
              TikTok Money Calculator
            </Link>
            <Link
              to="/tiktok-engagement-calculator"
              className="px-4 py-2 rounded-lg bg-slate-50 text-slate-900 border border-slate-300 hover:border-teal-600 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 text-xs sm:text-sm font-semibold transition"
            >
              Engagement Calculator
            </Link>
            <Link
              to="/tiktok-cpm-calculator"
              className="px-4 py-2 rounded-lg bg-slate-50 text-slate-900 border border-slate-300 hover:border-teal-600 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 text-xs sm:text-sm font-semibold transition"
            >
              CPM Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
