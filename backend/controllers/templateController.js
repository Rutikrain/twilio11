const fs = require('fs');
const path = require('path');
const Template = require('../models/Template');
const { sendWhatsAppMessage } = require('../services/twilioService');
const mongoose = require('mongoose');

const DB_PATH = path.join(__dirname, '../data/templates.json');

const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, '[]');
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const useFallback = () => {
  // Force JSON if environment variable set or if DB is disconnected
  if (process.env.FORCE_JSON_STORAGE === 'true') return true;
  if (mongoose.connection.readyState !== 1) return true;
  // Fallback if URI looks like Atlas SQL (highly recommended as standard writes fail)
  if (process.env.MONGO_URI && process.env.MONGO_URI.includes('atlas-sql')) return true;
  return false;
};

exports.getTemplates = async (req, res) => {
  if (useFallback()) {
    console.log('📂 [JSON DB] Fetching all templates from local storage');
    const data = readDB();
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(data);
  }

  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTemplateById = async (req, res) => {
  if (useFallback()) {
    const data = readDB();
    const template = data.find(t => t._id === req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    return res.json(template);
  }

  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  if (useFallback()) {
    console.log('[JSON DB] Creating template:', req.body.name);
    const data = readDB();
    const newTemplate = {
      ...req.body,
      _id: Date.now().toString(),
      status: req.body.status || 'Pending',
      createdAt: new Date().toISOString()
    };
    data.push(newTemplate);
    writeDB(data);
    return res.status(201).json(newTemplate);
  }

  console.log('[DATABASE] Creating template:', req.body.name);
  const template = new Template(req.body);
  try {
    // Add a race against timeout to prevent long hangs in production
    const savePromise = template.save();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database operation timed out. Please try setting FORCE_JSON_STORAGE=true.')), 8000)
    );

    const newTemplate = await Promise.race([savePromise, timeoutPromise]);
    res.status(201).json(newTemplate);
  } catch (err) {
    console.error('❌ Template Creation Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.submitTemplate = async (req, res) => {
  if (useFallback()) {
    const data = readDB();
    const idx = data.findIndex(t => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Template not found' });
    
    data[idx].status = 'Pending';
    writeDB(data);

    // Auto-approve simulator
    setTimeout(() => {
      const d = readDB();
      const i = d.findIndex(t => t._id === req.params.id);
      if (i !== -1 && d[i].status === 'Pending') {
        d[i].status = 'Approved';
        writeDB(d);
        console.log(`[APPROVAL] Template automatically Approved via JSON`);
      }
    }, 5000);

    return res.json(data[idx]);
  }

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
        }
      } catch (e) { }
    }, 5000);

    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveTemplate = async (req, res) => {
  if (useFallback()) {
    const data = readDB();
    const idx = data.findIndex(t => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Template not found' });
    data[idx].status = 'Approved';
    writeDB(data);
    return res.json(data[idx]);
  }

  try {
    const template = await Template.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectTemplate = async (req, res) => {
  if (useFallback()) {
    const data = readDB();
    const idx = data.findIndex(t => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Template not found' });
    data[idx].status = 'Rejected';
    writeDB(data);
    return res.json(data[idx]);
  }

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
  
  if (useFallback()) {
    const data = readDB();
    const template = data.find(t => t._id === templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    if (template.status !== 'Approved') {
      return res.status(400).json({ message: `Status is ${template.status}. Needs 'Approved'.` });
    }

    let body = template.content;
    Object.keys(finalVars).forEach(key => {
      body = body.replace(`{{${key}}}`, finalVars[key]);
    });

    const result = await sendWhatsAppMessage(to, body);
    if (result.success) return res.json({ success: true, sid: result.messageId });
    return res.status(500).json({ success: false, error: result.error });
  }

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
    if (result.success) res.json({ success: true, sid: result.messageId });
    else res.status(500).json({ success: false, error: result.error });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  if (useFallback()) {
    const data = readDB();
    const idx = data.findIndex(t => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Template not found' });
    data[idx] = { ...data[idx], ...req.body, _id: data[idx]._id };
    writeDB(data);
    return res.json(data[idx]);
  }

  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  if (useFallback()) {
    let data = readDB();
    const idx = data.findIndex(t => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Template not found' });
    data.splice(idx, 1);
    writeDB(data);
    return res.json({ message: 'Template deleted' });
  }

  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};