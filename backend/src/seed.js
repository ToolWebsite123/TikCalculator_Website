require('dotenv').config();
const bcrypt = require('bcryptjs');
const CountryCpm = require('./models/CountryCpm');
const AdminUser = require('./models/AdminUser');
const { connectDB } = require('./utils/db');

/**
 * Database Seeding Script
 * Seeds country CPM data and admin user
 * Run: node backend/src/utils/seed.js
 */

// Accurate TikTok CPM rates by country (based on market data 2024-2025)
const countryPresets = [
  // Tier 1 - Highest CPM
  { code: 'US', name: 'United States', defaultCpm: 8.0 },
  { code: 'GB', name: 'United Kingdom', defaultCpm: 7.5 },
  { code: 'CA', name: 'Canada', defaultCpm: 7.0 },
  { code: 'AU', name: 'Australia', defaultCpm: 7.0 },
  { code: 'CH', name: 'Switzerland', defaultCpm: 7.5 },
  { code: 'NO', name: 'Norway', defaultCpm: 7.0 },
  { code: 'SE', name: 'Sweden', defaultCpm: 6.5 },
  { code: 'DK', name: 'Denmark', defaultCpm: 6.5 },
  
  // Tier 2 - High CPM
  { code: 'DE', name: 'Germany', defaultCpm: 6.5 },
  { code: 'FR', name: 'France', defaultCpm: 6.0 },
  { code: 'NL', name: 'Netherlands', defaultCpm: 6.0 },
  { code: 'AT', name: 'Austria', defaultCpm: 6.0 },
  { code: 'BE', name: 'Belgium', defaultCpm: 5.5 },
  { code: 'IE', name: 'Ireland', defaultCpm: 6.0 },
  { code: 'FI', name: 'Finland', defaultCpm: 6.0 },
  { code: 'NZ', name: 'New Zealand', defaultCpm: 5.5 },
  
  // Tier 3 - Medium-High CPM
  { code: 'SG', name: 'Singapore', defaultCpm: 5.0 },
  { code: 'JP', name: 'Japan', defaultCpm: 5.5 },
  { code: 'KR', name: 'South Korea', defaultCpm: 5.0 },
  { code: 'AE', name: 'United Arab Emirates', defaultCpm: 5.5 },
  { code: 'SA', name: 'Saudi Arabia', defaultCpm: 5.0 },
  { code: 'IL', name: 'Israel', defaultCpm: 5.0 },
  { code: 'IT', name: 'Italy', defaultCpm: 5.0 },
  { code: 'ES', name: 'Spain', defaultCpm: 4.5 },
  
  // Tier 4 - Medium CPM
  { code: 'PT', name: 'Portugal', defaultCpm: 4.0 },
  { code: 'PL', name: 'Poland', defaultCpm: 3.5 },
  { code: 'CZ', name: 'Czech Republic', defaultCpm: 3.5 },
  { code: 'GR', name: 'Greece', defaultCpm: 3.5 },
  { code: 'TR', name: 'Turkey', defaultCpm: 3.0 },
  { code: 'MX', name: 'Mexico', defaultCpm: 3.5 },
  { code: 'BR', name: 'Brazil', defaultCpm: 3.0 },
  { code: 'AR', name: 'Argentina', defaultCpm: 2.5 },
  { code: 'CL', name: 'Chile', defaultCpm: 3.0 },
  { code: 'ZA', name: 'South Africa', defaultCpm: 3.0 },
  
  // Tier 5 - Lower CPM
  { code: 'MY', name: 'Malaysia', defaultCpm: 3.0 },
  { code: 'TH', name: 'Thailand', defaultCpm: 2.5 },
  { code: 'PH', name: 'Philippines', defaultCpm: 2.5 },
  { code: 'ID', name: 'Indonesia', defaultCpm: 2.0 },
  { code: 'VN', name: 'Vietnam', defaultCpm: 2.0 },
  { code: 'IN', name: 'India', defaultCpm: 1.5 },
  { code: 'PK', name: 'Pakistan', defaultCpm: 1.2 },
  { code: 'BD', name: 'Bangladesh', defaultCpm: 1.0 },
  { code: 'EG', name: 'Egypt', defaultCpm: 1.5 },
  { code: 'NG', name: 'Nigeria', defaultCpm: 1.5 },
  { code: 'KE', name: 'Kenya', defaultCpm: 1.5 },
  
  // Additional countries
  { code: 'RU', name: 'Russia', defaultCpm: 2.5 },
  { code: 'UA', name: 'Ukraine', defaultCpm: 2.0 },
  { code: 'CN', name: 'China', defaultCpm: 4.0 },
  { code: 'HK', name: 'Hong Kong', defaultCpm: 4.5 },
  { code: 'TW', name: 'Taiwan', defaultCpm: 4.0 },
  { code: 'CO', name: 'Colombia', defaultCpm: 2.5 },
  { code: 'PE', name: 'Peru', defaultCpm: 2.5 },
  { code: 'RO', name: 'Romania', defaultCpm: 3.0 },
  { code: 'HU', name: 'Hungary', defaultCpm: 3.0 },
  { code: 'QA', name: 'Qatar', defaultCpm: 5.0 },
  { code: 'KW', name: 'Kuwait', defaultCpm: 4.5 },
];

const seed = async () => {
  try {
    console.log('🚀 Starting database seed...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // ====== SEED COUNTRY CPM DATA ======
    console.log('📊 Seeding Country CPM data...');
    
    let countryCount = 0;
    for (const preset of countryPresets) {
      await CountryCpm.findOneAndUpdate(
        { code: preset.code },
        preset,
        { new: true, upsert: true }
      );
      countryCount++;
    }
    
    console.log(`✅ Seeded ${countryCount} countries with CPM rates\n`);

    // Display sample rates
    console.log('📈 Sample CPM Rates:');
    console.log('   🇺🇸 United States: $8.00');
    console.log('   🇬🇧 United Kingdom: $7.50');
    console.log('   🇨🇦 Canada: $7.00');
    console.log('   🇮🇳 India: $1.50');
    console.log('   🇵🇰 Pakistan: $1.20\n');

    // ====== SEED ADMIN USER ======
    console.log('👤 Seeding Admin User...');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tikcalculator.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    
    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    // Create or update admin
    const admin = await AdminUser.findOneAndUpdate(
      { email: adminEmail.toLowerCase() },
      { 
        email: adminEmail.toLowerCase(), 
        passwordHash,
        role: 'admin',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Admin user created/updated`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   ⚠️  Please change the default password after first login!\n`);

    // ====== COMPLETION ======
    console.log('🎉 Database seed completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Start your frontend: cd frontend && npm start');
    console.log('3. Test the calculator at http://localhost:5173\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed with error:', err);
    console.error('\nCommon issues:');
    console.error('- MongoDB not running (start with: mongod)');
    console.error('- Wrong MONGO_URI in .env file');
    console.error('- Missing dependencies (run: npm install)\n');
    process.exit(1);
  }
};

// Run seed
seed();