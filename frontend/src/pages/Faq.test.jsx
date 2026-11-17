import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../i18n';
import i18n from '../i18n';
import Faq from './Faq';
import { LocaleProvider } from '../contexts/LocaleContext';
import { SEOProvider } from '../contexts/SEOContext';

const renderFaqWithContext = (lang = 'en') => {
  i18n.changeLanguage(lang);
  let collectedSeo = null;

  const result = render(
    <MemoryRouter initialEntries={['/faq']}>
      <SEOProvider onCollect={(seo) => { collectedSeo = seo; }}>
        <LocaleProvider initialLang={lang}>
          <Faq />
        </LocaleProvider>
      </SEOProvider>
    </MemoryRouter>
  );

  return { ...result, getSeo: () => collectedSeo };
};

describe('FAQ Page Audit & Verification Tests', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('renders single H1 and clean H2 section hierarchy', () => {
    renderFaqWithContext('en');

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);

    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(4);
  });

  it('contains accessible accordion buttons with aria-expanded', () => {
    renderFaqWithContext('en');

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(12);

    const firstBtn = buttons[0];
    expect(firstBtn.getAttribute('aria-expanded')).not.toBeNull();

    // Toggle interaction
    const initialExpanded = firstBtn.getAttribute('aria-expanded');
    fireEvent.click(firstBtn);
    expect(firstBtn.getAttribute('aria-expanded')).not.toBe(initialExpanded);
  });

  it('renders valid FAQPage schema with at least 12 questions in head', () => {
    renderFaqWithContext('en');

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const parsed = JSON.parse(script.textContent);
    expect(parsed['@type']).toBe('FAQPage');
    expect(parsed.mainEntity.length).toBe(12);
    expect(parsed.mainEntity[0]['@type']).toBe('Question');
    expect(parsed.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
  });

  it('maintains SEO title length <= 60 characters and description <= 160 characters', () => {
    const { getSeo } = renderFaqWithContext('en');
    const seo = getSeo();

    expect(seo.title.length).toBeLessThanOrEqual(60);
    expect(seo.title.length).toBeGreaterThanOrEqual(20);
    expect(seo.description.length).toBeLessThanOrEqual(160);
    expect(seo.description.length).toBeGreaterThanOrEqual(50);
  });
});
