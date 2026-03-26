const Template = require('../models/Template');
const { sendWhatsAppMessage } = require('../services/twilioService');

exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error('getTemplates error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  console.log('Creating template:', req.body.name);
  const template = new Template(req.body);
  try {
    const newTemplate = await template.save();
    console.log('Template created with ID:', newTemplate._id);
    res.status(201).json(newTemplate);
  } catch (err) {
    console.error('createTemplate error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.submitTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    
    template.status = 'Pending';
    await template.save();

    // Simulated approval workflow
    setTimeout(async () => {
      try {
        const t = await Template.findById(template._id);
        if (t && t.status === 'Pending') {
          t.status = 'Approved'; // Always approve in this version for better UX
          await t.save();
          console.log(`[APPROVAL] Template "${t.name}" automatically Approved`);
        }
      } catch (e) {
        console.error('Simulator Error:', e.message);
      }
    }, 5000);

    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { to, templateId, vars, variables } = req.body;
  const finalVars = variables || vars || {}; // Handle both naming conventions
  
  console.log(`[CONTROLLER] Sending template ${templateId} to ${to}`);

  try {
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    
    if (template.status !== 'Approved') {
      return res.status(400).json({ message: `Template status is ${template.status}. Only Approved templates can be sent.` });
    }

    let body = template.content;
    Object.keys(finalVars).forEach(key => {
      body = body.replace(`{{${key}}}`, finalVars[key]);
    });

    console.log(`[CONTROLLER] Final body: ${body}`);
    const result = await sendWhatsAppMessage(to, body);
    
    if (result.success) {
      res.json({ success: true, sid: result.messageId, simulated: result.simulated });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (err) {
    console.error('sendMessage error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
