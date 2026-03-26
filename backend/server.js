const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Required for Cloud Deployment)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

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
  res.send("Twilio SaaS Production Backend (v1.0) Running");
});

app.listen(PORT, () => {
  console.log(`🚀 Production server online on port ${PORT}`);
});