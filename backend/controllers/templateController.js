const fs = require('fs');
const path = require('path');
const { sendWhatsAppMessage } = require('../services/twilioService');

const DATA_FILE = path.join(__dirname, '../data/templates.json');

// Ensure data directory and file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

const getTemplatesFromFile = () => {
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveTemplatesToFile = (templates) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2));
};

exports.getTemplates = async (req, res) => {
  try {
    const templates = getTemplatesFromFile();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    console.log('Creating template (File-based):', req.body.name);
    const templates = getTemplatesFromFile();
    const newTemplate = {
      _id: String(Date.now()),
      ...req.body,
      status: 'Pending',
      createdAt: new Date()
    };
    templates.push(newTemplate);
    saveTemplatesToFile(templates);
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.submitTemplate = async (req, res) => {
  try {
    const templates = getTemplatesFromFile();
    const template = templates.find(t => t._id === req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    
    template.status = 'Pending';
    saveTemplatesToFile(templates);

    // Auto-approve simulator
    setTimeout(async () => {
      const ts = getTemplatesFromFile();
      const t = ts.find(x => x._id === template._id);
      if (t && t.status === 'Pending') {
        t.status = 'Approved';
        saveTemplatesToFile(ts);
        console.log(`[APPROVAL] Template "${t.name}" auto-approved in file.`);
      }
    }, 5000);

    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveTemplate = async (req, res) => {
  try {
    const templates = getTemplatesFromFile();
    const template = templates.find(t => t._id === req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    template.status = 'Approved';
    saveTemplatesToFile(templates);
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectTemplate = async (req, res) => {
  try {
    const templates = getTemplatesFromFile();
    const template = templates.find(t => t._id === req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    template.status = 'Rejected';
    saveTemplatesToFile(templates);
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { to, templateId, vars, variables } = req.body;
  const finalVars = variables || vars || {};

  try {
    const templates = getTemplatesFromFile();
    const template = templates.find(t => t._id === templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    
    if (template.status !== 'Approved') {
      return res.status(400).json({ message: `Template status is ${template.status}` });
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
    res.status(500).json({ message: err.message });
  }
};
