const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mumoerick:Erick%402002mumo@cluster0.uwrcul4.mongodb.net/amplifyhopeafrica';

async function checkIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully!');

    const collection = mongoose.connection.collection('contents');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\n📋 All indexes:');
    indexes.forEach(idx => {
      console.log('  - Name:', idx.name);
      console.log('    Keys:', JSON.stringify(idx.key));
      console.log('    Unique:', idx.unique || false);
      console.log('    ---');
    });

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkIndexes();
