import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * BoostEarnings Component
 * Displays tips and strategies for boosting TikTok earnings
 */
const BoostEarnings = () => {
  const { t } = useTranslation();
  
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:text-2xl sm:mb-3">
        {t('infoSection.boostEarningsHeading')}
      </h2>
      <div className="space-y-4 leading-relaxed">
        <p className="text-gray-600 dark:text-white text-sm sm:text-base">
          {t('infoSection.boostEarningsIntro')}
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-600 dark:text-white text-sm sm:text-base ml-2 sm:ml-4">
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.stayConsistentLabel')}</strong>{' '}
            {t('infoSection.stayConsistentDescription')}
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.diversifyContentLabel')}</strong>{' '}
            {t('infoSection.diversifyContentDescription')}
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.engageWithFollowersLabel')}</strong>{' '}
            {t('infoSection.engageWithFollowersDescription')}
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.followTrendsLabel')}</strong>{' '}
            {t('infoSection.followTrendsDescription')}
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.collaborateWithOthersLabel')}</strong>{' '}
            {t('infoSection.collaborateWithOthersDescription')}
          </li>
        </ul>
        <p className="text-gray-600 dark:text-white text-sm sm:text-base">
          {t('infoSection.boostEarningsConclusion')}
        </p>
      </div>
    </section>
  );
};

export default BoostEarnings;

