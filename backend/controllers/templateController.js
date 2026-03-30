const Template = require("../models/Template");

exports.createTemplate = async (req, res) => {
  console.log("[API HIT] Body:", req.body);

  try {
    const template = new Template(req.body);
    const saved = await template.save();

    console.log("[DB SUCCESS]", saved._id);
    res.status(201).json(saved);

  } catch (err) {
    console.error("[DB ERROR]", err.message);
    res.status(400).json({ message: err.message });
  }
};