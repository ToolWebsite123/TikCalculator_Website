import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Privacy Policy for TikCalculator
        </h1>

        {/* Introduction */}
        <div className="mb-10">
          <p className="text-base text-gray-700 leading-relaxed">
            At TikCalculator, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, and protect your data when you use our TikTok earning estimated calculator. 
            By using our service, you agree to the terms outlined in this policy.
          </p>
        </div>

        {/* Information We Collect */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Information We Collect
          </h2>
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              When you use our TikTok earning estimated calculator, we do not collect any personal information such as your name, 
              email address, or contact details. The calculator operates without requiring you to create an account or provide 
              any personal information.
            </p>
          </div>
        </section>

        {/* Information Automatically Collected */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Information Automatically Collected
          </h2>
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              When you visit our website, certain technical information may be automatically collected, including your IP address, 
              browser type, operating system, and pages visited. This information is collected for analytical and statistical 
              purposes to help us improve our service and understand how users interact with our website.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              This automatically collected information is aggregated and anonymized, meaning it does not personally identify you. 
              We use this data to analyze trends, administer the site, track user movements, and gather demographic information.
            </p>
          </div>
        </section>

        {/* Use of Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Use of Cookies
          </h2>
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              We may use cookies or similar technologies to enhance your experience and improve our service. Cookies are small text 
              files that are stored on your device when you visit a website. They help us remember your preferences and provide a 
              better user experience.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              You can manage your cookie preferences through your browser settings. However, please note that disabling cookies may 
              affect the functionality of our website and limit your ability to use certain features.
            </p>
          </div>
        </section>

        {/* Third-Party Links */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Third-Party Links
          </h2>
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              Our calculator may contain links to third-party websites or services that are not owned or controlled by TikCalculator. 
              We are not responsible for the privacy practices or content of these external sites. We encourage you to review the 
              privacy policies of any third-party websites you visit.
            </p>
          </div>
        </section>

        {/* Security Measures */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Security Measures
          </h2>
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or 
              destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% 
              secure, and we cannot guarantee absolute security.
            </p>
          </div>
        </section>

        {/* Changes to the Privacy Policy */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Changes to the Privacy Policy
          </h2>
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              We reserve the right to update or modify this Privacy Policy at any time. Any changes will be effective immediately 
              upon posting on this page. We encourage you to review this Privacy Policy periodically to stay informed about how we 
              are protecting your information.
            </p>
          </div>
        </section>

        {/* Contact Us */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our service, please contact us using 
              the information provided on our website. We are committed to addressing any privacy-related inquiries promptly and 
              transparently.
            </p>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-10">
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              Thank you for taking the time to review our Privacy Policy. We are dedicated to maintaining your privacy and ensuring 
              a secure experience when using TikCalculator. If you have any questions or concerns, please do not hesitate to contact us.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

