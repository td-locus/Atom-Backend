import Goodies from "../models/Goodies.js";

// @desc confirm order
// @route GET /api/confirmOrder
// @access Private
const confirmOrder = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const order = new Goodies(req.body);
    order.save();
    res.status(201).json();
  } catch (err) {
    res.status(400).json();
  }
};

// @desc confirm order
// @route GET /api/confirmOrder
// @access Private
const checkOrder = async (req, res) => {
  try {
    const check = await Goodies.find({ user: req.user._id, type: "home" });
    if (check.length) throw new Error();
    res.status(200).json();
  } catch (err) {
    res.status(400).json();
  }
};

export default { confirmOrder, checkOrder };
