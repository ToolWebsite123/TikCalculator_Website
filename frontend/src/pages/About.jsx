import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-4xl space-y-4 px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl md:text-4xl">{t('about.title')}</h2>
      <p className="text-sm text-slate-600 dark:text-white leading-relaxed sm:text-base">
        {t('about.description1')}
      </p>
      <p className="text-sm text-slate-600 dark:text-white leading-relaxed sm:text-base">
        {t('about.description2')}
      </p>
    </section>
  );
};

export default About;

