require('dotenv').config();
const twilio = require('twilio');

let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN &&
    !process.env.TWILIO_ACCOUNT_SID.includes('your_')) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendWhatsAppMessage = async (to, body) => {
  // Clean the number: remove spaces
  let cleanTo = to.replace(/\s+/g, '');
  
  // Ensure it starts with + if it's not already prefixed with whatsapp:
  if (cleanTo.startsWith('whatsapp:')) {
    cleanTo = cleanTo.replace('whatsapp:', '');
  }
  
  if (!cleanTo.startsWith('+')) {
    // If it's a 10 digit number, assume +91 (common in this project's context)
    if (cleanTo.length === 10) {
      cleanTo = `+91${cleanTo}`;
    } else {
      cleanTo = `+${cleanTo}`;
    }
  }
  
  const formattedTo = `whatsapp:${cleanTo}`;
  const formattedFrom = process.env.TWILIO_PHONE_NUMBER.startsWith('whatsapp:') 
    ? process.env.TWILIO_PHONE_NUMBER 
    : `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;

  if (!client) {
    console.log('[TWILIO SIMULATE] Would send to:', formattedTo, '| Body:', body);
    return { success: true, messageId: 'sim_' + Date.now(), simulated: true };
  }

  try {
    console.log(`[TWILIO] Sending from ${formattedFrom} to ${formattedTo}`);
    const message = await client.messages.create({
      from: formattedFrom,
      to: formattedTo,
      body: body
    });
    console.log(`[TWILIO] Success. SID: ${message.sid}`);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('[TWILIO] Send Error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendWhatsAppMessage };
