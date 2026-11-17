import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../i18n';
import i18n from '../i18n';
import About from './About';
import { LocaleProvider } from '../contexts/LocaleContext';
import { SEOProvider } from '../contexts/SEOContext';

const renderAboutWithContext = (lang = 'en') => {
  i18n.changeLanguage(lang);
  let collectedSeo = null;

  const result = render(
    <MemoryRouter initialEntries={['/about']}>
      <SEOProvider onCollect={(seo) => { collectedSeo = seo; }}>
        <LocaleProvider initialLang={lang}>
          <About />
        </LocaleProvider>
      </SEOProvider>
    </MemoryRouter>
  );

  return { ...result, getSeo: () => collectedSeo };
};

describe('About Page Audit & Verification Tests', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('renders single H1 and clean H2 section hierarchy without skipping levels', () => {
    renderAboutWithContext('en');

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toMatch(/about/i);

    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(4);
    const h2Texts = h2s.map((h) => h.textContent.trim());
    expect(h2Texts).toContain('Our Mission');
    expect(h2Texts).toContain('What We Offer');
    expect(h2Texts).toContain('Our Team');
    expect(h2Texts).toContain('Join Us');
  });

  it('renders all 4 platform offerings under What We Offer with functional internal links', () => {
    renderAboutWithContext('en');

    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));

    // Check earnings calculator link
    expect(hrefs).toContain('/');
    // Check CPM calculator link
    expect(hrefs).toContain('/tiktok-cpm-calculator');
    // Check engagement calculator link
    expect(hrefs).toContain('/tiktok-engagement-calculator');
    // Check FAQ link
    expect(hrefs).toContain('/faq');
  });

  it('provides structured AboutPage schema with Organization publisher and canonical URL', () => {
    const { getSeo } = renderAboutWithContext('en');
    const seo = getSeo();

    expect(seo).toBeTruthy();
    expect(seo.structuredData).toBeTruthy();
    expect(seo.structuredData['@type']).toBe('AboutPage');
    expect(seo.structuredData.publisher['@type']).toBe('Organization');
    expect(seo.structuredData.publisher.name).toBe('KalkulatorTik');
    expect(seo.canonicalUrl).toBe('https://www.kalkulatortik.com/about');
  });

  it('maintains title length <= 60 characters and description length <= 160 characters', () => {
    const { getSeo } = renderAboutWithContext('en');
    const seo = getSeo();

    expect(seo.title.length).toBeLessThanOrEqual(60);
    expect(seo.title.length).toBeGreaterThanOrEqual(20);
    expect(seo.description.length).toBeLessThanOrEqual(160);
    expect(seo.description.length).toBeGreaterThanOrEqual(50);
  });
});

