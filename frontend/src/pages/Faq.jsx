import React from 'react';
import { useTranslation } from 'react-i18next';
import useSEO from '../utils/useSEO';

const Faq = () => {
  const { t } = useTranslation();

  useSEO({
    title: 'FAQ – TikTok Money Calculator Questions & Answers',
    description: 'Frequently asked questions about TikTok earnings, engagement rates, CPM calculations, and how to monetize your TikTok account.',
    canonicalPath: '/faq',
  });

  const faqs = [
    {
      q: t('faq.questions.q1'),
      a: t('faq.questions.a1'),
    },
    {
      q: t('faq.questions.q2'),
      a: t('faq.questions.a2'),
    },
    {
      q: t('faq.questions.q3'),
      a: t('faq.questions.a3'),
    },
    {
      q: t('faq.questions.q4'),
      a: t('faq.questions.a4'),
    },
  ];

  return (
    <section className="mx-auto max-w-4xl space-y-4 px-3 py-6 sm:space-y-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
      <div>
        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 sm:text-sm">{t('faq.title')}</p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl md:text-4xl">{t('faq.subtitle')}</h2>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:rounded-xl sm:p-4 md:p-5 transition-colors">
            <p className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base md:text-lg">{item.q}</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-white leading-relaxed sm:mt-2.5 sm:text-sm">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;

