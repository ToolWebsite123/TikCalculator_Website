const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { connectDB } = require('./utils/db');
const app = require('./app');  // ← Changed from const { app }

const maskKey = (key) => {
  if (!key) return 'MISSING';
  if (key.length <= 6) return `${key[0]}***`;
  return `${key.slice(0, 4)}***${key.slice(-2)}`;
};

// Print key TikTok scraper env values at startup
console.log('ENV → SCRAPER_USER_AGENT:', maskKey(process.env.SCRAPER_USER_AGENT || 'default'));
console.log('ENV → FRONTEND_URL:', process.env.FRONTEND_URL || 'MISSING');
console.log('ENV → PROXY_URL:', process.env.PROXY_URL ? 'SET' : 'NOT SET');
console.log('TikTok Scraper: Universal HTML scraper with Puppeteer fallback');
console.log('ℹ️  MongoDB disabled - running without database');

// Check if running on Vercel
if (process.env.VERCEL) {
  // Vercel serverless mode - just export the app
  console.log('✅ Running in Vercel serverless mode');
  module.exports = app;
} else {
  // Local development mode - start server normally
  const PORT = process.env.PORT || 5001;

  const start = async () => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.log('💡 Solution: Run this command to kill the process:');
        console.log(`   netstat -ano | findstr :${PORT}`);
        console.log('   taskkill /PID <PID_NUMBER> /F');
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  };

  start().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
}