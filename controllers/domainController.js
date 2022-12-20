const Domain = require("../models/Domain");

// @desc create domain
// @route POST /api/domain
// @access Private
exports.addDomain = async (req, res) => {
  try {
    req.body.lead = [req.user._id];
    const domain = new Domain(req.body);
    await domain.save();
    res.status(201).json();
  } catch (err) {
    res.status(400).json();
  }
};

// @desc get domains
// @route GET /api/domains
// @access Private
exports.getDomains = async (req, res) => {
  try {
    const domains = await Domain.find({}).lean().populate("lead", "name username avatar defaultAvatar");
    res.status(201).json(domains);
  } catch (err) {
    res.status(400).json();
  }
};
