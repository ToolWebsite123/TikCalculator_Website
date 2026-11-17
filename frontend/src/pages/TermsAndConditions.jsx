import React from 'react';
import LocaleLink from '../components/LocaleLink';
import useSEO from '../utils/useSEO';

const TermsAndConditions = () => {
  useSEO({
    title: 'Terms and Conditions | KalkulatorTik',
    description:
      'Read the official KalkulatorTik Terms and Conditions. Understand informational calculation terms, estimate disclaimers, and platform independence.',
    canonicalPath: '/terms',
  });

  return (
    <div className="min-h-screen bg-slate-50 transition-colors">
      <div className="container mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 md:p-10 lg:p-12 shadow-sm">
          {/* Header Metadata */}
          <header className="border-b border-slate-100 pb-6 mb-8 sm:pb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 mb-3">
              Legal Agreement &amp; User Terms
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
              Terms and Conditions
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
                <strong>Language Notice:</strong> To ensure unambiguous legal clarity, contract consistency, and universal enforceability, KalkulatorTik publishes and maintains its formal Terms and Conditions exclusively in English.
              </p>
            </aside>
          </header>

          {/* Table of Contents */}
          <nav aria-label="Table of Contents" className="mb-10 rounded-xl border border-slate-200/80 bg-slate-50/80 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
              Table of Contents
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <li><a href="#acceptance" className="text-teal-700 hover:text-teal-900 hover:underline">1. Acceptance &amp; Eligibility</a></li>
              <li><a href="#service-description" className="text-teal-700 hover:text-teal-900 hover:underline">2. Description of Services</a></li>
              <li><a href="#permitted-use" className="text-teal-700 hover:text-teal-900 hover:underline">3. Permitted &amp; Prohibited Use</a></li>
              <li><a href="#disclaimer" className="text-teal-700 hover:text-teal-900 hover:underline font-semibold">4. Comprehensive Disclaimer &amp; Accuracy</a></li>
              <li><a href="#platform-independence" className="text-teal-700 hover:text-teal-900 hover:underline">5. Platform Independence</a></li>
              <li><a href="#intellectual-property" className="text-teal-700 hover:text-teal-900 hover:underline">6. Intellectual Property</a></li>
              <li><a href="#dmca-copyright" className="text-teal-700 hover:text-teal-900 hover:underline">7. Copyright &amp; DMCA Takedown</a></li>
              <li><a href="#affiliate-disclosure" className="text-teal-700 hover:text-teal-900 hover:underline">8. Affiliate &amp; Commercial Disclosure</a></li>
              <li><a href="#third-party-links" className="text-teal-700 hover:text-teal-900 hover:underline">9. Third-Party Websites &amp; Links</a></li>
              <li><a href="#warranty-disclaimer" className="text-teal-700 hover:text-teal-900 hover:underline">10. Disclaimer of Warranties</a></li>
              <li><a href="#limitation-liability" className="text-teal-700 hover:text-teal-900 hover:underline">11. Limitation of Liability</a></li>
              <li><a href="#indemnification" className="text-teal-700 hover:text-teal-900 hover:underline">12. Indemnification</a></li>
              <li><a href="#modifications" className="text-teal-700 hover:text-teal-900 hover:underline">13. Service Modifications &amp; Access</a></li>
              <li><a href="#governing-disputes" className="text-teal-700 hover:text-teal-900 hover:underline">14. Dispute Resolution</a></li>
              <li><a href="#changes-terms" className="text-teal-700 hover:text-teal-900 hover:underline">15. Changes to Terms</a></li>
              <li><a href="#contact" className="text-teal-700 hover:text-teal-900 hover:underline">16. Contact Information</a></li>
            </ol>
          </nav>

          {/* Section 1 */}
          <section id="acceptance" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              1. Acceptance of Terms &amp; Eligibility
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and <strong>KalkulatorTik</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), regarding your access to and use of{' '}
                <a href="https://www.kalkulatortik.com" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                  https://www.kalkulatortik.com
                </a>{' '}
                and all associated features, tools, and calculators.
              </p>
              <p>
                By accessing, browsing, or utilizing KalkulatorTik, you signify that you have read, understood, and agree to be bound by these Terms and our companion{' '}
                <LocaleLink to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                  Privacy Policy
                </LocaleLink>
                . If you do not agree with any part of these Terms, you must discontinue using our website immediately.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="service-description" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              2. Description of Services &amp; Free Service Model
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                KalkulatorTik provides free online metrics calculators and analytical tools created to help creators, advertisers, agencies, and social media analysts evaluate potential metrics:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li><strong>TikTok Money Calculator:</strong> Estimates potential brand sponsorship value per sponsored video based on publicly viewable profile metrics and industry CPM baselines.</li>
                <li><strong>TikTok CPM Calculator:</strong> A 3-way media planning workbench calculating Cost Per Mille, advertising budgets, or required impressions across multiple currencies.</li>
                <li><strong>TikTok Engagement Rate Calculator:</strong> Calculates follower-based engagement percentages using video counts, follower totals, and aggregate like counts.</li>
              </ul>
              <p>
                <strong>Free Utility Model:</strong> KalkulatorTik is operated as a free public resource. We do not charge subscription fees, offer premium tiers, or require credit card information.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="permitted-use" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              3. Permitted &amp; Prohibited Use
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                You are granted a non-exclusive, non-transferable, revocable right to access and use KalkulatorTik strictly for personal, educational, research, and legitimate media-planning purposes.
              </p>
              <p>When using KalkulatorTik, you agree that you will <strong>NOT</strong>:</p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li>Deploy automated bots, spiders, or scrapers to extract bulk data or overload our backend servers.</li>
                <li>Attempt to bypass, defeat, or circumvent rate-limiting barriers or security defenses.</li>
                <li>Conduct denial-of-service (DoS/DDoS) attacks or deliberately disrupt server infrastructure.</li>
                <li>Reverse-engineer, decompile, or disassemble proprietary frontend calculation logic or API wrappers.</li>
                <li>Use outputs generated by our calculators to commit commercial fraud, deceive business partners, or present estimates as certified financial audits.</li>
                <li>Use the service for any purpose that violates applicable municipal, national, or international laws.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 — Comprehensive Disclaimer */}
          <section id="disclaimer" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              4. Comprehensive Disclaimer of Estimates &amp; Accuracy
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs font-semibold text-amber-950 sm:text-sm">
                IMPORTANT DISCLAIMER: PLEASE READ CAREFULLY BEFORE RELYING ON ANY CALCULATOR OUTPUT.
              </div>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                A. Informational &amp; Educational Purposes Only
              </h3>
              <p>
                All calculations, projections, sponsorship ranges, CPM figures, and engagement rates provided by KalkulatorTik are strictly <strong>estimates for informational and educational purposes only</strong>. They do not constitute financial audits, verified income statements, legal representations, or commercial commitments.
              </p>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                B. No Guarantee of Earnings, Reach, or Performance
              </h3>
              <p>
                KalkulatorTik makes <strong>no guarantee, warranty, or representation</strong> that any creator, influencer, brand, or advertiser will achieve the figures estimated by our tools. We do not guarantee:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li>That any creator will earn the calculated sponsorship amounts from brands.</li>
                <li>That any brand or agency will offer contracts matching our estimated rates.</li>
                <li>That paid TikTok ad campaigns will achieve projected CPMs, clicks, or impression volumes.</li>
                <li>That past engagement rates or view counts will continue into future posts.</li>
              </ul>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                C. Not Financial, Legal, or Investment Advice
              </h3>
              <p>
                Nothing on this website constitutes professional financial, accounting, investment, tax, or legal advice. Commercial influencer marketing contracts, ad budgets, and sponsorship deals must be independently evaluated and negotiated by the respective parties with qualified legal and accounting counsel.
              </p>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                D. Platform &amp; Market Volatility
              </h3>
              <p>
                Social media advertising and influencer pricing are influenced by volatile external factors, including changing TikTok platform recommendation algorithms, ad auction bidding density, seasonality (such as Q4 holiday budget surges), audience geography, content vertical, and creator negotiation skill. Actual market results will vary.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="platform-independence" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              5. Platform Independence &amp; Trademark Notice
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                <strong>Independent Operation:</strong> KalkulatorTik is an independent website and estimation tool. We are <strong>not affiliated with, associated with, sponsored by, authorized by, endorsed by, or in any way officially connected with TikTok, ByteDance Ltd., or any of their subsidiaries or affiliates.</strong>
              </p>
              <p>
                <strong>Trademarks:</strong> The name &quot;TikTok&quot; and related marks, logos, and emblems are registered trademarks of ByteDance Ltd. Any reference to &quot;TikTok&quot; on this website is made strictly for descriptive, nominative identification of the third-party platform under the doctrine of nominative fair use. KalkulatorTik claims no proprietary rights over third-party trademarks.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="intellectual-property" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              6. Intellectual Property &amp; Permitted Attribution
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                All proprietary content on KalkulatorTik—including website layout, user interface designs, mathematical algorithm code, text copy, graphic elements, and database structures—is the intellectual property of KalkulatorTik and is protected by applicable international copyright and intellectual property laws.
              </p>
              <p>
                <strong>Permitted Attribution:</strong> Journalists, bloggers, educators, and industry researchers are welcome to reference, quote, or cite calculator estimates provided that appropriate attribution with a direct hyperlink to <code>https://www.kalkulatortik.com</code> is clearly maintained.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="dmca-copyright" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              7. Copyright &amp; DMCA Takedown Policy
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                KalkulatorTik respects the intellectual property rights of content creators and copyright owners. Public TikTok avatars, usernames, and metrics queried through our lookup tool originate from publicly accessible web endpoints and remain the exclusive property of their respective creators and the hosting platform.
              </p>
              <p>
                If you are a copyright owner or authorized representative and believe that content appearing on KalkulatorTik infringes upon your copyright, you may submit a formal takedown notice through our{' '}
                <LocaleLink to="/contact" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                  Contact Page
                </LocaleLink>{' '}
                containing:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>The specific URL or profile identifier on our site that you seek removed.</li>
                <li>Your direct contact information (name, address, telephone number, and email).</li>
                <li>A statement of good-faith belief that the disputed use is unauthorized.</li>
                <li>A statement under penalty of perjury that the notification is accurate and that you are authorized to act.</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section id="affiliate-disclosure" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              8. Affiliate &amp; Commercial Disclosure
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                In compliance with Federal Trade Commission (FTC) guidelines and global fair trade standards:
              </p>
              <p>
                KalkulatorTik operates as a free tool. We do not accept payment to artificially manipulate creator earnings rankings, inflate engagement calculations, or fabricate ad benchmarks. If commercial partnerships, sponsored tools, or affiliate links are featured on this website, they will be clearly and conspicuously labeled as such.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="third-party-links" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              9. Third-Party Websites &amp; Links
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                Our website may contain hyperlinks to external third-party websites or services that are not owned or controlled by KalkulatorTik. We have no control over, and assume no responsibility for, the content, privacy policies, practices, or availability of any third-party websites. You access external sites entirely at your own risk.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="warranty-disclaimer" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              10. Disclaimer of Warranties (&quot;As Is&quot; &amp; &quot;As Available&quot;)
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, KALKULATORTIK AND ITS CALCULATORS ARE PROVIDED STRICTLY ON AN <strong>&quot;AS IS&quot;</strong> AND <strong>&quot;AS AVAILABLE&quot;</strong> BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
              </p>
              <p>
                WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE WEBSITE WILL BE UNINTERRUPTED, TIMELY, ERROR-FREE, SECURE, OR FREE FROM VIRUSES OR DEFECTS.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="limitation-liability" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              11. Limitation of Liability
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                UNDER NO CIRCUMSTANCES SHALL KALKULATORTIK, ITS DEVELOPERS, CONTRIBUTORS, OR AFFILIATES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES WHATSOEVER (INCLUDING LOSS OF PROFITS, REVENUE, DATA, GOODWILL, BUSINESS OPPORTUNITIES, OR ADVERTISING EXPENDITURES) ARISING OUT OF OR IN CONNECTION WITH:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                <li>YOUR ACCESS TO, USE OF, OR INABILITY TO ACCESS OR USE KALKULATORTIK.</li>
                <li>ANY DECISIONS, COMMERCIAL CONTRACTS, SPONSORSHIPS, OR EXPENDITURES UNDERTAKEN IN RELIANCE ON ESTIMATES GENERATED BY OUR TOOLS.</li>
                <li>ANY INACCURACIES, OMISSIONS, OR TECHNICAL ERRORS IN CALCULATOR CALCULATIONS.</li>
                <li>ANY DOWNTIME, THIRD-PARTY INTERRUPTIONS, OR SYSTEM OUTAGES.</li>
              </ul>
              <p>
                BECAUSE SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, OUR LIABILITY IN SUCH JURISDICTIONS SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="indemnification" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              12. Indemnification
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                You agree to defend, indemnify, and hold harmless KalkulatorTik and its developers from and against any claims, damages, obligations, losses, liabilities, costs, or expenses (including reasonable legal fees) resulting from your violation of these Terms, your misuse of our calculators, or your infringement of any rights of another party.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="modifications" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              13. Service Modifications &amp; Access Termination
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                We reserve the right at our sole discretion to modify, update, enhance, suspend, or discontinue any feature, calculator, or tool on KalkulatorTik at any time without prior notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the service.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="governing-disputes" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              14. Dispute Resolution &amp; Good-Faith Communication
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                In the event of any inquiry, dispute, controversy, or claim arising out of or relating to these Terms or your use of KalkulatorTik, you agree to first attempt informal resolution by contacting us through our verified{' '}
                <LocaleLink to="/contact" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
                  Contact Page
                </LocaleLink>
                . Both parties agree to engage in good-faith communication to resolve any concerns amicably before resorting to formal legal mechanisms.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="changes-terms" className="mb-8 sm:mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              15. Changes to These Terms
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                We reserve the right to revise these Terms at any time. When changes occur, the &quot;Last Updated&quot; date at the top of this document will be updated accordingly. Your continued use of KalkulatorTik following any posted changes constitutes your binding acceptance of the revised Terms.
              </p>
            </div>
          </section>

          {/* Section 16 */}
          <section id="contact">
            <h2 className="text-xl font-bold text-slate-900 mb-3 sm:text-2xl sm:mb-4 border-b border-slate-100 pb-2">
              16. Contact Information &amp; Inquiries
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm text-slate-700 leading-relaxed sm:text-base">
              <p>
                For questions, clarifications, legal inquiries, or notices regarding these Terms and Conditions, please submit your message through our verified communication portal:
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">KalkulatorTik Administration</p>
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
                  We review incoming messages and endeavor to respond to verified inquiries within a standard business timeframe.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default TermsAndConditions;
