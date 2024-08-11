import mongoose from "mongoose";

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
      completed_at: {
        type: Date,
        default: null,
      },
    },
  ],
  assignor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
