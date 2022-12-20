const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
  },
  log: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Audit = mongoose.model("Audit", auditSchema);
module.exports = Audit;
