import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../i18n';
import i18n from '../i18n';
import Navbar from './Navbar';
import { LocaleProvider } from '../contexts/LocaleContext';

const renderNavbar = (lang = 'en') => {
  i18n.changeLanguage(lang);
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LocaleProvider initialLang={lang}>
        <Navbar />
      </LocaleProvider>
    </MemoryRouter>
  );
};

describe('Navbar Mobile Menu & Navigation Interactions', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    i18n.changeLanguage('en');
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    vi.restoreAllMocks();
  });

  it('renders logo and mobile toggle button with correct accessible attributes', () => {
    renderNavbar('en');

    expect(screen.getByRole('link', { name: /kalkulatortik/i })).toBeTruthy();
    const toggleBtn = screen.getByRole('button', { name: /open menu/i });
    expect(toggleBtn).toBeTruthy();
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens mobile menu on hamburger icon click and closes on subsequent click', () => {
    renderNavbar('en');

    const toggleBtn = screen.getByRole('button', { name: /open menu/i });

    // Initially mobile nav is not rendered
    expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).toBeNull();

    // Click to open
    fireEvent.click(toggleBtn);
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeTruthy();

    // Click to close
    fireEvent.click(toggleBtn);
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).toBeNull();
  });

  it('closes mobile menu when a mobile navigation link is clicked', () => {
    renderNavbar('en');

    const toggleBtn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(toggleBtn);

    const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i });
    expect(mobileNav).toBeTruthy();

    const mobileLinks = mobileNav.querySelectorAll('a');
    expect(mobileLinks.length).toBeGreaterThan(0);

    // Clicking a link closes the menu
    fireEvent.click(mobileLinks[0]);
    expect(screen.queryByRole('navigation', { name: /mobile navigation/i })).toBeNull();
  });
});
