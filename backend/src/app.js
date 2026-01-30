const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const calculatorRoutes = require('./routes/calculatorRoutes');
const countryRoutes = require('./routes/countryRoutes');
const savedCalcRoutes = require('./routes/savedCalcRoutes');
const tiktokRoutes = require('./routes/tiktokRoutes');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow configured origins
    if (allowedOrigins.length && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow localhost and local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    const localPattern = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/;
    if (localPattern.test(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
// Rate limiting: 100 requests per minute per IP
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 100, // 100 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/api/v1/health' || req.path === '/api/tiktok/health';
    },
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Root route - Welcome message
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🎉 Welcome to Backend - Server is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      calculator: '/api/v1/calc',
      countries: '/api/v1/countries',
      tiktok: '/api/tiktok',
      savedCalculations: '/api/v1/saved-calcs'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/health', (_req, res) =>
  res.json({ status: 'ok', uptime: process.uptime() })
);

app.use('/api/v1/calc', calculatorRoutes);
app.use('/api/v1/countries', countryRoutes);
app.use('/api/v1', savedCalcRoutes);
// TikTok route available under both /api and /api/v1 for compatibility
app.use('/api', tiktokRoutes);
app.use('/api/v1', tiktokRoutes);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Server error' });
});

module.exports = { app };