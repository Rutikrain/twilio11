const Template = require('../models/Template');
const { sendWhatsAppMessage } = require('../services/twilioService');

exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  const template = new Template(req.body);
  try {
    const newTemplate = await template.save();
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.submitTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    
    template.status = 'Submitted';
    await template.save();

    // Simulated approval workflow
    setTimeout(async () => {
      // Pick randomly Approved or Rejected (80% approved)
      const isApproved = Math.random() > 0.2;
      template.status = isApproved ? 'Approved' : 'Rejected';
      await template.save();
      console.log(`[APPROVAL] Template "${template.name}" ${template.status}`);
    }, 15000);

    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { to, templateId, vars } = req.body;
  try {
    const template = await Template.findById(templateId);
    if (!template || template.status !== 'Approved') {
      return res.status(400).json({ message: 'Valid approved template required' });
    }

    let body = template.content;
    Object.keys(vars).forEach(num => {
      body = body.replace(`{{${num}}}`, vars[num]);
    });

    const result = await sendWhatsAppMessage(to, body);
    if (result.success) {
      res.json({ success: true, messageId: result.messageId });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
