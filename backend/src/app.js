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

// CORS Configuration - UPDATED
const allowedOrigins = [
  'https://tik-calculator-website.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

// Add environment variable origins
if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map(o => o.trim()).filter(Boolean);
  allowedOrigins.push(...envOrigins);
}

console.log('Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('CORS: Allowing origin:', origin);
      return callback(null, true);
    }
    
    // Allow localhost and local network IPs
    const localPattern = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/;
    if (localPattern.test(origin)) {
      console.log('CORS: Allowing local origin:', origin);
      return callback(null, true);
    }
    
    console.error('CORS: Blocking origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

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

module.exports = app;