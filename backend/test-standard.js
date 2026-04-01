const mongoose = require('mongoose');

const uri = "mongodb+srv://LsfiCyXvG6P3Vv7G:Rrravindra11@cluster0.kc4agy.mongodb.net/sample_mflix?retryWrites=true&w=majority";

console.log('Testing standard cluster URI...');

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Standard Atlas URI Connected Successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Standard Atlas URI Failed!');
    console.error(`Error: ${err.message}`);
    console.error(`Code: ${err.code}`);
    process.exit(1);
  });
