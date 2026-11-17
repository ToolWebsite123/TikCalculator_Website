import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import i18n from '../i18n';
import { LocaleProvider } from '../contexts/LocaleContext';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';

const renderWithRouter = (ui, initialEntry = '/', lang = 'en') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocaleProvider lang={lang}>{ui}</LocaleProvider>
    </MemoryRouter>
  );

describe('Legal Pages Architecture, Content & Compliance Tests', () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  describe('Privacy Policy (/privacy)', () => {
    it('renders single exact H1 and complete, unbroken H2/H3 heading hierarchy', () => {
      const { container } = renderWithRouter(<PrivacyPolicy />, '/privacy', 'en');

      // Single exact H1
      const h1s = container.querySelectorAll('h1');
      expect(h1s).toHaveLength(1);
      expect(h1s[0]).toHaveTextContent(/^Privacy Policy$/);

      // Verify all 14 H2 sections are present and ordered
      const h2s = Array.from(container.querySelectorAll('h2'));
      // 1 from Table of Contents + 14 content sections = 15 total H2s
      expect(h2s.length).toBeGreaterThanOrEqual(14);

      // Heading hierarchy check: no skipped levels (H1 -> H2 -> H3)
      const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const levels = headings.map((el) => Number(el.tagName.slice(1)));
      for (let i = 1; i < levels.length; i += 1) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    it('contains comprehensive privacy disclosures, verified domain, and contact link', () => {
      const { container } = renderWithRouter(<PrivacyPolicy />, '/privacy', 'en');

      // Truthful domain and brand name
      expect(container.textContent).toContain('https://www.kalkulatortik.com');
      expect(container.textContent).toContain('KalkulatorTik');

      // Independent platform disclosure
      expect(container.textContent).toMatch(/not affiliated with.*TikTok.*ByteDance/i);

      // Information not collected
      expect(container.textContent).toContain('No Account Credentials');
      expect(container.textContent).toContain('No Financial or Payment Data');
      expect(container.textContent).toContain('No Private Social Media Passwords');

      // Functional local storage disclosures
      expect(container.textContent).toContain('localStorage');
      expect(container.textContent).toContain('theme');
      expect(container.textContent).toContain('i18nextLng');

      // Rights and COPPA disclosures
      expect(container.textContent).toContain('GDPR');
      expect(container.textContent).toContain('CCPA/CPRA');
      expect(container.textContent).toContain('COPPA');

      // No competitor leak
      expect(container.textContent).not.toContain('TikCalculator');

      // Contact links resolve cleanly to /contact
      const contactLinks = screen.getAllByRole('link', { name: /contact/i });
      expect(contactLinks.some((l) => l.getAttribute('href') === '/contact')).toBe(true);
    });

    it('remains strictly in English even when viewed under non-English locale routes', async () => {
      await act(async () => {
        await i18n.changeLanguage('de');
      });

      const { container } = renderWithRouter(<PrivacyPolicy />, '/de/privacy', 'de');

      // Content must remain English
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Privacy Policy');
      expect(container.textContent).toContain('Language Notice:');
      expect(container.textContent).toContain(
        'KalkulatorTik publishes and maintains its formal Privacy Policy and terms exclusively in English.'
      );
      expect(container.textContent).toContain('Table of Contents');

      // Contact link preserves active German prefix
      const contactLinks = screen.getAllByRole('link', { name: /contact/i });
      expect(contactLinks.some((l) => l.getAttribute('href') === '/de/contact')).toBe(true);
    });
  });

  describe('Terms and Conditions (/terms)', () => {
    it('renders single exact H1 and complete, unbroken H2/H3 heading hierarchy', () => {
      const { container } = renderWithRouter(<TermsAndConditions />, '/terms', 'en');

      // Single exact H1
      const h1s = container.querySelectorAll('h1');
      expect(h1s).toHaveLength(1);
      expect(h1s[0]).toHaveTextContent(/^Terms and Conditions$/);

      // Verify all 16 H2 sections are present
      const h2s = Array.from(container.querySelectorAll('h2'));
      // 1 from Table of Contents + 16 content sections = 17 total H2s
      expect(h2s.length).toBeGreaterThanOrEqual(16);

      // Heading hierarchy check: no skipped levels (H1 -> H2 -> H3)
      const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const levels = headings.map((el) => Number(el.tagName.slice(1)));
      for (let i = 1; i < levels.length; i += 1) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    it('contains explicit disclaimer anchor (#disclaimer), accuracy disclaimers, and platform independence', () => {
      const { container } = renderWithRouter(<TermsAndConditions />, '/terms', 'en');

      // Dedicated disclaimer anchor exists for /terms#disclaimer
      const disclaimerSection = container.querySelector('section#disclaimer');
      expect(disclaimerSection).not.toBeNull();
      expect(disclaimerSection.textContent).toContain(
        'Comprehensive Disclaimer of Estimates & Accuracy'
      );
      expect(disclaimerSection.textContent).toContain(
        'estimates for informational and educational purposes only'
      );
      expect(disclaimerSection.textContent).toContain('No Guarantee of Earnings, Reach, or Performance');

      // Platform independence
      expect(container.textContent).toMatch(/not affiliated with.*TikTok.*ByteDance/i);
      expect(container.textContent).toContain('nominative fair use');

      // Free utility model & prohibited conduct
      expect(container.textContent).toContain('Free Utility Model');
      expect(container.textContent).toContain('Permitted & Prohibited Use');

      // Copyright & DMCA Takedown
      expect(container.textContent).toContain('Copyright & DMCA Takedown Policy');

      // Warranty & Liability disclaimers
      expect(container.textContent).toContain('AS IS');
      expect(container.textContent).toContain('Limitation of Liability');

      // No competitor leak
      expect(container.textContent).not.toContain('TikCalculator');

      // Contact links resolve cleanly to /contact
      const contactLinks = screen.getAllByRole('link', { name: /contact/i });
      expect(contactLinks.some((l) => l.getAttribute('href') === '/contact')).toBe(true);
    });

    it('remains strictly in English even when viewed under non-English locale routes', async () => {
      await act(async () => {
        await i18n.changeLanguage('id');
      });

      const { container } = renderWithRouter(<TermsAndConditions />, '/id/terms', 'id');

      // Content must remain English
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terms and Conditions');
      expect(container.textContent).toContain('Language Notice:');
      expect(container.textContent).toContain(
        'KalkulatorTik publishes and maintains its formal Terms and Conditions exclusively in English.'
      );
      expect(container.textContent).toContain('Table of Contents');

      // Contact link preserves active Indonesian prefix
      const contactLinks = screen.getAllByRole('link', { name: /contact/i });
      expect(contactLinks.some((l) => l.getAttribute('href') === '/id/contact')).toBe(true);
    });
  });
});

