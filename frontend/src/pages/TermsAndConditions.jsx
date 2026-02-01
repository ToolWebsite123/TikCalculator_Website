import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsAndConditions = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto max-w-4xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        {/* Main Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:text-3xl sm:mb-7 md:text-4xl md:mb-8 lg:text-5xl">
          {t('terms.title')}
        </h1>

        {/* Introduction */}
        <div className="mb-8 sm:mb-10">
          <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
            {t('terms.intro')}
          </p>
        </div>

        {/* Acceptance of Terms */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.acceptance.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.acceptance.description')}
            </p>
          </div>
        </section>

        {/* Purpose of the Service */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.purposeOfService.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.purposeOfService.description1')}
            </p>
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.purposeOfService.description2')}
            </p>
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.purposeOfService.description3')}
            </p>
          </div>
        </section>

        {/* User Responsibility */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.userResponsibility.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.userResponsibility.description1')}
            </p>
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.userResponsibility.description2')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base ml-4">
              <li>{t('terms.userResponsibility.item1')}</li>
              <li>{t('terms.userResponsibility.item2')}</li>
              <li>{t('terms.userResponsibility.item3')}</li>
            </ul>
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.userResponsibility.description3')}
            </p>
          </div>
        </section>

        {/* Intellectual Property Rights */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.intellectualPropertyRights.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.intellectualPropertyRights.description1')}
            </p>
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.intellectualPropertyRights.description2')}
            </p>
          </div>
        </section>

        {/* Accuracy Disclaimer */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.accuracyDisclaimer.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.accuracyDisclaimer.description1')}
            </p>
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.accuracyDisclaimer.description2')}
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.limitationOfLiability.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.limitationOfLiability.description1')}
            </p>
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.limitationOfLiability.description2')}
            </p>
          </div>
        </section>

        {/* Third-Party Links */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.thirdPartyLinks.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.thirdPartyLinks.description')}
            </p>
          </div>
        </section>

        {/* Termination of Access */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.terminationOfAccess.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.terminationOfAccess.description')}
            </p>
          </div>
        </section>

        {/* Changes to Terms */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.changesToTerms.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.changesToTerms.description1')}
            </p>
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.changesToTerms.description2')}
            </p>
          </div>
        </section>

        {/* Contact Us */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:text-2xl sm:mb-4">
            {t('terms.contactUs.title')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm text-gray-700 dark:text-white leading-relaxed sm:text-base">
              {t('terms.contactUs.description')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;

