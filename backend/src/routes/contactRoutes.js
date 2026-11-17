const express = require('express');
const rateLimit = require('express-rate-limit');
const { getContactStatus, submitContact } = require('../controllers/contactController');

const createContactRateLimiter = (maxRequests = 5, windowMs = 15 * 60 * 1000) =>
  rateLimit({
    windowMs,
    limit: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many contact submissions from this IP. Please try again later.',
    },
  });

const createContactRouter = ({ maxRequests = 5, windowMs = 15 * 60 * 1000 } = {}) => {
  const router = express.Router();
  router.get('/status', getContactStatus);
  router.post('/', createContactRateLimiter(maxRequests, windowMs), submitContact);
  return router;
};

module.exports = createContactRouter();
module.exports.createContactRouter = createContactRouter;
module.exports.createContactRateLimiter = createContactRateLimiter;

