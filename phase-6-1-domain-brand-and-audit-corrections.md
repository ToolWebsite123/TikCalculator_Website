# PHASE 6.1 — DOMAIN, BRAND IDENTITY & AUDIT ACCURACY CORRECTION

**Project:** KalkulatorTik  
**Production Domain:** [www.kalkulatortik.com](https://www.kalkulatortik.com/)  
**Preferred Production URL:** [https://www.kalkulatortik.com/](https://www.kalkulatortik.com/)  
**Audit Date:** November 14, 2026  
**Mode:** STRICT READ-ONLY AUDIT & FACT-CHECKING — NO IMPLEMENTATION  

---

## 1. OFFICIAL BRAND AND DOMAIN IDENTITY AUDIT

### 1.1. Core Identity Definitions & Context
The domain **`www.kalkulatortik.com`** is officially purchased and active as the production domain for this website. It is **not** an unpurchased or hypothetical domain.

A strict distinction is maintained between the brand identity and the technical infrastructure:
- **Official Brand Name:** `KalkulatorTik`
- **Production Domain:** `www.kalkulatortik.com` (with root fallback `kalkulatortik.com`)
- **Preferred Canonical Production URL:** `https://www.kalkulatortik.com/`

### 1.2. Exhaustive Codebase Identity Audit
A comprehensive automated and manual scan across all 84 repository files (excluding `node_modules`, `.git`, `dist`, and temporary artifacts) yielded the following verified distribution:

| Metric / Term | Total Occurrences | Distribution Breakdown | Status / Evaluation |
|---|---|---|---|
| **`TikCalculator`** (Competitor Brand Name) | **226** | • `frontend/src/locales/*/translation.json`: 208 (26 in each of the 8 locales)<br>• `frontend/src/pages/About.jsx`: 2<br>• `frontend/src/pages/Contact.jsx`: 2<br>• `frontend/src/pages/PrivacyPolicy.jsx`: 2<br>• `frontend/src/pages/TermsAndConditions.jsx`: 2<br>• `frontend/src/pages/TikTokEngagementCalculator.jsx`: 1<br>• `frontend/public/manifest.json`: 1<br>• `backend/src/routes/tiktokRoutes.js`: 1<br>• `backend/src/utils/calcEarnings.js`: 4<br>• `frontend/src/utils/api.js`: 1<br>• `frontend/src/utils/earningsMapper.js`: 2 | **CRITICAL DEFECT**: The competitor's brand name is deeply embedded in user-facing content, legal agreements, metadata, and comments. |
| **`KalkulatorTik`** (Official Brand Name) | **0** | **0 occurrences** across all user-facing UI text, component headings, meta titles, and legal policies. (Only exists in backend admin seed default string: `admin@kalkulatortik.com`). | **CRITICAL DEFECT**: The official brand name has never been introduced into the public interface or copy. |
| **`kalkulatortik.com`** (Production Domain) | **48** | • `frontend/index.html`: 10 (Canonical script, meta tags, JSON-LD schema)<br>• `frontend/public/sitemap.xml`: 10 (Sitemap namespace & 9 route URLs)<br>• `frontend/public/robots.txt`: 1 (Sitemap reference)<br>• `frontend/src/utils/useSEO.js`: 4 (BASE_URL, DOMAIN, DEFAULT_IMAGE)<br>• `frontend/src/locales/*/translation.json`: 8 (1 in each locale under `footer.copyright`)<br>• `backend/.env.example` & `seed.js`: 2 | **CONFIGURED & VERIFIED**: Technical infrastructure correctly points to `www.kalkulatortik.com`. |
| **Contact Email Addresses** | **9** | • `frontend/src/locales/*/translation.json`: 8 (`tikcalculator@proton.me` in `contact.email` across all 8 locales)<br>• `backend/src/seed.js`: 1 (`admin@kalkulatortik.com` fallback) | **UNVERIFIED / DEFECT**: An external competitor protonmail is stored in translation dictionaries; no domain mailbox is verified. |
| **Copyright & Ownership Statements** | **12** | • `frontend/src/locales/*/translation.json` (`footer.copyright`): 8 (`"© 2026 www.kalkulatortik.com. All Rights Reserved."` across 8 locales)<br>• `frontend/src/locales/*/translation.json` (`terms.intellectualPropertyRights`): 2 (`en` & `it` explicitly claim content is the property of *"TikCalculator"*!)<br>• `frontend/src/components/Footer.jsx`: 2 (rendering logic) | **CRITICAL LEGAL CONFLICT**: The footer asserts copyright to `www.kalkulatortik.com`, but the Terms of Service explicitly assign all content, software, and IP to *"TikCalculator"*. |
| **Canonical URLs** | **21** | • `frontend/index.html`: 2<br>• `frontend/src/utils/useSEO.js`: 9 (enforces `https://www.kalkulatortik.com`)<br>• All 9 page components: 10 (`useSEO` hook calls) | **VERIFIED CORRECT**: All canonical URLs consistently format as `https://www.kalkulatortik.com/<path>`. |
| **Sitemap URLs** | **2** | • `frontend/public/robots.txt`: 1 (`https://www.kalkulatortik.com/sitemap.xml`)<br>• `frontend/public/sitemap.xml`: 1 file containing all 9 valid production URLs | **VERIFIED CORRECT**: Matches production domain structure. |
| **Open Graph & Twitter Meta** | **25** | • `frontend/index.html`: 12<br>• `frontend/src/utils/useSEO.js`: 13 | **VERIFIED CORRECT**: Technical tags reference `https://www.kalkulatortik.com` and `www.kalkulatortik.com`. |

### 1.3. Analysis: Brand vs Domain Confusion
The codebase currently exhibits a complete bifurcation:
1. **The Technical Infrastructure** (Sitemap, canonicals, robots.txt, Open Graph, host redirect scripts) accurately and consistently uses the production domain: **`www.kalkulatortik.com`**.
2. **The Content, Headings, Legal Terms, and UI Metadata** completely ignore the brand name **`KalkulatorTik`**, instead using either a generic descriptor (*"TikTok Money Calculator"*) or explicitly asserting the competitor's identity (*"TikCalculator"*).

This confirms that the website's brand identity was never properly populated when the project originated from its initial scaffold.

---

## 2. CONTACT EMAIL VERIFICATION & STATUS

A deep architectural inspection was conducted across the frontend and backend to ascertain whether a functioning, domain-based email service exists for `kalkulatortik.com`.

### 2.1. Verified Findings

1. **Currently Configured Address in Translation Dictionaries:**
   - In all 8 translation dictionaries (`frontend/src/locales/*/translation.json`) under the key `contact.email`, the configured address is:
     $$\text{`tikcalculator@proton.me`}$$
   - **Verification Status:** **UNVERIFIED & EXTERNAL**. This address belongs to a third-party ProtonMail account referencing the competitor brand.
2. **Visible UI Rendering in `Contact.jsx`:**
   - In `frontend/src/pages/Contact.jsx` (lines 1–152), the key `t('contact.email')` is **NOT** visibly rendered in the DOM.
   - The page renders only a visual contact form containing:
     - Name input (`id="name"`)
     - Email input (`id="email"`)
     - Message textarea (`id="message"`)
     - Submit button (`type="submit"`)
3. **Form Handling Implementation in `Contact.jsx`:**
   - In `frontend/src/pages/Contact.jsx` (lines 30–46), the submission handler is an entirely simulated frontend mock:
     ```javascript
     const handleSubmit = async (e) => {
       e.preventDefault();
       setIsSubmitting(true);
       setSubmitStatus(null);

       // Simulate form submission
       setTimeout(() => {
         setIsSubmitting(false);
         setSubmitStatus('success');
         setFormData({ name: '', email: '', message: '' });
         
         setTimeout(() => {
           setSubmitStatus(null);
         }, 3000);
       }, 1000);
     };
     ```
   - **Verification Status:** The form **does not send any network request**, does not invoke any backend API, and does not transmit the user's message anywhere.
4. **Backend Mail Infrastructure Inspection:**
   - Inspection of `backend/package.json` confirms that **no email transport libraries** (such as `nodemailer`, `@sendgrid/mail`, `resend`, or `aws-sdk`) are installed.
   - Inspection of `backend/src/routes/` and `backend/src/controllers/` confirms that **no contact form endpoint** (e.g., `POST /api/contact`) exists.
   - In `backend/.env.example` and `backend/src/seed.js`, `admin@kalkulatortik.com` is referenced solely as a fallback string for a local MongoDB admin login credential. There is no active mail server attached to it.
5. **Domain Mail Server / MX Record Status:**
   - There is no repository evidence of MX records, SPF, DKIM, or DMARC configurations configured for `kalkulatortik.com`.
   - Neither `admin@kalkulatortik.com` nor `support@kalkulatortik.com` has been provisioned as an active, receiving inbox.

### 2.2. Strict Operational Constraints & Directives
In accordance with user instructions:
- **Do NOT invent** `support@kalkulatortik.com`.
- **Do NOT publish** an email address merely because it uses the purchased domain.
- **Do NOT remove** the existing contact form without a verified replacement.

### 2.3. Corrected Remediation Strategy
1. **Immediate Step (Sanitization without invention):** Remove the competitor address `tikcalculator@proton.me` from the translation files (`contact.email`). Since it is not rendered in the UI, removing it prevents accidental exposure or confusion in JSON payloads.
2. **Form Preservation:** Retain the contact form UI in `Contact.jsx`.
3. **Infrastructure Prerequisite:** The domain owner must independently configure email routing or an inbox provider (e.g., Cloudflare Email Routing forwarding to a personal inbox, Google Workspace, or Zoho Mail) on `kalkulatortik.com`.
4. **Subsequent Integration:** Only after the domain owner confirms that an inbox is live and verified should a real address be published or wired to a backend service (e.g., Formspree, Resend, or SendGrid).

---

## 3. CORRECTION OF PHASE 6 AUDIT OVERSTATEMENTS

The Phase 6 content audit contained several analytical overstatements and unsupported assumptions. Below is the item-by-item technical correction:

### 3.1. Homepage (`/`) vs `/calculator` Intent Overlap
- **Phase 6 Overstatement:** Labeled the relationship between `/` and `/calculator` as *"Severe Intent & Keyword Cannibalization"* and *"Confirmed Google Cannibalization"*.
- **Corrected Fact:** In technical SEO, keyword cannibalization in Google search results **cannot be confirmed without Google Search Console (GSC) performance data** showing two URLs fluctuating, splitting impressions, or trading positions for identical search queries. In the absence of GSC data, this issue is accurately classified as **Structural and Semantic Keyword Overlap / High Cannibalization Risk**. Both pages feature similar metadata (*"TikTok Money Calculator"* vs *"TikTok Earnings Calculator"*), identical username input tools, and redundant internal navigation links, which risks diluting internal link equity.
- **Corrected Status:** Risk / Structural Redundancy (requires user decision: 301 consolidation vs functional specialization).

### 3.2. Client-Side Internationalization (i18n) Crawlability
- **Phase 6 Overstatement:** Claimed that *"100% of non-English localized content is completely invisible to search engine web crawlers"*.
- **Corrected Fact:** Modern search engine crawlers—most notably Googlebot's Web Rendering Service (WRS)—execute JavaScript and render client-side DOM. However, because KalkulatorTik stores language state in browser `localStorage` and does not provide language-prefixed URLs (e.g., `/es/`, `/de/`) or `<link rel="alternate" hreflang="..." />` tags, search bots always crawl the default English state. The alternate translations cannot be independently indexed, ranked in regional SERPs, or targeted to non-English search queries.
- **Corrected Status:** Architectural Defect: **Lack of Internationalized URL Routing and Hreflang Indexation**, not absolute crawler blindness.

### 3.3. Anonymous Websites and Search Engine Penalties
- **Phase 6 Overstatement:** Stated that *"Search quality raters penalize anonymous financial tools"* and implied an automatic Google penalty.
- **Corrected Fact:** Google does not issue automatic algorithmic "penalties" or manual actions simply because a utility website lacks author bylines. Google's Search Quality Rater Guidelines evaluate E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) as human evaluation guidelines to rate search result quality and calibrate algorithms. On a mathematical calculator tool, anonymity is an E-E-A-T trust weakness, but it does **not** trigger an automated search penalty.
- **Corrected Status:** Content Quality & Trust Deficiency (E-E-A-T), not an algorithmic penalty.

### 3.4. Word Count as a Google Ranking Factor
- **Phase 6 Overstatement:** Emphasized word count deficits (e.g., Contact: 37 words, FAQ: 89 words, About: 252 words) as "content thinness penalties".
- **Corrected Fact:** Google search advocates (including John Mueller) have repeatedly verified that **word count is not a ranking factor**. A page is not penalized for having 50 words, nor is it rewarded for having 1,500 words. The actual issue on these utility pages is **functional incompleteness, factual discrepancies, and missing trust context** (e.g., an FAQ that makes inaccurate calculation claims, or a contact page with a non-transmitting mock form).
- **Corrected Status:** Functional Incompleteness & Factual Quality Issue, not a word-count deficiency.

### 3.5. TikTok Monetization Metrics (RPM, CPM, Diamonds)
- **Phase 6 Overstatement:** Recommended specific numerical values ($0.10–$1.20 RPM, $0.005 per diamond) as authoritative calculations.
- **Corrected Fact:** TikTok does not publish real-time Creator Rewards payouts via any public API. Creator Rewards payouts depend on a proprietary algorithm factoring in qualified watch time, completion rate, geographic audience distribution, and advertiser demand. Furthermore, TikTok's Virtual Items Policy explicitly reserves the right to alter diamond cashout rates and coin purchase prices at its sole discretion. These metrics must be presented strictly as **Third-Party Industry Estimates and Historical Community Benchmarks**, accompanied by clear financial disclaimers.
- **Corrected Status:** Educational Benchmarks with Required Disclaimers, not verified platform payouts.

### 3.6. FAQ Schema Markup and Rich Results
- **Phase 6 Overstatement:** Recommended `FAQPage` JSON-LD schema as a guaranteed method to gain rich result visibility in SERPs.
- **Corrected Fact:** In August 2023, Google officially updated its search documentation to restrict FAQ rich snippets almost exclusively to well-known, authoritative government and healthcare organizations. Commercial websites, utility tools, and standard blogs rarely, if ever, receive FAQ accordion rich snippets in Google search results today. Structured data remains valuable for machine readability and knowledge graph understanding, but it **does not guarantee rich snippets or ranking boosts**.
- **Corrected Status:** Technical Best Practice for Entity Clarity, not a guaranteed rich-snippet driver.

---

## 4. CORRECTED MASTER ISSUE REGISTER

The table below provides the authoritative register of verified issues, separating **Confirmed Defects** (ready for safe implementation once approved) from **Strategic Decisions** (requiring owner direction) and **Research Opportunities**.

### 4.1. Confirmed Defects (Safe for Direct Implementation Once Approved)

| Issue ID | Exact File & Line Number | Exact Affected Page | Existing Behavior / Content | Verified Evidence | Corrected Recommendation | Priority | Dependencies | Safe to Implement? |
|---|---|---|---|---|---|---|---|---|
| **DEF-001** | `frontend/src/locales/en/translation.json`: 339–385<br>(`de`: 330–375, `es`: 330–375, `fr`: 330–375, `id`: 330–375, `it`: 330–375, `ms`: 330–375, `pt`: 330–375)<br>`frontend/src/pages/TermsAndConditions.jsx`: 9–10 | `https://www.kalkulatortik.com/terms` | Terms of Service title, intro, and IP section repeatedly name "TikCalculator" (7 times); Section 4 claims all IP is property of "TikCalculator". | `TermsAndConditions.jsx:9`: `title: "Terms & Conditions for TikCalculator..."`<br>`translation.json:361`: `"description1": "All content on TikCalculator... is property of TikCalculator"` | Replace all occurrences of "TikCalculator" with brand name "KalkulatorTik" and domain "www.kalkulatortik.com". Legally assert IP on behalf of KalkulatorTik. | **P0** | None | **YES** (Ready upon approval) |
| **DEF-002** | `frontend/src/locales/en/translation.json`: 296–335<br>(and all 8 locales)<br>`frontend/src/pages/PrivacyPolicy.jsx`: 9–10 | `https://www.kalkulatortik.com/privacy` | Privacy policy intro, cookie disclosure, and meta tags name "TikCalculator" (5 times). | `PrivacyPolicy.jsx:9`: `title: "Privacy Policy for TikCalculator..."`<br>`translation.json:296`: `"At TikCalculator, your privacy matters..."` | Replace all occurrences of "TikCalculator" with brand name "KalkulatorTik" and domain "www.kalkulatortik.com". | **P0** | None | **YES** (Ready upon approval) |
| **DEF-003** | `frontend/src/pages/About.jsx`: 9–10<br>`frontend/src/locales/en/translation.json`: 241, 243, 266 (and all 8 locales) | `https://www.kalkulatortik.com/about` | SEO title is `"About TikCalculator | Smart & Reliable..."`; body copy mentions generic "TikTok Money Calculator". | `About.jsx:9`: `title: 'About TikCalculator...'`<br>`translation.json:241`: `"title": "About Us – TikTok Money Calculator"` | Update SEO title to `"About Us – KalkulatorTik"`; update welcome and mission text to accurately name KalkulatorTik. | **P1** | None | **YES** (Ready upon approval) |
| **DEF-004** | `frontend/src/pages/Contact.jsx`: 9–10<br>`frontend/src/locales/en/translation.json`: 283 (and all 8 locales) | `https://www.kalkulatortik.com/contact` | SEO title is `"Contact TikCalculator – Get Support..."`; translation key `contact.email` contains `tikcalculator@proton.me`. | `Contact.jsx:9`: `title: 'Contact TikCalculator...'`<br>`translation.json:283`: `"email": "tikcalculator@proton.me"` | Update SEO metadata to reference "KalkulatorTik". Remove `tikcalculator@proton.me` from translation files. Do NOT invent a fake domain email. Keep existing form UI intact. | **P1** | Domain mailbox provisioning (for real email replacement) | **YES** (Metadata and unverified email removal can proceed safely) |
| **DEF-005** | `frontend/src/locales/en/translation.json`: 60–62 (and all 8 locales)<br>`frontend/src/pages/TikTokEngagementCalculator.jsx`: 255 | `https://www.kalkulatortik.com/tiktok-engagement-calculator` | Section heading renders `"Calculate TikTok Engagement Rate – TikCalculator"`; description states `"TikCalculator helps you..."`. | `translation.json:60`: `"title": "Calculate TikTok Engagement Rate – TikCalculator"`<br>`TikTokEngagementCalculator.jsx:255`: `{/* Calculate TikTok Engagement Rate – TikCalculator */}` | Update heading to `"Calculate TikTok Engagement Rate – KalkulatorTik"` and sanitize description across all 8 translation files. | **P1** | None | **YES** (Ready upon approval) |
| **DEF-006** | `frontend/src/locales/en/translation.json`: 115–134 (and all 8 locales) | `https://www.kalkulatortik.com/` | Homepage FAQ questions and answers explicitly name "TikCalculator" across FAQs 1, 2, 3, 4, and 10. | `translation.json:115`: `"How can I estimate my TikTok earnings with TikCalculator?"`<br>`translation.json:118`: `"No, TikCalculator is completely free..."` | Replace all occurrences of "TikCalculator" with "KalkulatorTik" across all 8 translation files. | **P1** | None | **YES** (Ready upon approval) |
| **DEF-007** | `frontend/public/manifest.json`: 2 | PWA / Browser Manifest | Web App Manifest declares short name as `"TikCalculator"`. | `frontend/public/manifest.json:2`: `"short_name": "TikCalculator"` | Update `short_name` and `name` to `"KalkulatorTik"`. | **P2** | None | **YES** (Ready upon approval) |
| **DEF-008** | `frontend/src/pages/Faq.jsx`: 36–37 | `https://www.kalkulatortik.com/faq` | Missing `<h1>` tag. Renders a category `<p>` tag followed directly by `<h2>{t('faq.subtitle')}</h2>`. | `frontend/src/pages/Faq.jsx:36-37` | Convert heading structure so that `<h1>` renders the main page topic (e.g. `<h1>Frequently Asked Questions</h1>`). | **P1** | None | **YES** (Ready upon approval) |
| **DEF-009** | `frontend/src/pages/Calculator.jsx`: 120 | `https://www.kalkulatortik.com/calculator` | Missing `<h1>` tag entirely. Renders directly with `<h2 className="text-3xl font-bold...">Enter a username to get live estimates</h2>`. | `frontend/src/pages/Calculator.jsx:120` | If page is retained, wrap main title in a semantic `<h1>`. If page is consolidated into `/`, this defect resolves via redirect. | **P1** | STRAT-001 decision | **PENDING STRAT-001** |
| **DEF-010** | `frontend/src/locales/en/translation.json`: 272–278 (and all 8 locales) | `https://www.kalkulatortik.com/faq` | FAQ answers describe non-existent formulas (`views/1000 * CPM * ...`), non-existent country CPM presets (US, UK, IN, PK) with user overrides, and non-existent shareable link storage. | `translation.json:273`: `"We use (views/1000) * CPM * (1 - platform share)..."`<br>`translation.json:275`: `"Preset CPMs are seeded for select countries..."`<br>`translation.json:277`: `"We store only the inputs... to generate a shareable link"` | Rewrite the 4 Q&As in all 8 locales to accurately describe actual calculation methodology and remove false claims of non-existent features. | **P1** | None | **YES** (Ready upon approval) |
| **DEF-011** | `frontend/src/locales/en/translation.json`: 123–126 (and all 8 locales) | `https://www.kalkulatortik.com/` | FAQs 5 & 6 describe payouts via the discontinued "TikTok Creator Fund". | `translation.json:124`: `"...live gifts, and the TikTok Creator Fund."`<br>`translation.json:126`: `"...including the Creator Fund..."` | Update terminology to the **TikTok Creator Rewards Program** and explain actual qualification requirements (1-minute+ video duration, 10k followers, qualified views). | **P2** | None | **YES** (Ready upon approval) |

---

### 4.2. Strategic & Architectural Decisions (Requires User Direction)

| Issue ID | File / Components | Affected Pages | Description & Findings | Strategic Options | Priority | Status |
|---|---|---|---|---|---|---|
| **STRAT-001** | `frontend/src/pages/Home.jsx`<br>`frontend/src/pages/Calculator.jsx`<br>`frontend/src/components/Navbar.jsx` | `https://www.kalkulatortik.com/`<br>`https://www.kalkulatortik.com/calculator` | **Semantic & Tool Redundancy**: Both pages render identical username lookup tools. Homepage has full educational content (~1,039 words); `/calculator` has no guide (~364 words). Internal navigation links to both. | **Option A (Consolidation - Recommended)**: 301-redirect `/calculator` to `/`, remove `/calculator` from Navbar and sitemap. Consolidates 100% of backlinks and PageRank on the root URL.<br><br>**Option B (Specialization)**: Convert `/calculator` into an advanced **TikTok Creator Rewards RPM Simulator** (dynamic video length, qualified view percentage, and RPM sliders), keeping `/` as the profile-level scanner. | **P1** | **Awaiting User Selection** (Option A vs B) |
| **STRAT-002** | `frontend/src/pages/Contact.jsx` | `https://www.kalkulatortik.com/contact` | **Contact Infrastructure Gap**: Form runs a 1-second simulated timeout without transmitting data. Translation files contain unverified third-party address `tikcalculator@proton.me`. No domain email inbox currently exists. | **Option A (Domain Mailbox)**: Domain owner configures MX records for `kalkulatortik.com` (e.g., Cloudflare Email Routing to personal inbox) and publishes verified contact channel.<br><br>**Option B (Form Backend)**: Connect existing form to a managed form service (e.g. Formspree / Web3Forms) using the owner's verified recipient email.<br><br>**Option C (Direct Mailto)**: Replace form with a verified direct support email once provisioned. | **P1** | **Awaiting User Infrastructure Direction** |
| **STRAT-003** | `frontend/src/i18n.js`<br>`frontend/src/main.jsx` | All non-English locales (`de`, `es`, `fr`, `id`, `it`, `ms`, `pt`) | **Unindexable Client-Side Localization**: Translations exist in JSON dictionaries but switch via React-i18next in `localStorage` without unique URL prefixes (e.g., `/es/`, `/de/`) or `hreflang` tags. Googlebot only indexes the default English state. | **Future Architectural Sprint**: Plan a migration to URL-based localization (e.g., React Router locale prefixes with server-side pre-rendering and dynamic `hreflang` headers) in a subsequent phase. Not an immediate one-line text edit. | **P2** | **Architectural Roadmap Item** |

---

### 4.3. Research & Growth Opportunities (Non-Defects)

| Opportunity ID | Topic / Opportunity | Search Demand Evidence | Nature of Item | Recommended Action |
|---|---|---|---|---|
| **OPP-001** | TikTok Coins & Diamonds to USD Calculator | 11 keywords, 1,470 monthly search volume (Cluster 4) | High-demand missing tool; not a bug in existing content. | Build a dedicated standalone calculator (`/tiktok-coins-calculator` or `/tiktok-gift-calculator`) with verified gift diamond conversions ($0.005/diamond cashout benchmark). |
| **OPP-002** | TikTok Video Views to Money & RPM Calculator | 7 keywords, 820 monthly search volume (Cluster 5) | Missing calculation model for raw view inputs (e.g. *"how much does TikTok pay for 1M views"*). | Build a dedicated calculator allowing users to calculate estimated earnings by view count, qualified view percentage, and niche RPM. |
| **OPP-003** | Structured Data (JSON-LD) Semantic Enhancement | Semantic best practice | Machine readability enhancement. | Implement `FAQPage` schema on Homepage and `/faq`, recognizing that it improves entity parsing for search engines, though Google rarely displays rich snippets for commercial utility sites. |

---

## 5. PRESERVATION OF EXISTING WORK

- **No source code, translation files, routing, SEO metadata, content, configuration, or dependencies have been modified during this phase.**
- The uncommitted ISS-001 parser and localization implementation changes (including `frontend/src/utils/parseMetricNumber.js`, its test suite, `TikTokEngagementCalculator.jsx`, and all 8 `translation.json` validation error keys) remain **100% intact**.
- Git working tree remains completely clean relative to the start of this phase.

---

## 6. RECOMMENDED IMMEDIATE NEXT STEP

Upon user review and approval of this Phase 6.1 correction report, implementation can safely proceed on the **Confirmed Brand & Legal Defects (Stage A)**:
1. **Fix DEF-001 & DEF-002 (P0):** Sanitize Terms of Service and Privacy Policy across all 8 languages, removing all occurrences of "TikCalculator" and legally asserting ownership on behalf of **KalkulatorTik** (`www.kalkulatortik.com`).
2. **Fix DEF-003, DEF-004, DEF-005, DEF-006, DEF-007 (P1/P2):** Update SEO metadata, manifest, and component headings to replace "TikCalculator" with **KalkulatorTik**, while removing `tikcalculator@proton.me` from translation files without publishing an unverified replacement.
3. **Fix DEF-008, DEF-010, DEF-011 (P1/P2):** Add `<h1>` to `/faq`, correct the inaccurate calculation formulas, and update deprecated Creator Fund copy.
