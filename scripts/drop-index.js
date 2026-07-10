const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function dropIndex() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully!');

    const collection = mongoose.connection.collection('contents');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('📋 Current indexes:');
    indexes.forEach(idx => {
      console.log('  -', idx.name, ':', JSON.stringify(idx.key));
    });

    // Drop the page_1 index if it exists
    const pageIndex = indexes.find(idx => idx.name === 'page_1');
    if (pageIndex) {
      await collection.dropIndex('page_1');
      console.log('✅ Index "page_1" dropped successfully!');
    } else {
      console.log('⚠️ Index "page_1" not found. It may have already been dropped.');
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

dropIndex();
