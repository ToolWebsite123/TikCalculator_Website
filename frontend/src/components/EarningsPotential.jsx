import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * EarningsPotential Component
 * Displays information about TikTok earning potential and factors
 */
const EarningsPotential = () => {
  const { t } = useTranslation();
  
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:text-2xl sm:mb-3">
        {t('infoSection.earningsPotentialHeading')}
      </h2>
      <div className="space-y-4 leading-relaxed">
        <p className="text-gray-600 dark:text-white text-sm sm:text-base">
          {t('infoSection.earningsPotentialIntro')}
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-600 dark:text-white text-sm sm:text-base ml-2 sm:ml-4">
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.followerCountLabel')}</strong>{' '}
            {t('infoSection.followerCountDescription')}
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.engagementRateLabel')}</strong>{' '}
            {t('infoSection.engagementRateDescription')}
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.monetizationMethodsLabel')}</strong>{' '}
            {t('infoSection.monetizationMethodsDescription')}
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.brandPartnershipsLabel')}</strong>{' '}
            {t('infoSection.brandPartnershipsDescription')}
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">{t('infoSection.audienceLocationLabel')}</strong>{' '}
            {t('infoSection.audienceLocationDescription')}
          </li>
        </ul>
        <p className="text-gray-600 dark:text-white text-sm sm:text-base">
          {t('infoSection.earningsPotentialConclusion')}
        </p>
      </div>
    </section>
  );
};

export default EarningsPotential;



