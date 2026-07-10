const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

console.log('📁 Current directory:', __dirname);
console.log('📁 .env.local path:', path.join(__dirname, '../.env.local'));

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('📋 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in .env.local');
      console.log('Please check:');
      console.log('1. .env.local file exists in the project root');
      console.log('2. MONGODB_URI is defined in .env.local');
      console.log('3. The path to .env.local is correct');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully!');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { username: 'admin' },
        { email: 'admin@amplifyhopeafrica.org' }
      ]
    });
    
    if (existingAdmin) {
  
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Current Admin Details:');
      console.log('   Username:', existingAdmin.username);
      console.log('   Email:', existingAdmin.email);
      console.log('   Name:', existingAdmin.name);
      console.log('   Role:', existingAdmin.role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      process.exit(0);
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash('Admin@123!', 10);
    await User.create({
      username: 'admin',
      email: 'admin@amplifyhopeafrica.org',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPlease check:');
    console.log('1. MONGODB_URI is set correctly in .env.local');
    console.log('2. Your MongoDB Atlas IP whitelist allows access');
    console.log('3. Password is URL-encoded (special characters like @ = %40)');
    process.exit(1);
  }
}

createAdmin();
