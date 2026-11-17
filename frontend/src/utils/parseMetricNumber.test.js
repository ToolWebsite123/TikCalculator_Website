import { describe, it, expect } from 'vitest';
import { parseMetricNumber } from './parseMetricNumber';
import { calculateEngagementRate, validateAndCalculateEngagement } from '../pages/TikTokEngagementCalculator';

describe('parseMetricNumber utility', () => {
  describe('Metric shorthand suffix scaling', () => {
    it('scales K and k by 1,000', () => {
      expect(parseMetricNumber('500K')).toBe(500000);
      expect(parseMetricNumber('500k')).toBe(500000);
      expect(parseMetricNumber('10K')).toBe(10000);
      expect(parseMetricNumber('1k')).toBe(1000);
    });

    it('scales M and m by 1,000,000', () => {
      expect(parseMetricNumber('1.5M')).toBe(1500000);
      expect(parseMetricNumber('1.5m')).toBe(1500000);
      expect(parseMetricNumber('10M')).toBe(10000000);
      expect(parseMetricNumber('0.5M')).toBe(500000);
      expect(parseMetricNumber('.5M')).toBe(500000);
    });

    it('scales B and b by 1,000,000,000', () => {
      expect(parseMetricNumber('2.4B')).toBe(2400000000);
      expect(parseMetricNumber('2.4b')).toBe(2400000000);
      expect(parseMetricNumber('1B')).toBe(1000000000);
    });
  });

  describe('Standard integers, decimals and whitespace', () => {
    it('parses standard integers without suffixes', () => {
      expect(parseMetricNumber('50000')).toBe(50000);
      expect(parseMetricNumber('100')).toBe(100);
      expect(parseMetricNumber('0')).toBe(0);
    });

    it('handles numeric types directly', () => {
      expect(parseMetricNumber(50000)).toBe(50000);
      expect(parseMetricNumber(0)).toBe(0);
    });

    it('handles leading, trailing, and internal whitespace between number and suffix', () => {
      expect(parseMetricNumber('  500K  ')).toBe(500000);
      expect(parseMetricNumber('2.5 B')).toBe(2500000000);
      expect(parseMetricNumber(' 100 k ')).toBe(100000);
    });
  });

  describe('Conventional thousands grouping with commas', () => {
    it('parses valid comma-separated numbers', () => {
      expect(parseMetricNumber('50,000')).toBe(50000);
      expect(parseMetricNumber('1,500,000')).toBe(1500000);
      expect(parseMetricNumber('1,000,000,000')).toBe(1000000000);
    });

    it('parses comma-separated numbers with metric suffixes', () => {
      expect(parseMetricNumber('1,500K')).toBe(1500000);
      expect(parseMetricNumber('1,250.5K')).toBe(1250500);
    });

    it('rejects ambiguous comma-decimal and malformed comma grouping', () => {
      expect(parseMetricNumber('1,5')).toBeNull();
      expect(parseMetricNumber('1,5M')).toBeNull();
      expect(parseMetricNumber('1,00')).toBeNull();
      expect(parseMetricNumber(',100')).toBeNull();
      expect(parseMetricNumber('100,')).toBeNull();
      expect(parseMetricNumber('1,,000')).toBeNull();
      expect(parseMetricNumber('1,000,00')).toBeNull();
    });
  });

  describe('Validation and rejection of malformed or invalid inputs', () => {
    it('rejects empty or whitespace-only inputs', () => {
      expect(parseMetricNumber('')).toBeNull();
      expect(parseMetricNumber('   ')).toBeNull();
      expect(parseMetricNumber(null)).toBeNull();
      expect(parseMetricNumber(undefined)).toBeNull();
    });

    it('rejects negative numbers', () => {
      expect(parseMetricNumber('-500K')).toBeNull();
      expect(parseMetricNumber('-10')).toBeNull();
      expect(parseMetricNumber('-1.5M')).toBeNull();
    });

    it('rejects non-numeric tokens and malformed strings', () => {
      expect(parseMetricNumber('abc')).toBeNull();
      expect(parseMetricNumber('1.5.0M')).toBeNull();
      expect(parseMetricNumber('10KK')).toBeNull();
      expect(parseMetricNumber('10Kx')).toBeNull();
      expect(parseMetricNumber('1.M')).toBeNull();
      expect(parseMetricNumber('M')).toBeNull();
      expect(parseMetricNumber('K')).toBeNull();
    });

    it('rejects values exceeding Number.MAX_SAFE_INTEGER', () => {
      expect(parseMetricNumber('10000000B')).toBeNull(); // 1e16 > MAX_SAFE_INTEGER (9e15)
      expect(parseMetricNumber('9007199254740992')).toBeNull(); // MAX_SAFE_INTEGER + 1
    });
  });
});

describe('Engagement Rate Calculation Critical Integration Scenarios', () => {
  it('Critical Test 1: Likes 1.5M, Videos 50, Followers 500K -> 6.00%', () => {
    const likes = parseMetricNumber('1.5M');
    const videos = parseMetricNumber('50');
    const followers = parseMetricNumber('500K');

    expect(likes).toBe(1500000);
    expect(videos).toBe(50);
    expect(followers).toBe(500000);

    const rate = calculateEngagementRate(likes, followers, videos);
    expect(rate).toBe(6.00);
    expect(rate.toFixed(2) + '%').toBe('6.00%');
  });

  it('Critical Test 2: Likes 50000, Videos 100, Followers 10K -> 5.00%', () => {
    const likes = parseMetricNumber('50000');
    const videos = parseMetricNumber('100');
    const followers = parseMetricNumber('10K');

    expect(likes).toBe(50000);
    expect(videos).toBe(100);
    expect(followers).toBe(10000);

    const rate = calculateEngagementRate(likes, followers, videos);
    expect(rate).toBe(5.00);
    expect(rate.toFixed(2) + '%').toBe('5.00%');
  });

  it('Critical Test 3: Likes 0, Videos 10, Followers 1000 -> 0.00%', () => {
    const likes = parseMetricNumber('0');
    const videos = parseMetricNumber('10');
    const followers = parseMetricNumber('1000');

    expect(likes).toBe(0);
    expect(videos).toBe(10);
    expect(followers).toBe(1000);

    const rate = calculateEngagementRate(likes, followers, videos);
    expect(rate).toBe(0.00);
    expect(rate.toFixed(2) + '%').toBe('0.00%');
  });

  it('Calculates correctly with comma-separated numbers (50,000 likes, 100 videos, 10,000 followers)', () => {
    const likes = parseMetricNumber('50,000');
    const videos = parseMetricNumber('100');
    const followers = parseMetricNumber('10,000');

    const rate = calculateEngagementRate(likes, followers, videos);
    expect(rate).toBe(5.00);
    expect(rate.toFixed(2) + '%').toBe('5.00%');
  });

  it('Calculates correctly with lowercase suffixes and spaces (2.5 B likes, 500 videos, 100m followers)', () => {
    const likes = parseMetricNumber('2.5 B');
    const videos = parseMetricNumber('500');
    const followers = parseMetricNumber('100m');

    expect(likes).toBe(2500000000);
    expect(videos).toBe(500);
    expect(followers).toBe(100000000);

    const rate = calculateEngagementRate(likes, followers, videos);
    expect(rate).toBe(5.00);
    expect(rate.toFixed(2) + '%').toBe('5.00%');
  });
});

describe('validateAndCalculateEngagement Workflow Tests', () => {
  it('returns rate 6.00% for valid input with shorthand (1.5M, 50, 500K)', () => {
    const res = validateAndCalculateEngagement({ totalLikes: '1.5M', totalVideos: '50', totalFollowers: '500K' });
    expect(res.error).toBeNull();
    expect(res.errorKey).toBeNull();
    expect(res.rate).toBe(6.00);
  });

  it('returns error when required field is empty', () => {
    const res = validateAndCalculateEngagement({ totalLikes: '', totalVideos: '50', totalFollowers: '500K' });
    expect(res.rate).toBeNull();
    expect(res.errorKey).toBe('errorRequired');
    expect(res.error).toContain('Please fill in all fields');
  });

  it('returns error when videos is zero', () => {
    const res = validateAndCalculateEngagement({ totalLikes: '5000', totalVideos: '0', totalFollowers: '10000' });
    expect(res.rate).toBeNull();
    expect(res.errorKey).toBe('errorZeroVideos');
    expect(res.error).toContain('Number of videos must be greater than zero');
  });

  it('returns error when followers is zero', () => {
    const res = validateAndCalculateEngagement({ totalLikes: '5000', totalVideos: '10', totalFollowers: '0' });
    expect(res.rate).toBeNull();
    expect(res.errorKey).toBe('errorZeroFollowers');
    expect(res.error).toContain('Number of followers must be greater than zero');
  });

  it('returns error when input is malformed or negative', () => {
    const resNeg = validateAndCalculateEngagement({ totalLikes: '-500K', totalVideos: '10', totalFollowers: '1000' });
    expect(resNeg.rate).toBeNull();
    expect(resNeg.errorKey).toBe('errorInvalid');
    expect(resNeg.error).toContain('Please enter valid numbers');

    const resMalformed = validateAndCalculateEngagement({ totalLikes: '1.5.0M', totalVideos: '10', totalFollowers: '1000' });
    expect(resMalformed.rate).toBeNull();
    expect(resMalformed.errorKey).toBe('errorInvalid');
    expect(resMalformed.error).toContain('Please enter valid numbers');

    const resText = validateAndCalculateEngagement({ totalLikes: 'abc', totalVideos: '10', totalFollowers: '1000' });
    expect(resText.rate).toBeNull();
    expect(resText.errorKey).toBe('errorInvalid');
    expect(resText.error).toContain('Please enter valid numbers');
  });

  it('returns 0.00% rate when likes is 0 with valid videos and followers', () => {
    const res = validateAndCalculateEngagement({ totalLikes: '0', totalVideos: '10', totalFollowers: '1000' });
    expect(res.error).toBeNull();
    expect(res.errorKey).toBeNull();
    expect(res.rate).toBe(0);
  });
});

describe('Locale Dictionaries Validation Messages Coverage', () => {
  const fs = require('fs');
  const path = require('path');
  const locales = ['en', 'de', 'es', 'fr', 'id', 'it', 'ms', 'pt'];
  const errorKeys = ['errorRequired', 'errorInvalid', 'errorZeroVideos', 'errorZeroFollowers'];

  it('all 8 locales define all 4 validation error keys with non-empty strings', () => {
    for (const loc of locales) {
      const filePath = path.resolve(__dirname, `../locales/${loc}/translation.json`);
      expect(fs.existsSync(filePath)).toBe(true);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(data.engagementCalculator).toBeDefined();

      for (const k of errorKeys) {
        expect(typeof data.engagementCalculator[k]).toBe('string');
        expect(data.engagementCalculator[k].length).toBeGreaterThan(0);
      }
    }
  });

  it('English translations match the expected default fallback strings', () => {
    const enPath = path.resolve(__dirname, '../locales/en/translation.json');
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    expect(enData.engagementCalculator.errorRequired).toBe('Please fill in all fields (Total Likes, Total Videos, Total Followers).');
    expect(enData.engagementCalculator.errorInvalid).toBe('Please enter valid numbers (e.g. 50000, 10K, 1.5M).');
    expect(enData.engagementCalculator.errorZeroVideos).toBe('Number of videos must be greater than zero.');
    expect(enData.engagementCalculator.errorZeroFollowers).toBe('Number of followers must be greater than zero.');
  });
});
