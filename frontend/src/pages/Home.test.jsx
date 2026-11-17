import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../i18n'; // Initialize i18next
import Home from './Home';
import EarningsCard from '../components/EarningsCard';
import StatsGrid from '../components/StatsGrid';
import * as api from '../utils/api';
import { getHomeLocalePack, loadAllHomeLocalePacks } from '../locales/homeContentRegistry';
import '@testing-library/jest-dom';

describe('Homepage & Components Integration Tests', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('renders Home with single exact H1 ("TikTok Money Calculator") and functional calculator form elements', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verify exactly 1 H1 with exact required text
    const h1s = container.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent.trim()).toBe('TikTok Money Calculator');

    // Verify username input and approved CTA button
    expect(screen.getByLabelText(/TikTok username input/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Calculate Sponsorship Value$/i })
    ).toBeInTheDocument();

    // Verify SEO title, canonical link, robots, social meta, and meta description
    expect(document.title).toBe(
      'TikTok Money Calculator – Estimate Your TikTok Earnings'
    );
    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).toHaveAttribute(
      'content',
      'Estimate your TikTok earnings using our free TikTok Money Calculator. Explore potential income from views, followers, engagement, and sponsored posts.'
    );
    const metaRobots = document.querySelector('meta[name="robots"]');
    expect(metaRobots).toHaveAttribute('content', 'index, follow');
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).toHaveAttribute('href', 'https://www.kalkulatortik.com/');
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://www.kalkulatortik.com/'
    );
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://www.kalkulatortik.com/og.png'
    );
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
    const faqSchemaEl = document.querySelector('script[data-seo-managed="page-schema"]');
    expect(faqSchemaEl).not.toBeNull();
    const faqSchema = JSON.parse(faqSchemaEl.textContent);
    expect(faqSchema['@type']).toBe('FAQPage');
    expect(faqSchema.mainEntity.length).toBe(12);

    // Verify clean heading hierarchy (no skipped heading levels)
    const headingLevels = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
      (el) => Number(el.tagName.slice(1))
    );
    for (let i = 1; i < headingLevels.length; i += 1) {
      expect(headingLevels[i] - headingLevels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it('renders all 10 approved homepage sections and internal navigation links', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Section 1: Hero H1
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /^TikTok Money Calculator$/i,
      })
    ).toBeInTheDocument();

    // Opening Intro Section: What Is a TikTok Money Calculator?
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /What Is a TikTok Money Calculator\?/i,
      })
    ).toBeInTheDocument();

    // Section 2: How to Use the TikTok Money Calculator
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /How to Use the TikTok Money Calculator/i,
      })
    ).toBeInTheDocument();

    // Section 3: Calculator Results Explanation
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Profile Performance & Estimated Sponsorship Value/i,
      })
    ).toBeInTheDocument();

    // Section 4: How the Calculation Works
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /How the TikTok Money Calculator Estimates Sponsorship Value/i,
      })
    ).toBeInTheDocument();

    // Section 5: Brand Sponsorships vs TikTok Creator Rewards
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Brand Sponsorships vs\. TikTok Creator Rewards: What Is the Difference\?/i,
      })
    ).toBeInTheDocument();

    // Section 6: What Affects TikTok Sponsorship Rates?
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /What Affects TikTok Sponsorship Rates\?/i,
      })
    ).toBeInTheDocument();

    // Section 7: Followers vs Video Views
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Followers vs\. Video Views: Which Matters More for TikTok Sponsorships\?/i,
      })
    ).toBeInTheDocument();

    // Section 8: Related Calculator Tools
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Explore More Free TikTok Calculators/i,
      })
    ).toBeInTheDocument();

    // Section 9: Frequently Asked Questions
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /TikTok Money Calculator & Sponsorship Valuation FAQs/i,
      })
    ).toBeInTheDocument();

    // Section 10: Final CTA and Homepage Closing
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Ready to Benchmark Your TikTok Sponsorship Value\?/i,
      })
    ).toBeInTheDocument();

    // Verify logical section order in InfoSection
    const infoSectionIds = Array.from(container.querySelectorAll('section[id]'))
      .map((el) => el.getAttribute('id'));
    expect(infoSectionIds).toEqual([
      'what-is-tiktok-money-calculator',
      'how-to-use',
      'results-explanation',
      'how-calculation-works',
      'sponsorships-vs-creator-rewards',
      'sponsorship-pricing-factors',
      'followers-vs-views',
      'related-calculator-tools',
      'frequently-asked-questions',
      'homepage-closing',
    ]);

    // Key visible internal links present
    const links = screen.getAllByRole('link').map((el) => el.getAttribute('href'));
    expect(links).toContain('/tiktok-engagement-calculator');
    expect(links).toContain('/tiktok-cpm-calculator');
    expect(links).toContain('/calculator');
    expect(links).toContain('/about');
    expect(links).toContain('/faq');
    expect(
      screen.queryByText(/Independent Platform & Methodology Disclaimer/i)
    ).not.toBeInTheDocument();
  });

  it('supports FAQ accordion expand and collapse interactions with accessible ARIA attributes', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const faq3Toggle = screen.getByRole('button', {
      name: /Toggle answer for: 3\. How is a TikTok sponsorship estimate calculated on KalkulatorTik\?/i,
    });

    expect(faq3Toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(faq3Toggle);
    expect(faq3Toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(faq3Toggle);
    expect(faq3Toggle).toHaveAttribute('aria-expanded', 'false');

    const faq6Toggle = screen.getByRole('button', {
      name: /Toggle answer for: 6\. Does the calculator require a TikTok password or account login\?/i,
    });
    fireEvent.click(faq6Toggle);
    expect(faq6Toggle).toHaveAttribute('aria-expanded', 'true');
    const faq6Panel = document.getElementById('faq-6-panel');
    expect(faq6Panel.querySelector('a[href="/privacy"]')).toHaveAttribute('href', '/privacy');
  });

  it('validates empty username and whitespace in username input', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', {
      name: /^Calculate Sponsorship Value$/i,
    });
    fireEvent.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(
      /Please enter a valid public TikTok username to run a calculation\./i
    );

    const input = screen.getByLabelText(/TikTok username input/i);
    fireEvent.change(input, { target: { value: 'invalid user name' } });
    fireEvent.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(
      /Usernames cannot contain spaces\. Please check the handle and try again\./i
    );
  });

  it('handles live lookup stripping @ symbol and displaying dynamic results and error state', async () => {
    const fetchSpy = vi
      .spyOn(api, 'fetchTikTokStats')
      .mockResolvedValueOnce({
        profile: {
          username: 'creator_demo',
          fullName: 'Creator Demo',
          verified: true,
          followers: 310000,
          following: 120,
          likes: 4200000,
          videos: 180,
          bio: 'Public bio text',
          region: 'US',
        },
        earningsData: {
          estimatedEarnings: 1987.65,
          earningsMin: 1450.2,
          earningsMax: 2790.4,
          cpm: 36.12,
          cpmMin: 26.35,
          cpmMax: 50.7,
          avgViews: 55000,
          engagementRate: 8.45,
          analytics: { sampleSize: 12 },
        },
      })
      .mockRejectedValueOnce({
        response: { status: 404 },
      });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const input = screen.getByLabelText(/TikTok username input/i);
    fireEvent.change(input, { target: { value: '@creator_demo' } });
    expect(input.value).toBe('creator_demo');

    const submitButton = screen.getByRole('button', {
      name: /^Calculate Sponsorship Value$/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        'creator_demo',
        {},
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(screen.getByText(/Results for @creator_demo/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Estimated TikTok earnings: $1,987.65')).toBeInTheDocument();
      expect(screen.getByText('310K')).toBeInTheDocument();
      expect(screen.getByText('8.45%')).toBeInTheDocument();
    });

    // Test 404 / private profile error handling
    fireEvent.change(input, { target: { value: 'missing_creator' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /Unable to find public data for "@missing_creator"/i
      );
    });
  });

  it('renders Home cleanly without raw translation keys or obsolete marketing content', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const text = container.textContent;

    // Must NOT contain raw translation keys
    expect(text).not.toContain('home.subtitle');
    expect(text).not.toContain('homeContent.');
    expect(text).not.toContain('infoSection.');

    // Must NOT contain obsolete RapidAPI copy or old marketing claims
    expect(text).not.toContain('RapidAPI');

    // Must NOT label /calculator route as the competing "Main Calculator"
    expect(text).not.toContain('Main Calculator');
    expect(text).not.toContain('Main TikTok Profile & Earnings Calculator');
  });

  it('renders EarningsCard correctly with sponsorship label, ranges, and disclaimer', () => {
    const mockData = {
      estimatedEarnings: 235263.68,
      earningsMin: 156803.36,
      earningsMax: 339760.16,
      cpm: 20.06,
      cpmMin: 13.37,
      cpmMax: 28.97,
    };

    render(<EarningsCard earningsData={mockData} />);

    expect(screen.getByText(/ESTIMATED SPONSORSHIP VALUE PER VIDEO/i)).toBeInTheDocument();
    expect(screen.getByText('$235,263.68')).toBeInTheDocument();
    expect(screen.getByText('$156,803.36 – $339,760.16')).toBeInTheDocument();
    expect(screen.getByText('$13.37 – $28.97')).toBeInTheDocument();
    expect(screen.getByText(/Does not represent direct platform payouts/i)).toBeInTheDocument();
  });

  it('renders StatsGrid with all 6 metrics when available', () => {
    const mockStats = {
      followers: 146600000,
      following: 346,
      likes: 1600000000,
      videos: 491,
      avgViews: 11728000,
      engagementRate: 2.22,
    };

    render(<StatsGrid stats={mockStats} />);

    expect(screen.getByText('146.6M')).toBeInTheDocument();
    expect(screen.getByText('1.6B')).toBeInTheDocument();
    expect(screen.getByText('491')).toBeInTheDocument();
    expect(screen.getByText('346')).toBeInTheDocument();
    expect(screen.getByText('11.7M')).toBeInTheDocument();
    expect(screen.getByText('2.22%')).toBeInTheDocument();
  });

  it('renders complete homepage content in Indonesian when language switches to id', async () => {
    await act(async () => {
      await i18n.changeLanguage('id');
    });

    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(document.documentElement.lang).toBe('id');
    expect(document.title).toBe('Kalkulator Uang TikTok – Perkirakan Penghasilan TikTok Anda');
    expect(
      screen.getByRole('heading', { level: 1, name: /^Kalkulator Uang TikTok$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Hitung Nilai Sponsor$/i })
    ).toBeInTheDocument();

    const expectedIndonesianSections = [
      /Apa Itu Kalkulator Uang TikTok\?/i,
      /Cara Menggunakan Kalkulator Uang TikTok/i,
      /Performa Profil & Perkiraan Nilai Sponsor/i,
      /Cara Kalkulator Uang TikTok Memperkirakan Nilai Sponsor/i,
      /Sponsor Merek vs\. TikTok Creator Rewards: Apa Bedanya\?/i,
      /Apa Saja yang Memengaruhi Tarif Sponsor TikTok\?/i,
      /Pengikut vs\. Tayangan Video: Mana yang Lebih Penting untuk Sponsor TikTok\?/i,
      /Jelajahi Kalkulator TikTok Gratis Lainnya/i,
      /FAQ Kalkulator Uang TikTok & Valuasi Sponsor/i,
      /Siap Mengukur Nilai Sponsor TikTok Anda\?/i,
    ];
    expectedIndonesianSections.forEach((pattern) => {
      expect(screen.getByRole('heading', { level: 2, name: pattern })).toBeInTheDocument();
    });

    const faqSchemaEl = document.querySelector('script[data-seo-managed="page-schema"]');
    expect(faqSchemaEl).not.toBeNull();
    const faqSchema = JSON.parse(faqSchemaEl.textContent);
    expect(faqSchema.inLanguage).toBe('id');
    expect(faqSchema.mainEntity.length).toBe(12);
    expect(container.textContent).not.toContain('What Is a TikTok Money Calculator?');
  });

  it('maintains identical pack structure and 12 FAQs across all 7 localized homepage packs', async () => {
    const packsByLang = await loadAllHomeLocalePacks();
    const expectedLangs = ['id', 'de', 'es', 'fr', 'it', 'ms', 'pt'];
    expect(Object.keys(packsByLang).sort()).toEqual([...expectedLangs].sort());

    const referencePack = packsByLang.id;
    const referenceCopySections = Object.keys(referencePack.copy).sort();

    expectedLangs.forEach((lang) => {
      const pack = packsByLang[lang];
      expect(Object.keys(pack).sort()).toEqual(Object.keys(referencePack).sort());
      expect(Object.keys(pack.copy).sort()).toEqual(referenceCopySections);

      referenceCopySections.forEach((sectionKey) => {
        expect(Object.keys(pack.copy[sectionKey]).sort()).toEqual(
          Object.keys(referencePack.copy[sectionKey]).sort()
        );
      });

      expect(pack.faqItems).toHaveLength(12);
      expect(pack.faqSchema['@type']).toBe('FAQPage');
      expect(pack.faqSchema.inLanguage).toBe(lang);
      expect(pack.faqSchema.mainEntity).toHaveLength(12);
      expect(pack.seo.title.length).toBeLessThanOrEqual(60);
      expect(pack.seo.description.length).toBeLessThanOrEqual(160);
    });
  });

  it.each([
    {
      lang: 'de',
      title: 'TikTok Geldrechner – Schätzen Sie Ihre TikTok-Einnahmen',
      h1: /^TikTok Geldrechner$/i,
      cta: /^Sponsoring-Wert berechnen$/i,
      introHeading: /Was ist ein TikTok Geldrechner\?/i,
      closingHeading: /Bereit, Ihren TikTok Sponsoring-Wert zu berechnen\?/i,
    },
    {
      lang: 'es',
      title: 'Calculadora de Dinero TikTok – Estima tus Ganancias',
      h1: /^Calculadora de Dinero de TikTok$/i,
      cta: /^Calcular Valor de Patrocinio$/i,
      introHeading: /¿Qué es una Calculadora de Dinero de TikTok\?/i,
      closingHeading: /¿Listo para Calcular Tu Valor de Patrocinio en TikTok\?/i,
    },
    {
      lang: 'fr',
      title: "Calculateur d'Argent TikTok – Estimez vos Revenus",
      h1: /^Calculateur d'Argent TikTok$/i,
      cta: /^Calculer la Valeur Sponsorisée$/i,
      introHeading: /Qu'est-ce qu'un Calculateur d'Argent TikTok \?/i,
      closingHeading: /Prêt à Évaluer Votre Valeur Sponsoring TikTok \?/i,
    },
    {
      lang: 'it',
      title: 'Calcolatore di Denaro TikTok – Stima i Tuoi Guadagni',
      h1: /^Calcolatore di Denaro TikTok$/i,
      cta: /^Calcola Valore Sponsorizzazione$/i,
      introHeading: /Cos'è un Calcolatore di Denaro TikTok\?/i,
      closingHeading: /Pronto a Stimare il Tuo Valore su TikTok\?/i,
    },
    {
      lang: 'ms',
      title: 'Kalkulator Wang TikTok – Anggarkan Pendapatan TikTok Anda',
      h1: /^Kalkulator Wang TikTok$/i,
      cta: /^Kira Nilai Tajaan$/i,
      introHeading: /Apakah Itu Kalkulator Wang TikTok\?/i,
      closingHeading: /Sedia Mengukur Nilai Tajaan TikTok Anda\?/i,
    },
    {
      lang: 'pt',
      title: 'Calculadora de Dinheiro TikTok – Estime Seus Ganhos',
      h1: /^Calculadora de Dinheiro TikTok$/i,
      cta: /^Calcular Valor de Patrocínio$/i,
      introHeading: /O Que É uma Calculadora de Dinheiro TikTok\?/i,
      closingHeading: /Pronto para Estimar Seu Valor de Patrocínio no TikTok\?/i,
    },
  ])(
    'renders complete localized homepage content and metadata when language switches to $lang',
    async ({ lang, title, h1, cta, introHeading, closingHeading }) => {
      await act(async () => {
        await i18n.changeLanguage(lang);
      });

      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      expect(document.documentElement.lang).toBe(lang);
      expect(document.title).toBe(title);
      expect(screen.getByRole('heading', { level: 1, name: h1 })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: cta })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: introHeading })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: closingHeading })).toBeInTheDocument();

      // Verify all 10 content section H2 headings exist alongside the 10 expected sections
      const h2Headings = screen.getAllByRole('heading', { level: 2 });
      expect(h2Headings.length).toBeGreaterThanOrEqual(10);

      // KHK-03 & KHK-04: Verify FAQ structure uses <h3><button>...</button></h3> with locale-matched ARIA labels
      const activePack = getHomeLocalePack(lang);
      const faqSection = container.querySelector('#frequently-asked-questions');
      const faqButtons = Array.from(faqSection.querySelectorAll('button'));
      expect(faqButtons).toHaveLength(12);
      faqButtons.forEach((btn) => {
        expect(btn.closest('h3')).not.toBeNull();
        expect(btn.querySelector('h3')).toBeNull();
        expect(btn.getAttribute('aria-label')).toContain(activePack.copy.faq.ariaTogglePrefix);
        expect(btn.getAttribute('aria-label')).not.toContain('Buka atau tutup jawaban:');
      });

      const closingSection = container.querySelector('#homepage-closing');
      expect(closingSection.getAttribute('aria-label')).toBe(
        activePack.copy.closing.sectionAriaLabel
      );
      expect(closingSection.getAttribute('aria-label')).not.toContain('Mulai penghitungan profil TikTok');

      // KHK-10 & KHK-06: Verify non-affiliation notice and locale-prefixed legal links in Section 10
      expect(closingSection.textContent).toContain('TikTok Inc.');
      expect(closingSection.textContent).toContain('ByteDance Ltd.');
      expect(closingSection.querySelector(`a[href="/${lang}/privacy"]`)).not.toBeNull();
      expect(closingSection.querySelector(`a[href="/${lang}/terms"]`)).not.toBeNull();

      const faqSchemaEl = document.querySelector('script[data-seo-managed="page-schema"]');
      expect(faqSchemaEl).not.toBeNull();
      const faqSchema = JSON.parse(faqSchemaEl.textContent);
      expect(faqSchema.inLanguage).toBe(lang);
      expect(faqSchema.mainEntity).toHaveLength(12);
      expect(container.textContent).not.toContain('What Is a TikTok Money Calculator?');
      expect(container.textContent).not.toContain('TikCalculator');
    }
  );

  it('uses localized ARIA labels and activates localized 429 and 500 error recovery in non-English UI (KHK-01, KHK-12)', async () => {
    await act(async () => {
      await i18n.changeLanguage('de');
    });

    vi.spyOn(api, 'fetchTikTokStats')
      .mockRejectedValueOnce({ status: 429, response: { status: 429 } })
      .mockRejectedValueOnce({ status: 500, isNetworkError: false, response: { status: 500 } });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(
      screen.getByRole('form', {
        name: /Suchformular für TikTok-Geldrechner nach Benutzername/i,
      })
    ).toBeInTheDocument();

    const input = screen.getByLabelText(/Eingabefeld für TikTok-Benutzernamen/i);
    const submitBtn = screen.getByRole('button', { name: /^Sponsoring-Wert berechnen$/i });

    fireEvent.change(input, { target: { value: 'busycreator' } });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Anfragen sind wegen hoher Auslastung vorübergehend begrenzt/i);
    });

    fireEvent.change(input, { target: { value: 'failingcreator' } });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /Profildaten konnten derzeit nicht abgerufen werden/i
      );
    });
  });

  it('prevents stale responses overwriting newer lookups and copies rate summary cleanly (KHK-14)', async () => {
    let resolveFirst;
    const firstPromise = new Promise((resolve) => {
      resolveFirst = resolve;
    });

    const spy = vi
      .spyOn(api, 'fetchTikTokStats')
      .mockImplementationOnce(() => firstPromise)
      .mockResolvedValueOnce({
        profile: { username: 'second_fast', fullName: 'Second Creator', followers: 80000, likes: 900000, videos: 50 },
        earningsData: { estimatedEarnings: 850, earningsMin: 600, earningsMax: 1100, cpm: 25, avgViews: 34000, engagementRate: 6.5 },
      });

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const input = screen.getByLabelText(/TikTok username input/i);
    const submitBtn = screen.getByRole('button', { name: /^Calculate Sponsorship Value$/i });
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'first_slow' } });
    fireEvent.click(submitBtn);

    fireEvent.change(input, { target: { value: 'second_fast' } });
    // Dispatch second submit while first slow lookup is still in flight
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Results for @second_fast/i)).toBeInTheDocument();
    });

    // Resolve slow first request AFTER second already rendered — second result must stay intact
    await act(async () => {
      resolveFirst({
        profile: { username: 'first_slow', fullName: 'First Creator', followers: 1000, likes: 1000, videos: 1 },
        earningsData: { estimatedEarnings: 10, avgViews: 500, engagementRate: 1.0 },
      });
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(screen.getByText(/Results for @second_fast/i)).toBeInTheDocument();
    expect(screen.queryByText(/Results for @first_slow/i)).not.toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: /Copy summary/i });
    fireEvent.click(copyBtn);
    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('@second_fast'));
      expect(screen.getByRole('button', { name: /Copied!/i })).toBeInTheDocument();
    });
  });

  it('shows a clear error without rendering fabricated estimates when backend earningsData is missing or invalid (KHK-08)', async () => {
    vi.spyOn(api, 'fetchTikTokStats')
      .mockResolvedValueOnce({
        profile: { username: 'no_earnings', fullName: 'No Earnings', followers: 50000 },
        earningsData: null,
      })
      .mockResolvedValueOnce({
        profile: { username: 'corrupt_earnings', fullName: 'Corrupt', followers: 50000 },
        earningsData: { estimatedEarnings: 'not-a-number' },
      });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const input = screen.getByLabelText(/TikTok username input/i);
    const submitBtn = screen.getByRole('button', { name: /^Calculate Sponsorship Value$/i });

    fireEvent.change(input, { target: { value: 'no_earnings' } });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Unable to retrieve profile data right now/i);
    });
    expect(screen.queryByText('ESTIMATED SPONSORSHIP VALUE PER VIDEO')).not.toBeInTheDocument();
    expect(screen.queryByText(/Results for @no_earnings/i)).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'corrupt_earnings' } });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Unable to retrieve profile data right now/i);
    });
    expect(screen.queryByText('ESTIMATED SPONSORSHIP VALUE PER VIDEO')).not.toBeInTheDocument();
    expect(screen.queryByText('$0.00')).not.toBeInTheDocument();
  });
});
