import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../i18n';
import i18n from '../i18n';
import Footer from './Footer';
import { LocaleProvider } from '../contexts/LocaleContext';

const renderFooter = (lang = 'en') => {
  i18n.changeLanguage(lang);
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LocaleProvider initialLang={lang}>
        <Footer />
      </LocaleProvider>
    </MemoryRouter>
  );
};

describe('Footer Navigation & Scroll-to-Top Interactions', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    i18n.changeLanguage('en');
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    vi.restoreAllMocks();
  });

  it('renders all essential footer navigation links', () => {
    renderFooter('en');

    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /engagement calculator/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /cpm calculator/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /about/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /contact/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /terms/i })).toBeTruthy();
  });

  it('scrolls smoothly to top when user clicks on Privacy Policy link', () => {
    renderFooter('en');

    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    fireEvent.click(privacyLink);

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0, behavior: 'smooth' })
    );
  });

  it('scrolls smoothly to top when user clicks on Engagement Calculator link', () => {
    renderFooter('en');

    const engagementLink = screen.getByRole('link', { name: /engagement calculator/i });
    fireEvent.click(engagementLink);

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0, behavior: 'smooth' })
    );
  });

  it('scrolls smoothly to top when user clicks on CPM Calculator or Terms links', () => {
    renderFooter('en');

    const cpmLink = screen.getByRole('link', { name: /cpm calculator/i });
    fireEvent.click(cpmLink);
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0, behavior: 'smooth' })
    );

    const termsLink = screen.getByRole('link', { name: /terms/i });
    fireEvent.click(termsLink);
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0, behavior: 'smooth' })
    );
  });
});
