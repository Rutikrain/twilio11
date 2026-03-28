const axios = require('axios');

async function testApi() {
  try {
    console.log("Testing Render API...");
    const res = await axios.post('https://twilio11-1.onrender.com/api/templates', {
      name: 'test_auto',
      content: 'This is a test from the node script'
    });
    console.log("Success! Status:", res.status);
    console.log("Data:", res.data);
  } catch (error) {
    console.error("Failed! Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
  }
}

testApi();
