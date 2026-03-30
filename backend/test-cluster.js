const mongoose = require('mongoose');

const urisToTest = [
  'mongodb+srv://LsfiCyXvG6P3Vv7G:Rrravindra11@cluster0.kc4agy.mongodb.net/sample_mflix?retryWrites=true&w=majority',
  'mongodb+srv://LsfiCyXvG6P3Vv7G:Rrravindra11@kc4agy.mongodb.net/sample_mflix?retryWrites=true&w=majority',
];

async function testUris() {
  for (const uri of urisToTest) {
    console.log(`Testing: ${uri}`);
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ SUCCESS with: ${uri}`);
      process.exit(0);
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
    }
  }
  console.log('All attempts failed.');
  process.exit(1);
}

testUris();
