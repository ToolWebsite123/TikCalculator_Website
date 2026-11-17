import React from 'react';
import { useTranslation } from 'react-i18next';
import LocaleLink from '../components/LocaleLink';
import useSEO from '../utils/useSEO';
import { useActiveLang } from '../contexts/LocaleContext';
import { BASE_URL, buildLocalizedPath } from '../utils/localeRouting';

const About = () => {
  const { t } = useTranslation();
  const activeLang = useActiveLang();

  const localizedAboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    inLanguage: activeLang,
    '@id': `${BASE_URL}${buildLocalizedPath('/about', activeLang)}#webpage`,
    url: `${BASE_URL}${buildLocalizedPath('/about', activeLang)}`,
    name: t('seo.about.title', 'About KalkulatorTik | Free TikTok Analytics & Tools'),
    description: t(
      'seo.about.description',
      'Discover KalkulatorTik, a trusted TikTok Money Calculator built to help creators and brands estimate earnings, analyze engagement, and grow smarter on TikTok.'
    ),
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'KalkulatorTik',
      url: `${BASE_URL}/`,
      logo: `${BASE_URL}/icon-512.png`,
    },
  };

  useSEO({
    title: t(
      'seo.about.title',
      'About KalkulatorTik | Free TikTok Analytics & Tools'
    ),
    description: t(
      'seo.about.description',
      'Discover KalkulatorTik, a trusted TikTok Money Calculator built to help creators and brands estimate earnings, analyze engagement, and grow smarter on TikTok.'
    ),
    canonicalPath: '/about',
    structuredData: localizedAboutSchema,
  });

  return (
    <div className="min-h-screen bg-slate-50 transition-colors">
      <div className="container mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 md:p-10 shadow-sm">
          {/* Title */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-2xl font-bold text-slate-900 mb-3 sm:text-3xl sm:mb-4 md:text-4xl lg:text-5xl">
              {t('about.title')}
            </h1>
          </div>

          {/* Welcome Section */}
          <article className="prose prose-slate max-w-none mb-8 sm:mb-10">
            <p className="text-base text-slate-700 leading-relaxed mb-4 sm:text-lg">
              {t('about.welcome')}
            </p>
          </article>

          {/* Our Mission */}
          <article className="prose prose-slate max-w-none mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 sm:text-2xl md:text-3xl">
              {t('about.mission.title')}
            </h2>
            <p className="text-base text-slate-700 leading-relaxed sm:text-lg">
              {t('about.mission.description')}
            </p>
          </article>

          {/* What We Offer */}
          <article className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 sm:text-2xl md:text-3xl">
              {t('about.whatWeOffer.title')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 transition hover:border-teal-300 hover:bg-white hover:shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-1.5 sm:text-lg">
                  <LocaleLink
                    to="/"
                    className="inline-flex items-center text-teal-700 hover:text-teal-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
                  >
                    <span>{t('about.whatWeOffer.earningsCalculator.title')}</span>
                    <span className="ml-1" aria-hidden="true">&rarr;</span>
                  </LocaleLink>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('about.whatWeOffer.earningsCalculator.description')}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 transition hover:border-teal-300 hover:bg-white hover:shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-1.5 sm:text-lg">
                  <LocaleLink
                    to="/tiktok-cpm-calculator"
                    className="inline-flex items-center text-teal-700 hover:text-teal-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
                  >
                    <span>{t('about.whatWeOffer.cpmCalculator.title')}</span>
                    <span className="ml-1" aria-hidden="true">&rarr;</span>
                  </LocaleLink>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('about.whatWeOffer.cpmCalculator.description')}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 transition hover:border-teal-300 hover:bg-white hover:shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-1.5 sm:text-lg">
                  <LocaleLink
                    to="/tiktok-engagement-calculator"
                    className="inline-flex items-center text-teal-700 hover:text-teal-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
                  >
                    <span>{t('about.whatWeOffer.engagementCalculator.title')}</span>
                    <span className="ml-1" aria-hidden="true">&rarr;</span>
                  </LocaleLink>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('about.whatWeOffer.engagementCalculator.description')}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 transition hover:border-teal-300 hover:bg-white hover:shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-1.5 sm:text-lg">
                  <LocaleLink
                    to="/faq"
                    className="inline-flex items-center text-teal-700 hover:text-teal-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
                  >
                    <span>{t('about.whatWeOffer.guidesTips.title')}</span>
                    <span className="ml-1" aria-hidden="true">&rarr;</span>
                  </LocaleLink>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('about.whatWeOffer.guidesTips.description')}
                </p>
              </div>
            </div>
          </article>

          {/* Our Team */}
          <article className="prose prose-slate max-w-none mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 sm:text-2xl md:text-3xl">
              {t('about.ourTeam.title')}
            </h2>
            <p className="text-base text-slate-700 leading-relaxed sm:text-lg">
              {t('about.ourTeam.description')}
            </p>
          </article>

          {/* Join Us */}
          <article className="prose prose-slate max-w-none">
            <h2 className="text-xl font-bold text-slate-900 mb-4 sm:text-2xl md:text-3xl">
              {t('about.joinUs.title')}
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-4 sm:text-lg">
              {t('about.joinUs.description')}
            </p>
            <p className="text-base text-slate-700 leading-relaxed sm:text-lg font-medium text-teal-900">
              {t('about.joinUs.thankYou')}
            </p>
          </article>
        </div>
      </div>
    </div>
  );
};

export default About;
