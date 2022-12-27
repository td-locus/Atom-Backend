import mongoose from "mongoose";

const goodiesSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  alternate: { type: String },
  type: {
    type: String,
  },
  badge: { type: String },
  address: {
    house: String,
    landmark: String,
    city: String,
    pincode: String,
    state: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Goodies = mongoose.model("Goodies", goodiesSchema);

export default Goodies;
