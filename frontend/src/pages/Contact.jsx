import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocaleLink from '../components/LocaleLink';
import { submitContactMessage } from '../utils/api';
import useSEO from '../utils/useSEO';

export const CONTACT_FORM_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  subjectMax: 150,
  messageMin: 10,
  messageMax: 2000,
  emailMax: 254,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateContactFields = ({ name = '', email = '', subject = '', message = '' }, t) => {
  const errors = {};
  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();
  const trimmedSubject = String(subject).trim();
  const trimmedMessage = String(message).trim();

  if (trimmedName.length < CONTACT_FORM_LIMITS.nameMin || trimmedName.length > CONTACT_FORM_LIMITS.nameMax) {
    errors.name = t(
      'contact.errorNameRequired',
      'Please enter at least 2 characters for your name.'
    );
  }

  if (
    !trimmedEmail ||
    trimmedEmail.length > CONTACT_FORM_LIMITS.emailMax ||
    !EMAIL_PATTERN.test(trimmedEmail)
  ) {
    errors.email = t('contact.errorEmailInvalid', 'Please enter a valid email address.');
  }

  if (trimmedSubject.length > CONTACT_FORM_LIMITS.subjectMax) {
    errors.subject = t(
      'contact.errorSubjectLength',
      `Subject must be ${CONTACT_FORM_LIMITS.subjectMax} characters or fewer.`
    );
  }

  if (
    trimmedMessage.length < CONTACT_FORM_LIMITS.messageMin ||
    trimmedMessage.length > CONTACT_FORM_LIMITS.messageMax
  ) {
    errors.message = t(
      'contact.errorMessageLength',
      'Message must be between 10 and 2,000 characters.'
    );
  }

  return errors;
};

const Contact = ({ enabled }) => {
  const { t } = useTranslation();
  const isFormEnabled =
    typeof enabled === 'boolean' ? enabled : import.meta.env.VITE_CONTACT_ENABLED === 'true';

  useSEO({
    title: t(
      'seo.contact.title',
      'Contact KalkulatorTik – Creator Support & Feedback'
    ),
    description: t(
      'seo.contact.description',
      'Get in touch with KalkulatorTik. Contact our team for support, feature requests, or questions about our free TikTok money calculators and creator tools.'
    ),
    canonicalPath: '/contact',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', text: string }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormEnabled || submitting) {
      return;
    }

    const errors = validateContactFields(formData, t);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitStatus(null);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setSubmitStatus(null);

    try {
      const response = await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        website: formData.website,
      });

      if (response?.success) {
        setSubmitStatus({
          type: 'success',
          text:
            t('contact.successMessage') ||
            'Thank you! Your message has been sent successfully.',
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          website: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          text:
            t(
              'contact.errorDeliveryFailed',
              'Unable to send your message right now. Please try again later.'
            ),
        });
      }
    } catch (err) {
      const status = err?.status ?? err?.response?.status;
      const serverErrors = err?.response?.data?.errors;
      if (serverErrors && typeof serverErrors === 'object') {
        setFieldErrors(serverErrors);
      }

      if (status === 429) {
        setSubmitStatus({
          type: 'error',
          text: t(
            'contact.errorRateLimit',
            'Too many submissions sent. Please wait before trying again.'
          ),
        });
      } else if (status === 503) {
        setSubmitStatus({
          type: 'error',
          text: t(
            'contact.errorUnavailable',
            'Online message delivery is currently unavailable.'
          ),
        });
      } else if (status === 400) {
        setSubmitStatus({
          type: 'error',
          text:
            err?.response?.data?.error ||
            err?.message ||
            t(
              'contact.errorDeliveryFailed',
              'Unable to send your message right now. Please try again later.'
            ),
        });
      } else {
        setSubmitStatus({
          type: 'error',
          text: t(
            'contact.errorDeliveryFailed',
            'Unable to send your message right now. Please try again later.'
          ),
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resourceLinks = [
    {
      to: '/faq',
      label: t('contact.resourceFaq', 'Frequently Asked Questions'),
    },
    {
      to: '/about',
      label: t('contact.resourceAbout', 'About KalkulatorTik'),
    },
    {
      to: '/privacy',
      label: t('contact.resourcePrivacy', 'Privacy Policy'),
    },
    {
      to: '/terms',
      label: t('contact.resourceTerms', 'Terms & Conditions'),
    },
  ];

  const baseInputClass = isFormEnabled
    ? 'w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-sm sm:text-base transition'
    : 'w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-700 placeholder:text-slate-500 cursor-not-allowed text-sm sm:text-base';

  return (
    <div className="min-h-screen bg-slate-50 transition-colors">
      {/* Main Contact Section */}
      <section className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:py-20">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-3 sm:text-4xl sm:mb-4 md:text-5xl">
            {t('contact.title')}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg">
            {t('contact.subtitle') || "Get in touch with us. We'd love to hear from you!"}
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 md:p-10 border border-slate-200">
          {!isFormEnabled && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm sm:text-base leading-relaxed">
                  {t('contact.notice') ||
                    'Online message submission is currently unavailable because no support inbox is connected yet. While disabled, this form does not collect, store, or transmit personal details.'}
                </p>
              </div>
            </div>
          )}

          {submitStatus && (
            <div
              role={submitStatus.type === 'error' ? 'alert' : 'status'}
              aria-live="polite"
              className={`mb-6 rounded-xl border p-4 text-sm sm:text-base ${
                submitStatus.type === 'success'
                  ? 'border-teal-200 bg-teal-50 text-teal-900'
                  : 'border-red-200 bg-red-50 text-red-900'
              }`}
            >
              {submitStatus.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Hidden honeypot anti-spam trap */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={handleChange}
                disabled={!isFormEnabled}
              />
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                {t('contact.name') || 'Name'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isFormEnabled}
                maxLength={CONTACT_FORM_LIMITS.nameMax}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                className={baseInputClass}
                placeholder={t('contact.namePlaceholder') || 'Enter your name'}
              />
              {fieldErrors.name && (
                <p id="contact-name-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                {t('contact.emailLabel') || 'Email'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isFormEnabled}
                maxLength={CONTACT_FORM_LIMITS.emailMax}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                className={baseInputClass}
                placeholder={t('contact.emailPlaceholder') || 'Enter your email'}
              />
              {fieldErrors.email && (
                <p id="contact-email-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Subject Field */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                {t('contact.subject') || 'Subject (Optional)'}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={!isFormEnabled}
                maxLength={CONTACT_FORM_LIMITS.subjectMax}
                aria-invalid={Boolean(fieldErrors.subject)}
                aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
                className={baseInputClass}
                placeholder={t('contact.subjectPlaceholder') || 'Topic of your question'}
              />
              {fieldErrors.subject && (
                <p id="contact-subject-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                  {fieldErrors.subject}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-slate-800"
                >
                  {t('contact.message') || 'Message'}
                </label>
                {isFormEnabled && (
                  <span className="text-xs font-mono text-slate-600 tabular-nums">
                    {t('contact.messageCharCount', {
                      count: formData.message.length,
                      defaultValue: `${formData.message.length} / ${CONTACT_FORM_LIMITS.messageMax} characters`,
                    })}
                  </span>
                )}
              </div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={!isFormEnabled}
                rows={6}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                className={`${baseInputClass} resize-none`}
                placeholder={t('contact.messagePlaceholder') || 'Enter your message'}
              />
              {fieldErrors.message && (
                <p id="contact-message-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                  {fieldErrors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!isFormEnabled || submitting}
                className={
                  isFormEnabled
                    ? 'w-full bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:bg-teal-700/60 text-white font-semibold py-3 px-6 rounded-lg text-sm sm:text-base shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed'
                    : 'w-full bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg cursor-not-allowed opacity-75 text-sm sm:text-base shadow-sm'
                }
              >
                {!isFormEnabled
                  ? t('contact.submitDisabled') || 'Submission Currently Unavailable'
                  : submitting
                  ? t('contact.sending') || 'Sending...'
                  : t('contact.sendMessage') || 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        {/* Helpful Existing Site Resources */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            {t('contact.resourcesTitle') || 'Helpful Resources While Support Is Offline'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {t('contact.resourcesDesc') ||
              'Find answers about calculation formulas, metrics, and platform policies on these pages:'}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {resourceLinks.map((item) => (
              <LocaleLink
                key={item.to}
                to={item.to}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <span>{item.label}</span>
                <span aria-hidden="true" className="text-teal-700">
                  &rarr;
                </span>
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
