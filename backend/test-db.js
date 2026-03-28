const mongoose = require('mongoose');

const uri = 'mongodb://LsfiCyXvG6P3Vv7G:Rrravindra11@atlas-sql-69c5134e12156ad335348c9f-kc4agy.a.query.mongodb.net/twilio-saas?ssl=true&authSource=admin';

console.log('Attempting to connect with standard mongoose options...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ Connection Successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  });
