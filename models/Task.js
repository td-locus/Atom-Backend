const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  assignees: [
    {
      assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  assignor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
