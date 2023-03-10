const Audit = require("../models/Audit");

exports.createAudit = async (req, res) => {
  const audit = new Audit(req.body);
  audit.user = req.user._id;
  try {
    await audit.save();
    res.status(200).json({ audit });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getAudits = async (req, res) => {
  const audits = await Audit.find({ user: req.user._id });
  res.status(200).json(audits);
};
