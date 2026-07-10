const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mumoerick:Erick%402002mumo@cluster0.uwrcul4.mongodb.net/amplifyhopeafrica';

async function dropCompoundIndex() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully!');

    const collection = mongoose.connection.collection('contents');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(idx => {
      console.log('  -', idx.name, ':', JSON.stringify(idx.key));
    });

    // Drop the compound index
    try {
      await collection.dropIndex('page_1_section_1');
      console.log('\n✅ Index "page_1_section_1" dropped successfully!');
    } catch (err) {
      console.log('\n⚠️ Index "page_1_section_1" not found or already dropped.');
    }

    // Show remaining indexes
    const remainingIndexes = await collection.indexes();
    console.log('\n📋 Remaining indexes:');
    remainingIndexes.forEach(idx => {
      console.log('  -', idx.name, ':', JSON.stringify(idx.key));
    });

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

dropCompoundIndex();
