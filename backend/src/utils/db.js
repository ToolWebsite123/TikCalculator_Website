const mongoose = require('mongoose');

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3; // 3 attempts as specified
const RETRY_DELAY = 5000; // 5 seconds

const connectDB = async (retry = false) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️  MONGO_URI missing in environment - MongoDB features disabled');
    console.warn('   To enable: Add MONGO_URI to your .env file');
    return false;
  }

  // Don't retry if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    connectionAttempts++;
    console.log(`[DB] Attempting MongoDB connection (attempt ${connectionAttempts}/${MAX_RETRIES})...`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
    });
    
    isConnected = true;
    connectionAttempts = 0;
    console.log('✅ MongoDB connected successfully');
    
    // Ensure ProfileCache collection exists
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const hasProfileCache = collections.some(c => c.name === 'profilecaches');
      if (!hasProfileCache) {
        console.log('[DB] Creating ProfileCache collection...');
        await mongoose.connection.db.createCollection('profilecaches');
        console.log('[DB] ✓ ProfileCache collection created');
      }
    } catch (collErr) {
      console.warn('[DB] Could not verify/create ProfileCache collection:', collErr.message);
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('   Error code:', err.code);
      console.error('   Error name:', err.name);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected - attempting to reconnect...');
      isConnected = false;
      // Attempt to reconnect after delay
      setTimeout(() => connectDB(true), RETRY_DELAY);
    });

    return true;
  } catch (err) {
    isConnected = false;
    
    // Show real error reason
    console.error(`❌ MongoDB connection failed (attempt ${connectionAttempts}/${MAX_RETRIES})`);
    console.error(`   Error: ${err.message}`);
    console.error(`   Error code: ${err.code || 'N/A'}`);
    console.error(`   Error name: ${err.name || 'N/A'}`);
    
    if (err.message.includes('authentication')) {
      console.error('   → Check your MongoDB username and password');
    } else if (err.message.includes('IP')) {
      console.error('   → Check your MongoDB Atlas IP whitelist');
    } else if (err.message.includes('timeout')) {
      console.error('   → Check your network connection and MongoDB server status');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('DNS')) {
      console.error('   → Check your MongoDB connection string (MONGO_URI)');
    }
    
    if (retry && connectionAttempts < MAX_RETRIES) {
      console.warn(`   Retrying in ${RETRY_DELAY/1000}s...`);
      setTimeout(() => connectDB(true), RETRY_DELAY);
      return false;
    } else if (!retry && connectionAttempts < MAX_RETRIES) {
      // First attempt failed - retry in background
      console.warn('   Will retry in background...');
      setTimeout(() => connectDB(true), RETRY_DELAY);
      return false;
    } else {
      // Max retries reached - stop server if this is critical
      console.error('❌ MongoDB connection failed after 3 attempts');
      console.error('   Server will continue without database. Caching disabled.');
      console.error('   To fix: Verify MONGO_URI in .env file and MongoDB server status.');
      return false;
    }
  }
};

// Check if MongoDB is available
const isMongoAvailable = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isMongoAvailable };

