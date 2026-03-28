const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplateById);
router.post('/', templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);
router.post('/:id/submit', templateController.submitTemplate);
router.post('/:id/approve', templateController.approveTemplate);
router.post('/:id/reject', templateController.rejectTemplate);
router.post('/send', templateController.sendMessage);

module.exports = router;
