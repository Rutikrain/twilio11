const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

console.log('🔍 Testing MongoDB Connection with URI:', mongoUri.split('@')[1] ? '...hidden password...@' + mongoUri.split('@')[1] : 'invalid host' );

async function testConnection() {
  try {
    console.log('⏳ Connecting to MongoDB (Timeout: 5s)...');
    await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    
    console.log('✅ Connected successfully!');
    
    // Check if it's an Atlas SQL endpoint
    if (mongoUri.includes('atlas-sql')) {
      console.log('⚠️  DETECTED: This is an Atlas SQL / Data Federation endpoint.');
      console.log('   Note: These endpoints are often READ-ONLY and will fail when creating templates.');
    }

    const Template = mongoose.model('ConnectionTest', new mongoose.Schema({ name: String }));
    
    console.log('⏳ Testing WRITE Capability (Timeout: 5s)...');
    const testDoc = new Template({ name: 'test_' + Date.now() });
    
    // Create a promise that rejects if timeout or fails
    const savePromise = testDoc.save();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation Timed Out (5s)')), 5000)
    );

    try {
      await Promise.race([savePromise, timeoutPromise]);
      console.log('✅ WRITE SUCCESSFUL!');
    } catch (err) {
      console.error('❌ WRITE FAILED:', err.message);
      if (err.message.includes('Timed Out') || err.message.includes('atlas-sql')) {
          console.log('\n💡 RECOMMENDATION: Use Local JSON storage by setting FORCE_JSON_STORAGE=true in your environment variables.');
      }
    }

  } catch (err) {
    console.error('❌ CONNECTION FAILED:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

testConnection();
