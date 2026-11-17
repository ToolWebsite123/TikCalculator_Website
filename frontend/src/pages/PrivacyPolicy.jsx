import React from 'react';
import LocaleLink from '../components/LocaleLink';
import useSEO from '../utils/useSEO';

const PrivacyPolicy = () => {
  useSEO({
    title: 'Privacy Policy | KalkulatorTik',
    description:
      'Read the KalkulatorTik Privacy Policy. Learn how our free TikTok calculators handle public data, cookies, local storage, and user privacy transparently.',
    canonicalPath: '/privacy',
  });

  return (
    <div className="min-h-screen bg-slate-50 transition-colors">
      <div className="container mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 md:p-10 lg:p-12 shadow-sm">
          {/* Header Metadata */}
          <header className="border-b border-slate-100 pb-6 mb-8 sm:pb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 mb-3">
              Compliance &amp; Data Transparency
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 sm:text-sm">
              <span><strong>Effective Date:</strong> November 17, 2026</span>
              <span className="hidden sm:inline">&bull;</span>
              <span><strong>Last Updated:</strong> November 17, 2026</span>
              <span className="hidden sm:inline">&bull;</span>
              <span><strong>Website:</strong> kalkulatortik.com</span>
            </div>

            {/* Language Notice Banner */}
            <aside
              aria-label="Language notice"
              className="mt-5 rounded-xl border border-teal-200/80 bg-teal-50/60 p-4 text-xs leading-relaxed text-teal-900 sm:text-sm"
            >
              <p>
                <strong>Language Notice:</strong> To ensure unambiguous legal clarity, regulatory compliance, and universal precision across all international jurisdictions, KalkulatorTik publishes and maintains its formal Privacy Policy and terms exclusively in English.
              </p>
            </aside>
          </header>

          {/* Quick Navigation / Table of Contents */}
          <nav aria-label="Table of Contents" className="mb-10 rounded-xl border border-slate-200/80 bg-slate-50/80 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
              Table of Contents
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <li><a href="#overview" className="text-teal-700 hover:text-teal-900 hover:underline">1. Overview &amp; Scope</a></li>
              <li><a href="#info-not-collected" className="text-teal-700 hover:text-teal-900 hover:underline">2. Information We Do Not Collect</a></li>
              <li><a href="#info-collected" className="text-teal-700 hover:text-teal-900 hover:underline">3. Information We Collect or Process</a></li>
              <li><a href="#technical-data" className="text-teal-700 hover:text-teal-900 hover:underline">4. Technical &amp; Device Information</a></li>
              <li><a href="#cookies-storage" className="text-teal-700 hover:text-teal-900 hover:underline">5. Cookies &amp; Local Storage</a></li>
              <li><a href="#analytics-third-party" className="text-teal-700 hover:text-teal-900 hover:underline">6. Analytics &amp; Third-Party Services</a></li>
              <li><a href="#how-we-use-info" className="text-teal-700 hover:text-teal-900 hover:underline">7. How We Use Information</a></li>
              <li><a href="#data-storage" className="text-teal-700 hover:text-teal-900 hover:underline">8. Data Storage &amp; Retention</a></li>
              <li><a href="#data-security" className="text-teal-700 hover:text-teal-900 hover:underline">9. Data Security Measures</a></li>
              <li><a href="#privacy-rights" className="text-teal-700 hover:text-teal-900 hover:underline">10. User Privacy Rights (GDPR &amp; CCPA)</a></li>
              <li><a href="#children-privacy" className="text-teal-700 hover:text-teal-900 hover:underline">11. Children&apos;s Privacy (COPPA)</a></li>
              <li><a href="#international-users" className="text-teal-700 hover:text-teal-900 hover:underline">12. International Users</a></li>
              <li><a href="#policy-updates" className="text-teal-700 hover:text-teal-900 hover:underline">13. Policy Updates</a></li>
              <li><a href="#contact-us" className="text-teal-700 hover:text-teal-900 hover:underline">14. Contact Information</a></li>
            </ol>
          </nav>

          {/* Section 1 */}
          <section id="overview" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              1. Overview &amp; Scope
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                Welcome to <strong>KalkulatorTik</strong> (accessible at{' '}
                <a href="https://www.kalkulatortik.com" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                  https://www.kalkulatortik.com
                </a>
                ). This Privacy Policy explains our practices regarding the collection, use, processing, and protection of information when you access or interact with our free web-based suite of TikTok calculator and analysis tools.
              </p>
              <p>
                Our tools include the <strong>TikTok Money Calculator</strong>, the <strong>TikTok CPM Calculator</strong>, and the <strong>TikTok Engagement Rate Calculator</strong>. By visiting or utilizing KalkulatorTik, you acknowledge the terms described in this Privacy Policy.
              </p>
              <p>
                <strong>Independent Operation:</strong> KalkulatorTik is an independent website and utility. We are not affiliated with, sponsored by, authorized by, or in any way officially associated with TikTok, ByteDance Ltd., or any of their corporate affiliates.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="info-not-collected" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              2. Information We Do Not Collect
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                To provide a safe and private user experience, KalkulatorTik is built on a privacy-by-design architecture:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>
                  <strong>No Account Credentials:</strong> We do not require user accounts, user logins, or account passwords. You can use our calculators freely without registering.
                </li>
                <li>
                  <strong>No Financial or Payment Data:</strong> All calculators and tools on KalkulatorTik are 100% free of charge. We do not collect credit card numbers, banking credentials, PayPal accounts, or billing addresses.
                </li>
                <li>
                  <strong>No Private Social Media Passwords:</strong> We never request, collect, access, or store your private TikTok account passwords, authentication tokens, private direct messages, or non-public profile settings.
                </li>
                <li>
                  <strong>No Intrusive Device Tracking:</strong> We do not deploy keystroke loggers, GPS location trackers, or invasive device fingerprinting scripts.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="info-collected" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              3. Information We Collect or Process
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                Depending on how you interact with our website, we process the following categories of information:
              </p>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                A. Public TikTok Usernames for Estimation Lookups
              </h3>
              <p>
                When you use the TikTok Money Calculator, you enter a public TikTok username (e.g., <code>@username</code>). Our server queries publicly available metrics associated with that public profile—such as public follower totals, public video like counts, and public video counts—solely to calculate estimated sponsorship ranges. We do not associate this public profile data with your personal identity, physical address, or browsing history.
              </p>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                B. Client-Side Numerical Calculator Parameters
              </h3>
              <p>
                When using the <strong>TikTok CPM Calculator</strong> or <strong>TikTok Engagement Rate Calculator</strong>, you enter numerical campaign values (such as advertising budget, impression targets, total likes, video counts, or target CPMs). These calculations execute entirely client-side within your browser using JavaScript. These inputs are not transmitted to or stored on our servers.
              </p>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                C. Voluntarily Submitted Contact Form Information
              </h3>
              <p>
                If you choose to communicate with us through our{' '}
                <LocaleLink to="/contact" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                  Contact Page
                </LocaleLink>
                , we collect only the information you voluntarily provide in the message form: your name, email address, optional subject line, and message content. This information is used strictly to read, review, and reply to your inquiry.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="technical-data" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              4. Technical &amp; Device Information (Server Logs)
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                When your browser connects to KalkulatorTik, standard web servers automatically record routine HTTP connection log data. This technical information may include:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li>Internet Protocol (IP) address.</li>
                <li>Browser software type, version, and language settings.</li>
                <li>Operating system and device platform category.</li>
                <li>Referring web URL and requested page paths.</li>
                <li>Date and time stamp of each request and HTTP status codes.</li>
              </ul>
              <p>
                <strong>Purpose of Server Logs:</strong> Technical log data is used exclusively to maintain web server availability, identify performance bottlenecks, diagnose operational server errors, protect against denial-of-service (DDoS) attacks, and enforce automatic rate limiting to prevent automated scraping abuse.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="cookies-storage" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              5. Cookies &amp; Local Browser Storage
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                KalkulatorTik adheres to minimal, strictly functional storage practices:
              </p>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                Functional Local Storage (localStorage)
              </h3>
              <p>
                We use browser <code>localStorage</code> solely to remember your voluntary user interface preferences between page visits:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li>
                  <code>theme</code>: Remembers your selected visual presentation mode (defaulting to light mode).
                </li>
                <li>
                  <code>i18nextLng</code>: Remembers your active language navigation choice across our 8 supported language routes.
                </li>
              </ul>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                Third-Party Advertising &amp; Tracking Cookies
              </h3>
              <p>
                KalkulatorTik does not currently deploy third-party advertising cookies, cross-site behavioral tracking scripts, or commercial retargeting beacons.
              </p>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                How to Control or Disable Local Storage &amp; Cookies
              </h3>
              <p>
                You can manage, clear, or completely block cookies and local storage items at any time through your web browser preferences (Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data). Please note that clearing local storage will simply reset your theme and language preferences to their default states.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="analytics-third-party" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              6. Analytics &amp; Third-Party Services
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                We maintain transparency regarding external services connected with website infrastructure:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>
                  <strong>Hosting &amp; Edge Infrastructure:</strong> The website is served via globally distributed Content Delivery Network (CDN) edge nodes to ensure fast page delivery and DDoS mitigation.
                </li>
                <li>
                  <strong>Public TikTok Web Lookups:</strong> When a username is searched in the Money Calculator, the backend queries publicly rendered TikTok web endpoints to retrieve public view and follower metrics. No private account tokens or personal profile authentications are involved.
                </li>
                <li>
                  <strong>Email Delivery:</strong> When contact messages are submitted, they are processed through an email transport API service (such as Resend) strictly to deliver your inquiry to our administration inbox.
                </li>
                <li>
                  <strong>External Links:</strong> Our website may contain links to third-party resources or official social platform terms. We do not control and are not responsible for the privacy practices, content, or policies of external sites.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="how-we-use-info" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              7. How We Use Information
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                We process information solely for the following legitimate business and technical purposes:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li>To generate dynamic mathematical calculations and estimation benchmarks requested by users.</li>
                <li>To maintain system uptime, monitor server response times, and prevent denial-of-service disruptions.</li>
                <li>To answer questions, technical inquiries, and feedback submitted through our contact form.</li>
                <li>To respect and persist the user&apos;s chosen interface language and theme preferences.</li>
              </ul>
              <div className="rounded-xl border border-teal-200/80 bg-teal-50/50 p-4 text-xs font-medium text-teal-950 sm:text-sm">
                <strong>Our Commitment:</strong> We do not sell, rent, lease, or monetize user data. We do not provide your personal information to third-party data brokers or marketing aggregators under any circumstances.
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="data-storage" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              8. Data Storage &amp; Retention
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                We adhere to strict data minimization and limited retention principles:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>
                  <strong>Temporary Metric Caching:</strong> Public profile data fetched during username lookups is temporarily cached in server memory solely to prevent rate-limit exhaustion against public endpoints. Cached records automatically expire.
                </li>
                <li>
                  <strong>Contact Communications:</strong> Inquiries submitted via our contact form are retained only for the duration necessary to resolve your request and provide technical assistance, after which correspondence is archived or securely deleted.
                </li>
                <li>
                  <strong>Server Access Logs:</strong> Ephemeral server connection logs are rotated and deleted on a routine schedule in accordance with standard infrastructure security maintenance.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section id="data-security" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              9. Data Security Measures
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                We implement industry-standard administrative, physical, and technical safeguards to protect information against unauthorized access, loss, alteration, or misuse:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li><strong>HTTPS / TLS Encryption:</strong> All data transmitted between your browser and KalkulatorTik is encrypted using modern Transport Layer Security (TLS/SSL).</li>
                <li><strong>HTTP Security Headers:</strong> Our web servers employ hardened HTTP headers (Content Security Policy, X-Content-Type-Options, HSTS, and frame protection via Helmet) to defend against cross-site scripting (XSS) and clickjacking.</li>
                <li><strong>Strict Origin Isolation:</strong> Cross-Origin Resource Sharing (CORS) policies restrict API access strictly to authorized domain origins.</li>
                <li><strong>Rate Limiting:</strong> Automated rate-limiting algorithms protect against brute-force abuse and server exhaustion.</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section id="privacy-rights" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              10. User Privacy Rights (GDPR, CCPA/CPRA &amp; Global Rights)
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                Depending on your geographic location and residency (such as the European Economic Area, United Kingdom, California, or Brazil), you may have statutory privacy rights regarding your personal information under regulations including the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA/CPRA):
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li><strong>Right of Access &amp; Portability:</strong> The right to request confirmation of whether we process personal data relating to you and obtain a copy.</li>
                <li><strong>Right to Rectification:</strong> The right to request correction of inaccurate personal information.</li>
                <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> The right to request deletion of personal information you provided (e.g., contact form messages).</li>
                <li><strong>Right to Restriction &amp; Objection:</strong> The right to object to or restrict processing of your information under certain circumstances.</li>
                <li><strong>Non-Discrimination:</strong> We do not discriminate against any user for exercising their statutory privacy rights.</li>
              </ul>
              <p>
                Because KalkulatorTik does not require user accounts or maintain profiles on individual visitors, we hold minimal to no personal data. If you have submitted an inquiry and wish to exercise your rights, please contact us via our{' '}
                <LocaleLink to="/contact" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                  Contact Page
                </LocaleLink>
                .
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="children-privacy" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              11. Children&apos;s Privacy (COPPA)
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                Protecting children&apos;s privacy is of paramount importance. KalkulatorTik is designed for general audiences interested in social media metrics and is not directed at children under the age of 13 (or under 16 in applicable European jurisdictions). We do not knowingly collect personal identifiable information from children.
              </p>
              <p>
                If a parent or guardian discovers that their child has submitted personal details through our contact form, please notify us immediately via our{' '}
                <LocaleLink to="/contact" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                  Contact Page
                </LocaleLink>{' '}
                and we will promptly delete the communication.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="international-users" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              12. International Users &amp; Cross-Border Transfers
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                KalkulatorTik operates globally and is accessible across multiple language routes. If you access our website from outside the hosting region, please be aware that information may be processed in server environments located in the United States and global edge networks where data protection standards may differ from those in your jurisdiction. By using our website, you acknowledge this technical processing.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="policy-updates" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              13. Policy Updates &amp; Modifications
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                We may periodically update this Privacy Policy to reflect enhancements to our calculators, changes in technical architecture, or evolving legal standards. Any revisions will be published directly on this page with an updated &quot;Last Updated&quot; date at the top of the policy. We encourage visitors to review this document periodically.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="contact-us">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              14. Contact Information
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                If you have questions, privacy requests, or feedback regarding this Privacy Policy or our data handling practices, please submit your inquiry through our verified communication portal:
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">KalkulatorTik Administration &amp; Support</p>
                <p className="mt-1 text-slate-600 text-sm">
                  Official Communication Portal:{' '}
                  <LocaleLink
                    to="/contact"
                    className="font-bold text-teal-700 underline underline-offset-2 hover:text-teal-800"
                  >
                    https://www.kalkulatortik.com/contact
                  </LocaleLink>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  We review incoming communications and aim to respond to verified inquiries within a reasonable business timeframe.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
