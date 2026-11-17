import React from 'react';
import { useTranslation } from 'react-i18next';
import LocaleLink from '../components/LocaleLink';
import useSEO from '../utils/useSEO';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  useSEO({
    title: t('seo.privacy.title', 'Privacy Policy | KalkulatorTik'),
    description: t(
      'seo.privacy.description',
      'Read the KalkulatorTik Privacy Policy. Learn how we handle public data, cookies, and website analytics transparently when you use our TikTok calculators.'
    ),
    canonicalPath: '/privacy',
  });

  return (
    <div className="min-h-screen bg-slate-50 transition-colors">
      <div className="container mx-auto max-w-4xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          {/* Main Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-6 sm:text-3xl sm:mb-7 md:text-4xl md:mb-8 lg:text-5xl">
            {t('privacy.title')}
          </h1>

          {/* Introduction */}
          <div className="mb-8 sm:mb-10">
            <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
              {t('privacy.intro')}
            </p>
          </div>

          {/* Information We Collect */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-3 sm:text-2xl sm:mb-4">
              {t('privacy.infoWeCollect.title')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.infoWeCollect.description')}
              </p>
            </div>
          </section>

          {/* Automatically Collected Information */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-3 sm:text-2xl sm:mb-4">
              {t('privacy.autoCollected.title')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.autoCollected.description1')}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.autoCollected.description2')}
              </p>
            </div>
          </section>

          {/* Use of Cookies */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-3 sm:text-2xl sm:mb-4">
              {t('privacy.cookies.title')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.cookies.description1')}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.cookies.description2')}
              </p>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-3 sm:text-2xl sm:mb-4">
              {t('privacy.howWeUseInfo.title')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.howWeUseInfo.description')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 leading-relaxed sm:text-base ml-4">
                <li>{t('privacy.howWeUseInfo.item1')}</li>
                <li>{t('privacy.howWeUseInfo.item2')}</li>
                <li>{t('privacy.howWeUseInfo.item3')}</li>
                <li>{t('privacy.howWeUseInfo.item4')}</li>
              </ul>
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.howWeUseInfo.note')}
              </p>
            </div>
          </section>

          {/* Third-Party Links */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-3 sm:text-2xl sm:mb-4">
              {t('privacy.thirdPartyLinks.title')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.thirdPartyLinks.description')}
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-3 sm:text-2xl sm:mb-4">
              {t('privacy.dataSecurity.title')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.dataSecurity.description')}
              </p>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-3 sm:text-2xl sm:mb-4">
              {t('privacy.policyUpdates.title')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.policyUpdates.description')}
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3 sm:text-2xl sm:mb-4">
              {t('privacy.contactUs.title')}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed sm:text-base">
                {t('privacy.contactUs.description')}{' '}
                <LocaleLink
                  to="/contact"
                  className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                >
                  {t('contact.title')}
                </LocaleLink>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

