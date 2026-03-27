require('dotenv').config();
const { sendWhatsAppMessage } = require('./services/twilioService');

const testRecipient = process.argv[2] || '+91' + 'XXXXXXXXXX'; // Replace or pass via CLI

async function runTest() {
  console.log('🚀 Starting Twilio Message Test...');
  console.log('------------------------------------');
  
  const body = 'Hello! This is a test message from your Twilio SaaS Backend via Node.js.';
  
  const result = await sendWhatsAppMessage(testRecipient, body);
  
  console.log('------------------------------------');
  if (result.success) {
    console.log('✅ TEST PASSED!');
    console.log(`SID: ${result.messageId}`);
    if (result.simulated) {
      console.log('NOTE: This was a SIMULATED send (no real credits used).');
    } else {
      console.log('NOTE: This message was actually sent to Twilio!');
    }
  } else {
    console.log('❌ TEST FAILED!');
    console.log(`Error: ${result.error}`);
    console.log(`Code: ${result.code || 'N/A'}`);
  }
  process.exit(result.success ? 0 : 1);
}

if (testRecipient.includes('X')) {
  console.error('❌ Error: Please provide a phone number to test with.');
  console.log('Usage: node test-twilio.js +919876543210');
  process.exit(1);
}

runTest();
