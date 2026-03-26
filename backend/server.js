const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const templateRoutes = require('./routes/templates');
app.use('/api/templates', templateRoutes);

// Generic Send Message route
app.post("/api/send-message", async (req, res) => {
  const { sendWhatsAppMessage } = require('./services/twilioService');
  const { to, message } = req.body;
  const result = await sendWhatsAppMessage(to, message);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

app.get("/", (req, res) => {
  res.send("Twilio SaaS Backend (File-based Persistence) Running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});