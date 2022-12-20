const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    lead: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    meta: {
      isOpenSource: {
        type: Boolean,
      },
      isInternal: {
        type: Boolean,
      },
      isPaid: {
        type: Boolean,
      },
    },
    clients: [String],
    startDateTime: {
      type: Date,
    },
    endDateTime: {
      type: Date,
    },
    modules: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        deadline: {
          type: Date,
        },
        assignee: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        tasks: [
          {
            text: {
              type: String,
            },
            deadline: {
              type: Date,
            },
            assignee: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            ],
          },
        ],
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
