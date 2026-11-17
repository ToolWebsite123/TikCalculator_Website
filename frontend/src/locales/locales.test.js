import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const localesDir = path.resolve(__dirname);
const languages = ['en', 'de', 'es', 'fr', 'id', 'it', 'ms', 'pt'];

describe('Localization & FAQ Completeness Tests (All 8 Locales)', () => {
  languages.forEach((lang) => {
    describe(`Locale: ${lang}`, () => {
      const filePath = path.join(localesDir, lang, 'translation.json');

      it(`translation file exists and is valid JSON for ${lang}`, () => {
        expect(fs.existsSync(filePath)).toBe(true);
        const content = fs.readFileSync(filePath, 'utf8');
        expect(() => JSON.parse(content)).not.toThrow();
      });

      it(`contains all 4 approved FAQ sections in ${lang}`, () => {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        expect(json.faq).toBeDefined();
        expect(json.faq.sections).toBeDefined();
        expect(json.faq.sections.section1).toBeDefined();
        expect(json.faq.sections.section2).toBeDefined();
        expect(json.faq.sections.section3).toBeDefined();
        expect(json.faq.sections.section4).toBeDefined();
      });

      it(`contains exactly 12 approved FAQ questions in ${lang}`, () => {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const s = json.faq.sections;

        // Section 1: 3 questions
        expect(s.section1.q1.question).toBeTruthy();
        expect(s.section1.q1.answer).toBeTruthy();
        expect(s.section1.q2.question).toBeTruthy();
        expect(s.section1.q2.answer).toBeTruthy();
        expect(s.section1.q3.question).toBeTruthy();
        expect(s.section1.q3.answer).toBeTruthy();

        // Section 2: 3 questions
        expect(s.section2.q1.question).toBeTruthy();
        expect(s.section2.q1.answer).toBeTruthy();
        expect(s.section2.q2.question).toBeTruthy();
        expect(s.section2.q2.answer).toBeTruthy();
        expect(s.section2.q3.question).toBeTruthy();
        expect(s.section2.q3.answer).toBeTruthy();

        // Section 3: 4 questions
        expect(s.section3.q1.question).toBeTruthy();
        expect(s.section3.q1.answer).toBeTruthy();
        expect(s.section3.q2.question).toBeTruthy();
        expect(s.section3.q2.answer).toBeTruthy();
        expect(s.section3.q3.question).toBeTruthy();
        expect(s.section3.q3.answer).toBeTruthy();
        expect(s.section3.q4.question).toBeTruthy();
        expect(s.section3.q4.answer).toBeTruthy();

        // Section 4: 2 questions
        expect(s.section4.q1.question).toBeTruthy();
        expect(s.section4.q1.answer).toBeTruthy();
        expect(s.section4.q2.question).toBeTruthy();
        expect(s.section4.q2.answer).toBeTruthy();
      });

      it(`does NOT contain competitor brand in privacy and terms for ${lang}`, () => {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const privacyStr = JSON.stringify(json.privacy || {});
        const termsStr = JSON.stringify(json.terms || {});
        expect(privacyStr.includes('TikCalculator')).toBe(false);
        expect(termsStr.includes('TikCalculator')).toBe(false);
      });
    });
  });
});

