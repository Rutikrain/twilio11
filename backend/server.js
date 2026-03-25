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

// APPROVE TEMPLATE
app.post("/api/templates/:id/approve", (req, res) => {
  const template = templates.find(t => t._id === req.params.id);
  if (!template) return res.status(404).json({ error: "Template not found" });
  template.status = "Approved";
  res.json(template);
});

// ✅ Send WhatsApp Message API (User's simplified route)
app.post("/api/send-message", async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `whatsapp:${to}`,
      body: message,
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Send WhatsApp Message API (Template-based)
app.post("/api/templates/send", async (req, res) => {
  const { templateId, to, variables } = req.body;

  const template = templates.find(t => t._id === templateId);

  if (!template) {
    return res.status(404).json({ error: "Template not found" });
  }

  if (template.status !== "Approved") {
    return res.status(400).json({ error: "Template not approved" });
  }

  // Handle template variables
  let messageBody = template.content;
  if (variables) {
    Object.keys(variables).forEach(key => {
      messageBody = messageBody.replace(`{{${key}}}`, variables[key]);
    });
  }

  try {
    const response = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `whatsapp:${to}`
    });

    res.json({ success: true, sid: response.sid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});