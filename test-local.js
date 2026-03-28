const axios = require('axios');

async function testSend() {
  try {
    console.log("Testing local send API...");
    const res = await axios.post('http://localhost:5000/api/templates/send', {
      templateId: '1',
      to: '+14155238886', // Twilio's own number, might fail if sandbox requires actual participant
      variables: { "1": "Test", "2": "Sandbox" }
    });
    console.log("Success! Status:", res.status);
    console.log("Data:", res.data);
  } catch (error) {
    console.error("Failed! Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
  }
}

testSend();
