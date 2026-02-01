import React from 'react';
import { useTranslation } from 'react-i18next';
import EarningsPotential from './EarningsPotential';
import BoostEarnings from './BoostEarnings';

/**
 * InfoSection Component
 * SEO-optimized content section with keywords:
 * - TikTok money calculator
 * - TikTok earnings estimator
 * - TikTok earnings calculator
 */
const InfoSection = () => {
  const { t } = useTranslation();
  
  return (
    <article className="max-w-4xl mx-auto py-8 px-3 sm:py-10 sm:px-4 md:py-12 md:px-6">
      
      {/* What is TikTok Money Calculator? */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:text-2xl sm:mb-3">
          {t('infoSection.whatIsTikTokMoneyCalculator')}
        </h2>
        <div className="space-y-4 leading-relaxed">
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            {t('infoSection.paragraph1')}
          </p>
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            {t('infoSection.paragraph2')}
          </p>
        </div>
      </section>

      {/* How Estimates Work */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:text-2xl sm:mb-3">
          {t('infoSection.howItWorksHeading')}
        </h2>
        <div className="space-y-4 leading-relaxed">
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            {t('infoSection.howItWorksParagraph1')}
          </p>
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            {t('infoSection.howItWorksParagraph2')}
          </p>
        </div>
      </section>

      {/* How to Check */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:text-2xl sm:mb-3">
          {t('infoSection.howToCheckHeading')}
        </h2>
        <div className="space-y-4 leading-relaxed">
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            {t('infoSection.howToCheckIntro')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-white text-sm sm:text-base ml-2 sm:ml-4">
            <li>{t('infoSection.howToCheckPoint1')}</li>
            <li>{t('infoSection.howToCheckPoint2')}</li>
            <li>{t('infoSection.howToCheckPoint3')}</li>
            <li>{t('infoSection.howToCheckPoint4')}</li>
            <li>{t('infoSection.howToCheckPoint5')}</li>
          </ul>
        </div>
      </section>

      {/* Why People Use */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:text-2xl sm:mb-3">
          {t('infoSection.whyPeopleUseHeading')}
        </h2>
        <div className="space-y-4 leading-relaxed">
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            {t('infoSection.whyPeopleUseParagraph1')}
          </p>
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            {t('infoSection.whyPeopleUseParagraph2')}
          </p>
        </div>
      </section>

      {/* Earnings Potential */}
      <EarningsPotential />

      {/* Earnings Guide */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:text-2xl sm:mb-3">
          {t('infoSection.earningsByFollowersHeading')}
        </h2>
        <div className="space-y-4 leading-relaxed">
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            {t('infoSection.earningsByFollowersIntro')}
          </p>
          <ul className="list-disc list-inside space-y-3 text-gray-600 dark:text-white text-sm sm:text-base ml-2 sm:ml-4">
            <li>
              <strong className="text-gray-800 dark:text-white">{t('infoSection.range1Label')}</strong>{' '}
              {t('infoSection.range1Value')}
            </li>
            <li>
              <strong className="text-gray-800 dark:text-white">{t('infoSection.range2Label')}</strong>{' '}
              {t('infoSection.range2Value')}
            </li>
            <li>
              <strong className="text-gray-800 dark:text-white">{t('infoSection.range3Label')}</strong>{' '}
              {t('infoSection.range3Value')}
            </li>
            <li>
              <strong className="text-gray-800 dark:text-white">{t('infoSection.range4Label')}</strong>{' '}
              {t('infoSection.range4Value')}
            </li>
            <li>
              <strong className="text-gray-800 dark:text-white">{t('infoSection.range5Label')}</strong>{' '}
              {t('infoSection.range5Value')}
            </li>
          </ul>
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            {t('infoSection.earningsByFollowersConclusion')}
          </p>
        </div>
      </section>

      {/* Boost Earnings */}
      <BoostEarnings />

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:text-2xl sm:mb-3">
          {t('infoSection.faqHeading')}
        </h2>
        <div className="space-y-4 leading-relaxed sm:space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq1Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq1Answer')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq2Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq2Answer')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq3Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq3Answer')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq4Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq4Answer')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq5Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq5Answer')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq6Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq6Answer')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq7Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq7Answer')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq8Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq8Answer')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq9Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq9Answer')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1.5 text-sm sm:text-base sm:mb-2">
              {t('infoSection.faq10Question')}
            </h3>
            <p className="text-gray-600 dark:text-white text-sm sm:text-base">
              {t('infoSection.faq10Answer')}
            </p>
          </div>
        </div>
      </section>
    </article>
  );
};

export default InfoSection;
