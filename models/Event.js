import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
    },
    eventLocation: {
      type: String,
      trim: true,
    },
    eventLink: {
      type: String,
      trim: true,
    },
    duration: {
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
    },
    meta: {
      isSharable: {
        type: Boolean,
        required: true,
      },
      isFree: {
        type: Boolean,
        required: true,
      },
      isInternal: {
        type: Boolean,
        required: true,
      },
      isWPS: {
        type: Boolean,
        required: true,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
