const { isValidEmail } = require('../utils/contactValidation');

const DEFAULT_EMAIL_API_URL = 'https://api.resend.com/emails';

const getContactEmailConfig = () => {
  const apiKey = (process.env.CONTACT_EMAIL_API_KEY || process.env.RESEND_API_KEY || '').trim();
  const toEmail = (process.env.CONTACT_TO_EMAIL || '').trim();
  const fromEmail = (process.env.CONTACT_FROM_EMAIL || '').trim();
  const apiUrl = (process.env.CONTACT_EMAIL_API_URL || DEFAULT_EMAIL_API_URL).trim();

  return {
    apiKey,
    toEmail,
    fromEmail,
    apiUrl,
  };
};

const isContactConfigured = () => {
  const { apiKey, toEmail, fromEmail } = getContactEmailConfig();
  return Boolean(apiKey && isValidEmail(toEmail) && isValidEmail(fromEmail));
};

const sendContactEmail = async ({ name, email, subject, message }, fetchImpl = global.fetch) => {
  if (!isContactConfigured()) {
    const err = new Error('Contact email service is not configured.');
    err.statusCode = 503;
    err.code = 'CONTACT_NOT_CONFIGURED';
    throw err;
  }

  if (typeof fetchImpl !== 'function') {
    const err = new Error('HTTP client unavailable for contact email delivery.');
    err.statusCode = 502;
    err.code = 'EMAIL_TRANSPORT_UNAVAILABLE';
    throw err;
  }

  const { apiKey, toEmail, fromEmail, apiUrl } = getContactEmailConfig();
  const emailSubject = subject ? `[KalkulatorTik Contact] ${subject}` : `[KalkulatorTik Contact] Message from ${name}`;
  const textBody = [
    `Sender Name: ${name}`,
    `Reply-To Email: ${email}`,
    subject ? `Subject: ${subject}` : null,
    '',
    'Message:',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n');

  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: emailSubject,
      text: textBody,
    }),
  };

  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    requestOptions.signal = AbortSignal.timeout(10000);
  }

  let response;
  try {
    response = await fetchImpl(apiUrl, requestOptions);
  } catch (networkErr) {
    const err = new Error('Unable to reach email delivery service.');
    err.statusCode = 502;
    err.code = 'EMAIL_DELIVERY_FAILED';
    err.cause = networkErr;
    throw err;
  }

  if (!response || !response.ok) {
    const err = new Error('Email provider rejected delivery request.');
    err.statusCode = 502;
    err.code = 'EMAIL_DELIVERY_FAILED';
    err.providerStatus = response?.status;
    throw err;
  }

  const data = typeof response.json === 'function' ? await response.json().catch(() => ({})) : {};
  return {
    delivered: true,
    id: data?.id || null,
  };
};

module.exports = {
  getContactEmailConfig,
  isContactConfigured,
  sendContactEmail,
};

