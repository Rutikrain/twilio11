require('dotenv').config();
const twilio = require('twilio');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;

if (TWILIO_SID && TWILIO_AUTH && !TWILIO_SID.includes('your_')) {
  client = twilio(TWILIO_SID, TWILIO_AUTH);
  console.log('✅ Twilio Client Initialized');
} else {
  console.warn('⚠️ Twilio Credentials missing or invalid. Running in SIMULATION mode.');
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
    console.log(`[TWILIO] Attempting to send from ${formattedFrom} to ${formattedTo}...`);
    const message = await client.messages.create({
      from: formattedFrom,
      to: formattedTo,
      body: body
    });
    console.log(`✅ [TWILIO] Success! Message SID: ${message.sid}`);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('❌ [TWILIO] Send Error:');
    console.error(`   - Code: ${error.code || 'Unknown'}`);
    console.error(`   - Message: ${error.message}`);
    
    // Fallback for Authentication issues (Code 20003 or similar)
    if (error.code === 20003 || error.message.toLowerCase().includes('authenticate')) {
      console.warn('⚠️ [TWILIO FALLBACK] Authentication failed. Falling back to SIMULATION mode for this request.');
      return { 
        success: true, 
        messageId: 'sim_auth_fallback_' + Date.now(), 
        simulated: true,
        warning: 'Twilio Authentication failed; message simulated.' 
      };
    }

    console.error(`   - More Info: ${error.moreInfo || 'N/A'}`);
    return { success: false, error: error.message, code: error.code };
  }
};

module.exports = { sendWhatsAppMessage };
