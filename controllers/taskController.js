const Task = require("../models/Task");
const mongoose = require("mongoose");

// @desc convert string to mongoose objectID
const mongooseObjectId = (str) => mongoose.Types.ObjectId(str);

// @desc create a task
// @route POST /api/task
// @access Private

exports.createTask = async (req, res) => {
  try {
    const task = req.body;
    const assignees = task.assignees.map((assignee) => {
      return {
        assignee: mongooseObjectId(assignee),
        completed: false,
      };
    });
    task.assignees = assignees;
    task.assignor = req.user._id;
    const task_ = new Task(task);
    await task_.save();
    res.status(201).json();
  } catch (err) {
    res.status(400).json();
  }
};

// @desc view tasks - assignor
// @route GET /api/tasks/assignor
// @access Private

exports.getTasksAssignor = async (req, res) => {
  try {
    const tasks = await Task.find({ assignor: req.user._id });
    res.status(201).json(tasks);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc view tasks - assignor
// @route GET /api/tasks/assignee
// @access Private

exports.getTasksAssignee = async (req, res) => {
  try {
    const config = { assignee: req.user._id };
    if (req.query.completed) {
      config.completed = req.query.completed;
    }
    const tasks = await Task.find({ assignees: { $elemMatch: config } })
      .sort({ dueDate: -1 })
      .populate("assignor", "name username avatar defaultAvatar");
    res.status(201).json({ tasks, user: req.user._id });
  } catch (err) {
    res.status(400).json();
  }
};

// @desc mark task as completed/incomplete
// @route PATCH /api/task/mark
// @access Private

exports.markTask = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), { ...req.body });
    res.status(200).json();
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc view task
// @route GET /api/task/edit
// @access Private

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.query.taskId);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc update task
// @route PATCH /api/task/edit
// @access Private

exports.updateTask = async (req, res) => {
  try {
    const task = req.body;
    const assignees = task.assignees.map((assignee) => {
      return {
        assignee: mongooseObjectId(assignee),
        completed: false,
      };
    });
    task.assignees = assignees;
    task.assignor = req.user._id;
    await Task.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), task);
    res.status(201).json();
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc delete a task
// @route DELETE /api/task/delete
// @access Private

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(mongoose.Types.ObjectId(req.query.taskId));
    res.status(200).json();
  } catch (err) {
    res.status(400).json(err);
  }
};
