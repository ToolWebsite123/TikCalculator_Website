import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import fs from 'node:fs';
import path from 'node:path';
import i18n from '../i18n';
import { LocaleProvider } from '../contexts/LocaleContext';
import TikTokCPMCalculator, {
  calculateCPM,
  calculateAdSpend,
  calculateImpressions,
  validateAndCalculateCPM
} from './TikTokCPMCalculator';

const SUPPORTED_LANGS = ['en', 'id', 'de', 'es', 'fr', 'it', 'ms', 'pt'];

const renderCPMPage = (initialEntry = '/tiktok-cpm-calculator', lang = 'en') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocaleProvider lang={lang}>
        <TikTokCPMCalculator />
      </LocaleProvider>
    </MemoryRouter>
  );

describe('TikTokCPMCalculator Math Helpers', () => {
  describe('calculateCPM: CPM = (Cost / Impressions) * 1000', () => {
    it('calculates CPM correctly for standard positive inputs', () => {
      // Cost = $500, Impressions = 100,000 -> CPM = $5.00
      expect(calculateCPM(500, 100000)).toBe(5);
    });

    it('calculates fractional CPM correctly', () => {
      // Cost = $125.50, Impressions = 25,000 -> CPM = 5.02
      expect(calculateCPM(125.5, 25000)).toBeCloseTo(5.02, 2);
    });

    it('returns null for zero impressions to prevent division by zero', () => {
      expect(calculateCPM(500, 0)).toBeNull();
    });

    it('returns null for negative cost or negative impressions', () => {
      expect(calculateCPM(-500, 100000)).toBeNull();
      expect(calculateCPM(500, -100000)).toBeNull();
    });

    it('returns null for NaN or invalid input', () => {
      expect(calculateCPM('abc', 100000)).toBeNull();
      expect(calculateCPM(500, 'xyz')).toBeNull();
    });
  });

  describe('calculateAdSpend: Cost = (CPM * Impressions) / 1000', () => {
    it('calculates Ad Spend correctly for standard inputs', () => {
      // CPM = $5.00, Impressions = 100,000 -> Cost = $500
      expect(calculateAdSpend(5, 100000)).toBe(500);
    });

    it('handles decimal CPM and impression counts', () => {
      // CPM = $3.50, Impressions = 50,000 -> Cost = $175
      expect(calculateAdSpend(3.5, 50000)).toBe(175);
    });

    it('returns null for zero CPM or zero impressions', () => {
      expect(calculateAdSpend(0, 100000)).toBeNull();
      expect(calculateAdSpend(5, 0)).toBeNull();
    });

    it('returns null for negative values', () => {
      expect(calculateAdSpend(-5, 100000)).toBeNull();
      expect(calculateAdSpend(5, -100000)).toBeNull();
    });
  });

  describe('calculateImpressions: Impressions = (Cost / CPM) * 1000', () => {
    it('calculates Impressions correctly for standard inputs', () => {
      // Cost = $500, CPM = $5.00 -> Impressions = 100,000
      expect(calculateImpressions(500, 5)).toBe(100000);
    });

    it('calculates fractional results accurately', () => {
      // Cost = $100, CPM = $4.00 -> Impressions = 25,000
      expect(calculateImpressions(100, 4)).toBe(25000);
    });

    it('returns null for zero CPM to prevent division by zero', () => {
      expect(calculateImpressions(500, 0)).toBeNull();
    });

    it('returns null for negative values', () => {
      expect(calculateImpressions(-500, 5)).toBeNull();
      expect(calculateImpressions(500, -5)).toBeNull();
    });
  });

  describe('validateAndCalculateCPM with metric parsing', () => {
    it('supports metric suffixes like 100K and 1.5M', () => {
      const resK = validateAndCalculateCPM({ mode: 'cpm', totalCost: '500', impressions: '100K' });
      expect(resK.error).toBeNull();
      expect(resK.result).toBe(5);

      const resM = validateAndCalculateCPM({ mode: 'cpm', totalCost: '1500', impressions: '1M' });
      expect(resM.error).toBeNull();
      expect(resM.result).toBe(1.5);
    });

    it('returns error on empty or invalid inputs', () => {
      const resEmpty = validateAndCalculateCPM({ mode: 'cpm', totalCost: '', impressions: '' });
      expect(resEmpty.errorKey).toBe('errorEmpty');

      const resInvalid = validateAndCalculateCPM({ mode: 'cpm', totalCost: 'abc', impressions: 'xyz' });
      expect(resInvalid.errorKey).toBe('errorPositive');

      const resNegative = validateAndCalculateCPM({ mode: 'cpm', totalCost: '-50', impressions: '1000' });
      expect(resNegative.errorKey).toBe('errorPositive');
    });
  });
});

describe('TikTokCPMCalculator Component & DOM Integration', () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('renders single H1 and complete 10-section H2 hierarchy without skipping levels', () => {
    const { container } = renderCPMPage('/tiktok-cpm-calculator');

    // Single exact H1
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('TikTok CPM Calculator');

    // Exactly 10 H2 content sections
    const h2s = Array.from(container.querySelectorAll('h2'));
    expect(h2s).toHaveLength(10);
    expect(h2s.map((el) => el.textContent)).toEqual([
      'What Is TikTok CPM and How Does It Work?',
      'The 3-Way TikTok CPM Calculation Formulas',
      'TikTok Ad CPM vs. Creator RPM vs. Sponsorship CPM',
      'Average TikTok CPM Rates & Objective Benchmarks',
      'Key Factors That Drive TikTok CPM Up or Down',
      '5 Proven Strategies to Lower Your TikTok Ad CPM',
      'TikTok CPM vs. CPC, CPV, and CTR: Key Metric Comparisons',
      'Explore More Free TikTok Calculators',
      'Frequently Asked Questions About TikTok CPM',
      'Ready to Benchmark Your TikTok CPM & Ad Reach?'
    ]);

    // No skipped heading levels (H1 -> H2 -> H3)
    const levels = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((el) =>
      Number(el.tagName.slice(1))
    );
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it('switches between 3 calculation modes and computes correctly', () => {
    renderCPMPage('/tiktok-cpm-calculator');

    // Mode 1: CPM (default) -> Cost $1200 / Impr 250,000 => $4.80 CPM
    const costInput = screen.getByLabelText(/Total Ad Spend/i);
    const imprInput = screen.getByLabelText(/Number of Ad Impressions/i);
    fireEvent.change(costInput, { target: { value: '1200' } });
    fireEvent.change(imprInput, { target: { value: '250000' } });
    fireEvent.click(screen.getByRole('button', { name: /^Calculate$/i }));

    expect(screen.getByText('$4.80')).toBeInTheDocument();
    expect(screen.getByText(/Typical Auction CPM/i)).toBeInTheDocument();

    // Mode 2: Spend -> CPM $4.80 / Impr 250,000 => $1,200.00
    fireEvent.click(screen.getByRole('tab', { name: /Solve for Ad Spend/i }));
    const cpmInput = screen.getByLabelText(/Target CPM/i);
    const imprInputSpend = screen.getByLabelText(/Number of Ad Impressions/i);
    fireEvent.change(cpmInput, { target: { value: '4.80' } });
    fireEvent.change(imprInputSpend, { target: { value: '250000' } });
    fireEvent.click(screen.getByRole('button', { name: /^Calculate$/i }));

    expect(screen.getByText('$1,200.00')).toBeInTheDocument();

    // Mode 3: Impressions -> Spend $1200 / CPM $4.80 => 250,000
    fireEvent.click(screen.getByRole('tab', { name: /Solve for Impressions/i }));
    const costInputImpr = screen.getByLabelText(/Total Ad Spend/i);
    const cpmInputImpr = screen.getByLabelText(/Target CPM/i);
    fireEvent.change(costInputImpr, { target: { value: '1200' } });
    fireEvent.change(cpmInputImpr, { target: { value: '4.80' } });
    fireEvent.click(screen.getByRole('button', { name: /^Calculate$/i }));

    expect(screen.getByText('250,000')).toBeInTheDocument();
  });

  it('populates fields correctly when quick preset buttons are clicked', () => {
    renderCPMPage('/tiktok-cpm-calculator');

    // Click Traffic preset ($1,200 / 250K imps)
    fireEvent.click(screen.getByRole('button', { name: /Traffic \(\$1,200 \/ 250K imps\)/i }));

    expect(screen.getByLabelText(/Total Ad Spend/i)).toHaveValue('1200');
    expect(screen.getByLabelText(/Number of Ad Impressions/i)).toHaveValue('250000');
    expect(screen.getByText('$4.80')).toBeInTheDocument();
  });

  it('toggles FAQ accordion items smoothly with accessible attributes', () => {
    const { container } = renderCPMPage('/tiktok-cpm-calculator');

    const faqButtons = container.querySelectorAll('#cpm-faq button[aria-expanded]');
    expect(faqButtons).toHaveLength(6);

    // First question is open by default
    expect(faqButtons[0]).toHaveAttribute('aria-expanded', 'true');
    expect(faqButtons[1]).toHaveAttribute('aria-expanded', 'false');

    // Clicking second question opens it
    fireEvent.click(faqButtons[1]);
    expect(faqButtons[1]).toHaveAttribute('aria-expanded', 'true');

    // Clicking again closes it
    fireEvent.click(faqButtons[1]);
    expect(faqButtons[1]).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders contextual internal links to Homepage and Engagement Calculator', () => {
    renderCPMPage('/tiktok-cpm-calculator');

    const homeLinks = screen.getAllByRole('link', { name: /TikTok Money Calculator/i });
    expect(homeLinks.some((l) => l.getAttribute('href') === '/')).toBe(true);

    const engLinks = screen.getAllByRole('link', { name: /TikTok Engagement Rate Calculator/i });
    expect(engLinks.some((l) => l.getAttribute('href') === '/tiktok-engagement-calculator')).toBe(true);
  });

  it('renders localized content and localized internal links on non-English routes', async () => {
    await act(async () => {
      await i18n.changeLanguage('de');
    });

    const { container } = renderCPMPage('/de/tiktok-cpm-calculator', 'de');

    await waitFor(() => {
      expect(container.querySelectorAll('h2')).toHaveLength(10);
      expect(
        screen.getByRole('heading', { level: 2, name: /Was ist der TikTok CPM und wie funktioniert er\?/i })
      ).toBeInTheDocument();
    });

    const deHomeLinks = screen.getAllByRole('link', { name: /TikTok Geld-Rechner/i });
    expect(deHomeLinks.some((l) => l.getAttribute('href') === '/de')).toBe(true);

    const deEngLinks = screen.getAllByRole('link', { name: /TikTok Engagement-Rechner/i });
    expect(deEngLinks.some((l) => l.getAttribute('href') === '/de/tiktok-engagement-calculator')).toBe(true);
  });
});

describe('All 8 Locales Verification for TikTok CPM Calculator', () => {
  const enJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../locales/en/translation.json'), 'utf8')
  );
  const expectedContentSections = Object.keys(enJson.cpmCalculator.content);

  SUPPORTED_LANGS.forEach((lang) => {
    it(`verifies translation completeness for locale: ${lang}`, () => {
      const json = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, `../locales/${lang}/translation.json`), 'utf8')
      );

      // Verify SEO title and description
      const seo = json.seo?.cpmCalculator;
      expect(seo).toBeDefined();
      expect(seo.title).toBeDefined();
      expect(seo.title.length).toBeLessThanOrEqual(60);
      expect(seo.description).toBeDefined();
      expect(seo.description.length).toBeGreaterThanOrEqual(140);
      expect(seo.description.length).toBeLessThanOrEqual(160);

      // Verify CPM calculator keys
      const cpm = json.cpmCalculator;
      expect(cpm).toBeDefined();
      expect(cpm.modes).toBeDefined();
      expect(cpm.modes.cpm).toBeDefined();
      expect(cpm.modes.spend).toBeDefined();
      expect(cpm.modes.impressions).toBeDefined();

      expect(cpm.presets).toBeDefined();
      expect(cpm.presets.awareness).toBeDefined();
      expect(cpm.presets.traffic).toBeDefined();
      expect(cpm.presets.conversions).toBeDefined();

      expect(cpm.results).toBeDefined();
      expect(cpm.results.benchmarkLow).toBeDefined();
      expect(cpm.results.benchmarkTypical).toBeDefined();
      expect(cpm.results.benchmarkCompetitive).toBeDefined();
      expect(cpm.results.benchmarkPremium).toBeDefined();

      // Verify all 10 content sections
      const content = cpm.content;
      expect(Object.keys(content)).toEqual(expectedContentSections);

      // Verify FAQ items
      expect(content.faq.q1).toBeDefined();
      expect(content.faq.q2).toBeDefined();
      expect(content.faq.q3).toBeDefined();
      expect(content.faq.q4).toBeDefined();
      expect(content.faq.q5).toBeDefined();
      expect(content.faq.q6).toBeDefined();

      // No competitor leak
      const serialized = JSON.stringify(cpm);
      expect(serialized).not.toContain('Omni');
      expect(serialized).not.toContain('InfluencerMarketingHub');
      expect(serialized).not.toContain('HypeAuditor');
    });
  });
});
