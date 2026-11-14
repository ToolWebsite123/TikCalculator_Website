import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSEO from '../utils/useSEO';

const Contact = () => {
  const { t } = useTranslation();

  useSEO({
    title: 'Contact TikCalculator – Get Support for Your TikTok Money Calculator',
    description: 'Have questions or feedback? Contact TikCalculator to get quick support, share ideas, or learn more about our TikTok Money Calculator and analytics tools for creators and brands.',
    canonicalPath: '/contact',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset status message after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Main Contact Section */}
      <section className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:py-20">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:text-4xl sm:mb-4 md:text-5xl">
            {t('contact.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg">
            {t('contact.subtitle') || 'Get in touch with us. We\'d love to hear from you!'}
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('contact.name') || 'Name'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors text-sm sm:text-base"
                placeholder={t('contact.namePlaceholder') || 'Enter your name'}
              />
            </div>

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('contact.emailLabel') || 'Email'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors text-sm sm:text-base"
                placeholder={t('contact.emailPlaceholder') || 'Enter your email'}
              />
            </div>

            {/* Message Field */}
            <div>
              <label 
                htmlFor="message" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('contact.message') || 'Message'}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none text-sm sm:text-base"
                placeholder={t('contact.messagePlaceholder') || 'Enter your message'}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting 
                  ? (t('contact.sending') || 'Sending...') 
                  : (t('contact.sendMessage') || 'Send Message')
                }
              </button>
            </div>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg text-sm sm:text-base">
                {t('contact.successMessage') || 'Thank you! Your message has been sent successfully.'}
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
