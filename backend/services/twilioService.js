require('dotenv').config();
const twilio = require('twilio');

let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN &&
    !process.env.TWILIO_ACCOUNT_SID.includes('your_')) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendWhatsAppMessage = async (to, body) => {
  if (!client) {
    console.log('[TWILIO SIMULATE] Would send to:', to, '| Body:', body);
    return { success: true, messageId: 'sim_' + Date.now() };
  }
  try {
    const message = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`,
      body: body
    });
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Twilio Send Error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendWhatsAppMessage };
