const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function test() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('📋 Cluster:', process.env.MONGODB_URI.match(/@([^\/]+)/)?.[1]);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Connected successfully to MongoDB Atlas!');
    console.log('📁 Database:', mongoose.connection.db.databaseName);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your password is correct');
    console.log('2. Check your cluster address is correct');
    console.log('3. Check IP whitelist in MongoDB Atlas');
    process.exit(1);
  }
}

test();
