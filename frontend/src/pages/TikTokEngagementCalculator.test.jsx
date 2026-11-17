import React from 'react';
import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import fs from 'node:fs';
import path from 'node:path';
import i18n from '../i18n';
import { LocaleProvider } from '../contexts/LocaleContext';
import TikTokEngagementCalculator from './TikTokEngagementCalculator';

const SUPPORTED_LANGS = ['en', 'id', 'de', 'es', 'fr', 'it', 'ms', 'pt'];

const renderEngagementPage = (initialEntry = '/tiktok-engagement-calculator', lang = 'en') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocaleProvider lang={lang}>
        <TikTokEngagementCalculator />
      </LocaleProvider>
    </MemoryRouter>
  );

describe('/tiktok-engagement-calculator Content, Formula & Localization Verification', () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('computes ((Total Likes / Total Followers) / Total Videos) * 100 matching the worked example and renders complete heading hierarchy', () => {
    const { container } = renderEngagementPage('/tiktok-engagement-calculator');

    // Single exact H1
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('TikTok Engagement Rate Calculator');

    // All 10 H2 sections present in homepage-aligned logical flow
    const h2s = Array.from(container.querySelectorAll('h2'));
    expect(h2s).toHaveLength(10);
    expect(h2s.map((el) => el.textContent)).toEqual([
      'What Is TikTok Engagement Rate?',
      'Why Should You Calculate Your TikTok Engagement Rate?',
      'How to Calculate TikTok Engagement Rate',
      'How to Understand Your TikTok Engagement Rate',
      'TikTok Engagement Rate by Followers vs. Views',
      'What Is a Good TikTok Engagement Rate?',
      'What Factors Affect TikTok Engagement Rate?',
      'How to Improve Your TikTok Engagement Rate',
      'How Brands Use TikTok Engagement Rate to Evaluate Creators',
      'Frequently Asked Questions',
    ]);

    // No skipped heading levels (H1 -> H2 -> H3)
    const levels = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((el) =>
      Number(el.tagName.slice(1))
    );
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }

    // Printed manual formula matches exact calculator logic
    expect(
      screen.getByText(/Engagement Rate \(%\) = \(\(Total Likes ÷ Total Followers\) ÷ Total Videos\) × 100/i)
    ).toBeInTheDocument();

    // Run live worked example: 4.2M likes, 221 videos, 277.8K followers -> 6.84%
    fireEvent.change(screen.getByLabelText(/Total Likes/i), { target: { value: '4.2M' } });
    fireEvent.change(screen.getByLabelText(/Total Videos/i), { target: { value: '221' } });
    fireEvent.change(screen.getByLabelText(/Total Followers/i), { target: { value: '277.8K' } });
    fireEvent.click(screen.getByRole('button', { name: /^Calculate$/i }));

    expect(screen.getByText('6.84%')).toBeInTheDocument();
    expect(container.querySelectorAll('h2')).toHaveLength(10);

    // FAQ accordion starts with item 1 expanded and toggles cleanly on click
    const faqButtons = container.querySelectorAll('#engagement-faq button[aria-expanded]');
    expect(faqButtons).toHaveLength(8);
    expect(faqButtons[0]).toHaveAttribute('aria-expanded', 'true');
    expect(faqButtons[1]).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(faqButtons[1]);
    expect(faqButtons[1]).toHaveAttribute('aria-expanded', 'true');

    // Internal links resolve cleanly
    expect(screen.getByRole('link', { name: /TikTok CPM Calculator/i })).toHaveAttribute(
      'href',
      '/tiktok-cpm-calculator'
    );
    expect(screen.getByRole('link', { name: /TikTok Money Calculator/i })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('renders localized content and localized internal links on non-English routes', async () => {
    await act(async () => {
      await i18n.changeLanguage('de');
    });

    const { container } = renderEngagementPage('/de/tiktok-engagement-calculator', 'de');

    await waitFor(() => {
      expect(container.querySelectorAll('h2')).toHaveLength(10);
      expect(screen.getByRole('heading', { level: 2, name: /Was ist die TikTok-Engagement-Rate\?/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /TikTok-CPM-Rechner/i })).toHaveAttribute(
      'href',
      '/de/tiktok-cpm-calculator'
    );
    expect(screen.getByRole('link', { name: /TikTok-Geldrechner/i })).toHaveAttribute(
      'href',
      '/de/'
    );
  });

  it('maintains matching engagementCalculator content keys, 8 FAQs, and formula consistency across all 8 locales', () => {
    const enJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../locales/en/translation.json'), 'utf8')
    );
    const expectedSectionKeys = Object.keys(enJson.engagementCalculator.content);
    expect(expectedSectionKeys).toHaveLength(10);

    SUPPORTED_LANGS.forEach((lang) => {
      const json = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, `../locales/${lang}/translation.json`), 'utf8')
      );
      const ec = json.engagementCalculator;
      expect(ec).toBeDefined();
      expect(typeof ec.subtitle).toBe('string');
      expect(ec.subtitle.length).toBeGreaterThan(20);

      const content = ec.content;
      expect(Object.keys(content)).toEqual(expectedSectionKeys);
      expect(content.whyCalculate.points).toHaveLength(4);
      expect(content.howToCalculate.steps).toHaveLength(3);
      expect(content.followersVsViews.methods).toHaveLength(3);
      expect(content.howToUnderstand.points).toHaveLength(4);
      expect(content.goodRate.tableHeaders).toHaveLength(3);
      expect(content.goodRate.tableRows).toHaveLength(4);
      expect(content.factors.items).toHaveLength(5);
      expect(content.improve.tips).toHaveLength(6);
      expect(content.faq.items).toHaveLength(8);

      // No competitor brand leak and formula text mentions division by Videos/Followers
      const serialized = JSON.stringify(content);
      expect(serialized).not.toContain('TikCalculator');
      expect(serialized).not.toContain('(Likes + Comments + Shares) ÷ Followers × 100');
    });
  });
});

