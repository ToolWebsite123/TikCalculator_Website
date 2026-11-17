const { validateContactPayload } = require('../utils/contactValidation');
const { isContactConfigured, sendContactEmail } = require('../services/contactEmailService');

const getContactStatus = (_req, res) => {
  return res.status(200).json({
    success: true,
    available: isContactConfigured(),
  });
};

const createSubmitContactHandler = (sendEmailFn = sendContactEmail) => async (req, res) => {
  const validation = validateContactPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error,
      errors: validation.errors,
    });
  }

  if (!isContactConfigured()) {
    return res.status(503).json({
      success: false,
      available: false,
      error: 'Online message delivery is currently unavailable because no support inbox is configured.',
    });
  }

  try {
    await sendEmailFn(validation.data);
    return res.status(200).json({
      success: true,
      message: 'Your message has been delivered.',
    });
  } catch (err) {
    const status = err?.statusCode === 503 ? 503 : 502;
    return res.status(status).json({
      success: false,
      error:
        status === 503
          ? 'Online message delivery is currently unavailable because no support inbox is configured.'
          : 'Unable to send your message right now. Please try again later.',
    });
  }
};

const submitContact = createSubmitContactHandler();

module.exports = {
  getContactStatus,
  createSubmitContactHandler,
  submitContact,
};

