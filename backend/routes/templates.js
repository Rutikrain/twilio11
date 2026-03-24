const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.get('/', templateController.getTemplates);
router.post('/', templateController.createTemplate);
router.post('/:id/submit', templateController.submitTemplate);
router.post('/send', templateController.sendMessage);

module.exports = router;
