import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  // SEO: Update page title and meta description
  useEffect(() => {
    document.title = 'About TikCalculator | Smart & Reliable TikTok Money Calculator';
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Discover TikCalculator, a trusted TikTok Money Calculator built to help creators and brands estimate earnings, analyze engagement, and grow smarter on TikTok.');
    
    // Update Open Graph meta tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'About TikCalculator | Smart & Reliable TikTok Money Calculator');
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', 'Discover TikCalculator, a trusted TikTok Money Calculator built to help creators and brands estimate earnings, analyze engagement, and grow smarter on TikTok.');
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto max-w-4xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:text-3xl sm:mb-4 md:text-4xl lg:text-5xl">
            {t('about.title')}
          </h1>
        </div>

        {/* Welcome Section */}
        <article className="prose prose-gray dark:prose-invert max-w-none mb-8 sm:mb-10">
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:text-lg">
            {t('about.welcome')}
          </p>
        </article>

        {/* Our Mission */}
        <article className="prose prose-gray dark:prose-invert max-w-none mb-8 sm:mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:text-2xl md:text-3xl">
            {t('about.mission.title')}
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed sm:text-lg">
            {t('about.mission.description')}
          </p>
        </article>

        {/* What We Offer */}
        <article className="prose prose-gray dark:prose-invert max-w-none mb-8 sm:mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:text-2xl md:text-3xl">
            {t('about.whatWeOffer.title')}
          </h2>
          <ul className="list-disc list-inside space-y-3 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
            <li>
              <strong>{t('about.whatWeOffer.engagementCalculator.title')}:</strong> {t('about.whatWeOffer.engagementCalculator.description')}
            </li>
            <li>
              <strong>{t('about.whatWeOffer.earningsCalculator.title')}:</strong> {t('about.whatWeOffer.earningsCalculator.description')}
            </li>
            <li>
              <strong>{t('about.whatWeOffer.guidesTips.title')}:</strong> {t('about.whatWeOffer.guidesTips.description')}
            </li>
          </ul>
        </article>

        {/* Our Team */}
        <article className="prose prose-gray dark:prose-invert max-w-none mb-8 sm:mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:text-2xl md:text-3xl">
            {t('about.ourTeam.title')}
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed sm:text-lg">
            {t('about.ourTeam.description')}
          </p>
        </article>

        {/* Join Us */}
        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:text-2xl md:text-3xl">
            {t('about.joinUs.title')}
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:text-lg">
            {t('about.joinUs.description')}
          </p>
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed sm:text-lg">
            {t('about.joinUs.thankYou')}
          </p>
        </article>
      </div>
    </div>
  );
};

export default About;

