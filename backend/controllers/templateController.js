const Template = require('../models/Template');
const { sendWhatsAppMessage } = require('../services/twilioService');

exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error('[DATABASE] getTemplates error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  console.log('[DATABASE] Creating template:', req.body.name);
  const template = new Template(req.body);
  try {
    const newTemplate = await template.save();
    console.log('[DATABASE] Success: Template ID', newTemplate._id);
    res.status(201).json(newTemplate);
  } catch (err) {
    console.error('[DATABASE] createTemplate error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.submitTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    
    template.status = 'Pending';
    await template.save();

    // Auto-approve simulator (Production-ready)
    setTimeout(async () => {
      try {
        const t = await Template.findById(template._id);
        if (t && t.status === 'Pending') {
          t.status = 'Approved'; 
          await t.save();
          console.log(`[APPROVAL] Template "${t.name}" automatically Approved`);
        }
      } catch (e) {
        console.error('[SIMULATOR] Error:', e.message);
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
  const finalVars = variables || vars || {};
  
  console.log(`[MESSAGE] Sending template ${templateId} to ${to}`);

  try {
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    
    if (template.status !== 'Approved') {
      return res.status(400).json({ message: `Status is ${template.status}. Needs 'Approved'.` });
    }

    let body = template.content;
    Object.keys(finalVars).forEach(key => {
      body = body.replace(`{{${key}}}`, finalVars[key]);
    });

    const result = await sendWhatsAppMessage(to, body);
    
    if (result.success) {
      res.json({ success: true, sid: result.messageId });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (err) {
    console.error('[MESSAGE] Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
