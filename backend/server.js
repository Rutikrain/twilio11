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
  { _id: "1", name: "welcome_template", category: "Marketing", content: "Hello {{1}}, welcome to {{2}}!", status: "Approved", language: "en-US", createdAt: new Date() },
  { _id: "2", name: "order_update", category: "Utility", content: "Hi {{1}}, your order #{{2}} has been shipped.", status: "Pending", language: "en-US", createdAt: new Date() },
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
app.post("/api/templates/create", (req, res) => {
  const { name, content, category, language } = req.body;

  const newTemplate = {
    _id: String(Date.now()),
    name,
    content,
    category: category || "Marketing",
    language: language || "en-US",
    status: "Approved",
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

app.post("/api/templates/send", async (req, res) => {
  const { templateId, to } = req.body;

  const template = templates.find(t => t._id === templateId);

  if (!template) {
    return res.status(404).json({ error: "Template not found" });
  }

  if (template.status !== "Approved") {
    return res.status(400).json({ error: "Template not approved" });
  }

  try {
    const message = await client.messages.create({
      body: template.content,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${to}`
    });

    res.json({ success: true, sid: message.sid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));