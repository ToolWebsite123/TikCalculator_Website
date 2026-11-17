import React from 'react';
import { useTranslation } from 'react-i18next';
import useSEO from '../utils/useSEO';

const About = () => {
  const { t } = useTranslation();

  useSEO({
    title: t(
      'seo.about.title',
      'About KalkulatorTik | Smart & Reliable TikTok Money Calculator'
    ),
    description: t(
      'seo.about.description',
      'Discover KalkulatorTik, a trusted TikTok Money Calculator built to help creators and brands estimate earnings, analyze engagement, and grow smarter on TikTok.'
    ),
    canonicalPath: '/about',
  });

  return (
    <div className="min-h-screen bg-slate-50 transition-colors">
      <div className="container mx-auto max-w-4xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
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
          <article className="prose prose-slate max-w-none mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 sm:text-2xl md:text-3xl">
              {t('about.whatWeOffer.title')}
            </h2>
            <ul className="list-disc list-inside space-y-3 text-base text-slate-700 sm:text-lg">
              <li>
                <strong className="text-slate-900">{t('about.whatWeOffer.engagementCalculator.title')}:</strong> {t('about.whatWeOffer.engagementCalculator.description')}
              </li>
              <li>
                <strong className="text-slate-900">{t('about.whatWeOffer.earningsCalculator.title')}:</strong> {t('about.whatWeOffer.earningsCalculator.description')}
              </li>
              <li>
                <strong className="text-slate-900">{t('about.whatWeOffer.guidesTips.title')}:</strong> {t('about.whatWeOffer.guidesTips.description')}
              </li>
            </ul>
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
            <p className="text-base text-slate-700 leading-relaxed sm:text-lg">
              {t('about.joinUs.thankYou')}
            </p>
          </article>
        </div>
      </div>
    </div>
  );
};

export default About;

