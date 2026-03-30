const express = require("express");
const router = express.Router();
const { createTemplate } = require("../controllers/templateController");

router.post("/", createTemplate);

module.exports = router;