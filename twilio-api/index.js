const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let templates = [
  { _id: "1", name: "welcome_template", category: "Marketing", content: "Hello {{1}}, welcome to {{2}}!", status: "Approved", language: "en-US", createdAt: new Date(), buttons: [{ type: 'URL', text: 'Visit Website', value: 'https://example.com' }] },
  { _id: "2", name: "order_update", category: "Utility", content: "Hi {{1}}, your order #{{2}} has been shipped.", status: "Pending", language: "en-US", createdAt: new Date(), buttons: [{ type: 'PHONE_NUMBER', text: 'Call Support', value: '+1234567890' }] },
  { _id: "3", name: "me", category: "Marketing", content: "Hi, this is me!", status: "Approved", language: "en-US", createdAt: new Date(), buttons: [] },
];

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running");
});

// GET ALL TEMPLATES
app.get("/api/templates", (req, res) => {
  res.json(templates);
});

// CREATE TEMPLATE
app.post("/api/templates", (req, res) => {
  const { name, content, category, language, buttons } = req.body;
  console.log(`Creating template: ${name}`);

  const newTemplate = {
    _id: String(Date.now()),
    name,
    content,
    category: category || "Marketing",
    language: language || "en-US",
    buttons: buttons || [],
    status: "Pending",
    createdAt: new Date(),
  };

  templates.push(newTemplate);
  console.log(`Template created successfully: ${name}`);
  res.json(newTemplate);
});

// SUBMIT TEMPLATE (for status change)
app.post("/api/templates/:id/submit", (req, res) => {
  const template = templates.find(t => t._id === req.params.id);
  if (!template) return res.status(404).json({ error: "Template not found" });
  template.status = "Pending";
  res.json(template);
});

// APPROVE TEMPLATE
app.post("/api/templates/:id/approve", (req, res) => {
  const template = templates.find(t => t._id === req.params.id);
  if (!template) return res.status(404).json({ error: "Template not found" });
  template.status = "Approved";
  res.json(template);
});

// ✅ Send WhatsApp Message API (User's simplified route)
app.post("/api/send-message", async (req, res) => {
  let { to, message } = req.body;
  console.log(`Original 'to': ${to}`);
  
  // Clean the number: remove spaces
  to = to.replace(/\s+/g, '');
  
  // Ensure it starts with + if it's not already prefixed with whatsapp:
  let cleanTo = to.startsWith('whatsapp:') ? to.replace('whatsapp:', '') : to;
  if (!cleanTo.startsWith('+')) {
    // If it's a 10 digit number, assume +91 (common in this project's context)
    if (cleanTo.length === 10) {
      cleanTo = `+91${cleanTo}`;
    } else {
      cleanTo = `+${cleanTo}`;
    }
  }
  
  const formattedTo = `whatsapp:${cleanTo}`;
  
  console.log(`Sending simple message to ${formattedTo}: ${message}`);

  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedTo,
      body: message,
    });
    console.log(`Message sent! SID: ${response.sid}`);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Send WhatsApp Message API (Template-based)
app.post("/api/templates/send", async (req, res) => {
  let { templateId, to, variables } = req.body;
  console.log(`Original 'to': ${to}, ID: ${templateId}`);

  const template = templates.find(t => t._id === templateId);

  if (!template) {
    console.log(`Template not found: ${templateId}`);
    return res.status(404).json({ error: "Template not found" });
  }

  if (template.status !== "Approved") {
    console.log(`Template not approved: ${templateId}`);
    return res.status(400).json({ error: "Template not approved" });
  }

  // Handle template variables
  let messageBody = template.content;
  if (variables) {
    Object.keys(variables).forEach(key => {
      messageBody = messageBody.replace(`{{${key}}}`, variables[key]);
    });
  }
  
  console.log(`Final message body: ${messageBody}`);

  // Clean the number: remove spaces
  to = to.replace(/\s+/g, '');
  
  // Ensure it starts with + if it's not already prefixed with whatsapp:
  let cleanTo = to.startsWith('whatsapp:') ? to.replace('whatsapp:', '') : to;
  if (!cleanTo.startsWith('+')) {
    // If it's a 10 digit number, assume +91 (common in this project's context)
    if (cleanTo.length === 10) {
      cleanTo = `+91${cleanTo}`;
    } else {
      cleanTo = `+${cleanTo}`;
    }
  }
  
  const formattedTo = `whatsapp:${cleanTo}`;
  
  console.log(`Final 'to' for Twilio: ${formattedTo}`);

  try {
    const response = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedTo
    });

    console.log(`Template message sent! SID: ${response.sid}`);
    res.json({ success: true, sid: response.sid });
  } catch (err) {
    console.error(`Error sending template message: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
