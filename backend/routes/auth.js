const express = require('express');
const router = express.Router();

// Placeholder for Auth routes
router.post('/login', (req, res) => {
  res.json({ token: 'dummy-token', user: { name: 'Admin', role: 'admin' } });
});

module.exports = router;
