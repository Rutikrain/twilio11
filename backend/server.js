require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// MongoDB Connection (Diagnostics Enhanced)
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ CRITICAL: MONGO_URI is not defined in environment variables!');
}

mongoose.connect(mongoUri, { 
  serverSelectionTimeoutMS: 5000 // Timeout faster (5s) for better diagnostics
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error Details:');
    console.error(`   - Message: ${err.message}`);
    console.error(`   - Code: ${err.code}`);
    console.log('⚠️ WARNING: Falling back to local JSON storage (data/templates.json)');
  });

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    readyState: mongoose.connection.readyState,
    mongodb_uri_set: !!process.env.MONGO_URI
  });
});

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