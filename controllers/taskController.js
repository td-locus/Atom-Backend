import Task from "../models/Task.js";
import User from "../models/User.js";
import { sendTaskReminderMail } from "../utils/mail/index.js";
import { logErrorToSentry } from "../utils/sentry/index.js";
import { mongooseObjectId } from "../utils/helpers/functions.js";

// @desc create a task
// @route POST /api/task
// @access Private

const createTask = async (req, res) => {
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
    // send mail to assignees
    const assigneesArray = task.assignees.map((assignee) => assignee.assignee);
    const assigneesEmailList = await User.find({ _id: { $in: assigneesArray } }).select("email name -_id");
    const assignorName = await User.findById(req.user._id).select("name -_id");
    assigneesEmailList.forEach((assignee) => {
      sendTaskReminderMail(assignee.email, assignee.name, {
        ...task,
        assignor: assignorName.name,
      });
    });
    res.status(201).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "createTask",
    });
    res.status(400).json(err);
  }
};

// @desc view tasks - assignor
// @route GET /api/tasks/assignor
// @access Private

const getTasksAssignor = async (req, res) => {
  try {
    const tasks = await Task.find({ assignor: req.user._id });
    res.status(201).json(tasks);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc view task - assignor
// @route GET /api/task/edit
// @access Private

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.query.taskId).populate("assignees.assignee", "name email -_id");
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json();
  }
};

// @desc update task - assignor
// @route PATCH /api/task/edit
// @access Private

const updateTask = async (req, res) => {
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
    await Task.findByIdAndUpdate(mongooseObjectId(req.body._id), task);
    const task_ = await Task.findById(mongooseObjectId(req.body._id)).populate("assignees.assignee", "name email -_id");
    res.status(201).json(task_);
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc delete a task - assignor
// @route DELETE /api/task/delete
// @access Private

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(mongooseObjectId(req.query.taskId));
    res.status(200).json();
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc view tasks - assignee
// @route GET /api/tasks/assignee
// @access Private

const getTasksAssignee = async (req, res) => {
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

// @desc mark task as completed/incomplete - assignee
// @route PATCH /api/task/mark
// @access Private

const markTask = async (req, res) => {
  try {
    const body = { ...req.body };
    body.assignees = body.assignees.map((assignee) => {
      if (assignee.assignee === req.user._id.toString() && body.completed) {
        return {
          ...assignee,
          completed_at: new Date(),
        };
      }
      return assignee;
    });

    await Task.findByIdAndUpdate(mongooseObjectId(req.body._id), body);
    res.status(200).json();
  } catch (err) {
    res.status(400).json(err);
  }
};

export default { createTask, getTasksAssignor, getTasksAssignee, markTask, getTask, updateTask, deleteTask };
