const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  subjectMax: 150,
  messageMin: 10,
  messageMax: 2000,
  emailMax: 254,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const sanitizeSingleLine = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
};

const sanitizeMessageBody = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(/\r\n/g, '\n').trim();
};

const isValidEmail = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > CONTACT_LIMITS.emailMax) return false;
  if (/[\r\n]/.test(trimmed)) return false;
  return EMAIL_REGEX.test(trimmed);
};

const validateContactPayload = (body = {}) => {
  const payload = body && typeof body === 'object' ? body : {};
  const honeypot = typeof payload.website === 'string' ? payload.website.trim() : '';

  if (honeypot.length > 0) {
    return {
      valid: false,
      isSpam: true,
      errors: { form: 'Invalid submission.' },
      error: 'Invalid submission.',
      data: null,
    };
  }

  const name = sanitizeSingleLine(payload.name);
  const email = sanitizeSingleLine(payload.email);
  const subject = sanitizeSingleLine(payload.subject);
  const message = sanitizeMessageBody(payload.message);

  const errors = {};

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length < CONTACT_LIMITS.nameMin) {
    errors.name = `Name must be at least ${CONTACT_LIMITS.nameMin} characters.`;
  } else if (name.length > CONTACT_LIMITS.nameMax) {
    errors.name = `Name must be ${CONTACT_LIMITS.nameMax} characters or fewer.`;
  }

  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (subject.length > CONTACT_LIMITS.subjectMax) {
    errors.subject = `Subject must be ${CONTACT_LIMITS.subjectMax} characters or fewer.`;
  }

  if (!message) {
    errors.message = 'Message is required.';
  } else if (message.length < CONTACT_LIMITS.messageMin) {
    errors.message = `Message must be at least ${CONTACT_LIMITS.messageMin} characters.`;
  } else if (message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Message must be ${CONTACT_LIMITS.messageMax} characters or fewer.`;
  }

  const firstError = Object.values(errors)[0] || '';

  return {
    valid: Object.keys(errors).length === 0,
    isSpam: false,
    errors,
    error: firstError,
    data: { name, email, subject, message },
  };
};

module.exports = {
  CONTACT_LIMITS,
  isValidEmail,
  sanitizeSingleLine,
  sanitizeMessageBody,
  validateContactPayload,
};

