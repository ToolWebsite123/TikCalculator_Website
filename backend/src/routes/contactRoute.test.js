const express = require('express');
const request = require('supertest');
const { CONTACT_LIMITS, validateContactPayload } = require('../utils/contactValidation');
const { isContactConfigured, sendContactEmail } = require('../services/contactEmailService');
const { createSubmitContactHandler, getContactStatus } = require('../controllers/contactController');
const { createContactRouter } = require('./contactRoutes');
const app = require('../app');

const CONTACT_ENV_KEYS = [
  'CONTACT_EMAIL_API_KEY',
  'RESEND_API_KEY',
  'CONTACT_TO_EMAIL',
  'CONTACT_FROM_EMAIL',
  'CONTACT_EMAIL_API_URL',
];

describe('Contact API Validation, Unconfigured Fail-Closed Behavior & Delivery (KHK-11)', () => {
  const savedEnv = {};

  beforeEach(() => {
    CONTACT_ENV_KEYS.forEach((key) => {
      savedEnv[key] = process.env[key];
      delete process.env[key];
    });
  });

  afterEach(() => {
    CONTACT_ENV_KEYS.forEach((key) => {
      if (savedEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = savedEnv[key];
      }
    });
  });

  it('reports contact delivery unavailable when inbox/provider env vars are missing', async () => {
    expect(isContactConfigured()).toBe(false);
    const res = await request(app).get('/api/v1/contact/status');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, available: false });
  });

  it('rejects valid payloads with HTTP 503 when email delivery is not configured (never fakes success)', async () => {
    const res = await request(app).post('/api/v1/contact').send({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Methodology feedback',
      message: 'Please explain how engagement tiers affect CPM estimates.',
    });

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.available).toBe(false);
    expect(res.body.error).toMatch(/unavailable/i);
  });

  it('validates empty fields, invalid email, oversized messages, and honeypot trap on POST /api/v1/contact', async () => {
    const emptyRes = await request(app).post('/api/v1/contact').send({
      name: '   ',
      email: '',
      message: '',
    });
    expect(emptyRes.status).toBe(400);
    expect(emptyRes.body.success).toBe(false);
    expect(emptyRes.body.errors.name).toBeTruthy();
    expect(emptyRes.body.errors.email).toBeTruthy();
    expect(emptyRes.body.errors.message).toBeTruthy();

    const invalidEmailRes = await request(app).post('/api/v1/contact').send({
      name: 'Creator',
      email: 'not-an-email',
      message: 'Valid length message body here.',
    });
    expect(invalidEmailRes.status).toBe(400);
    expect(invalidEmailRes.body.errors.email).toMatch(/valid email/i);

    const oversizedMessage = 'a'.repeat(CONTACT_LIMITS.messageMax + 1);
    const oversizedRes = await request(app).post('/api/v1/contact').send({
      name: 'Creator',
      email: 'creator@example.com',
      message: oversizedMessage,
    });
    expect(oversizedRes.status).toBe(400);
    expect(oversizedRes.body.errors.message).toMatch(/2000 characters/i);

    const spamRes = await request(app).post('/api/v1/contact').send({
      name: 'Bot',
      email: 'bot@example.com',
      website: 'https://spam.example',
      message: 'Hello this is automated spam content.',
    });
    expect(spamRes.status).toBe(400);
    expect(spamRes.body.success).toBe(false);

    // Strips header-injection newlines cleanly in sanitized output
    const sanitized = validateContactPayload({
      name: "Jane\r\nBcc: evil@example.com",
      email: 'jane@example.com',
      subject: "Question\r\nInject",
      message: 'Checking valid message content.',
    });
    expect(sanitized.valid).toBe(true);
    expect(sanitized.data.name).not.toMatch(/[\r\n]/);
    expect(sanitized.data.subject).not.toMatch(/[\r\n]/);
  });

  it('enforces strict per-IP rate limiting on contact submissions', async () => {
    const testApp = express();
    testApp.use(express.json());
    testApp.use('/api/v1/contact', createContactRouter({ maxRequests: 2, windowMs: 60000 }));

    const validBody = {
      name: 'Tester',
      email: 'tester@example.com',
      message: 'Valid contact inquiry message body.',
    };

    const first = await request(testApp).post('/api/v1/contact').send(validBody);
    const second = await request(testApp).post('/api/v1/contact').send(validBody);
    const third = await request(testApp).post('/api/v1/contact').send(validBody);

    expect(first.status).toBe(503);
    expect(second.status).toBe(503);
    expect(third.status).toBe(429);
    expect(third.body.success).toBe(false);
    expect(third.body.error).toMatch(/too many/i);
  });

  it('delivers email when configured and returns 502 without faking success on provider failure', async () => {
    process.env.CONTACT_EMAIL_API_KEY = 're_test_dummy_key';
    process.env.CONTACT_TO_EMAIL = 'inbox@example.com';
    process.env.CONTACT_FROM_EMAIL = 'noreply@example.com';

    expect(isContactConfigured()).toBe(true);

    const mockFetchOk = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ id: 'msg_123' }),
    }));

    const okApp = express();
    okApp.use(express.json());
    okApp.get('/status', getContactStatus);
    okApp.post(
      '/',
      createSubmitContactHandler((payload) => sendContactEmail(payload, mockFetchOk))
    );

    const statusRes = await request(okApp).get('/status');
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.available).toBe(true);

    const successRes = await request(okApp).post('/').send({
      name: 'Grace Hopper',
      email: 'grace@example.com',
      subject: 'Question',
      message: 'Testing real provider success path.',
    });
    expect(successRes.status).toBe(200);
    expect(successRes.body.success).toBe(true);
    expect(mockFetchOk).toHaveBeenCalledTimes(1);

    const [, fetchInit] = mockFetchOk.mock.calls[0];
    const parsedSentBody = JSON.parse(fetchInit.body);
    expect(parsedSentBody.from).toBe('noreply@example.com');
    expect(parsedSentBody.to).toEqual(['inbox@example.com']);
    expect(parsedSentBody.reply_to).toBe('grace@example.com');

    const failFetch = jest.fn(async () => ({ ok: false, status: 500 }));
    const failApp = express();
    failApp.use(express.json());
    failApp.post(
      '/',
      createSubmitContactHandler((payload) => sendContactEmail(payload, failFetch))
    );

    const failRes = await request(failApp).post('/').send({
      name: 'Grace Hopper',
      email: 'grace@example.com',
      message: 'Testing provider rejection error path.',
    });
    expect(failRes.status).toBe(502);
    expect(failRes.body.success).toBe(false);
    expect(failRes.body.error).toMatch(/unable to send/i);
  });
});

