const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Routes
const templateRoutes = require('./routes/templates');
app.use('/api/templates', templateRoutes);

// Additional specific routes (if needed to match project history)
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

// Hello route
app.get("/", (req, res) => {
  res.send("Twilio SaaS Backend Running");
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});