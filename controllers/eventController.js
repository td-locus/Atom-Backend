const Event = require("../models/Event");
const mongoose = require("mongoose");

// @desc Create a new event
// @route POST /api/event
// @access Private
exports.createEvent = async (req, res) => {
  const event = new Event(req.body);
  event.owner = req.user._id;
  try {
    await event.save();
    res.status(201).json({ event });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc get events
// @route GET /api/events
// @access Private
exports.fetchEvents = async (req, res) => {
  try {
    let sort = {};
    const order = req.query.order === "asc" ? -1 : 1;
    switch (req.query?.sort) {
      case "default":
        sort = { createdAt: order };
        break;
      case "start":
        sort = { "duration.from": order };
        break;
      default:
        sort = {};
        break;
    }
    let config = {};
    if (req.query.dateRange === "upcoming") {
      config = {
        "duration.from": {
          $gt: new Date(),
        },
      };
    }
    const role = await req.user.checkRole();
    if (role === "registered") {
      config = {
        ...config,
        "meta.isInternal": false,
      };
    }
    if (req.query.type !== "all") {
      config = {
        ...config,
        "meta.isInternal": req.query.type === "internal" ? true : false,
      };
    }
    const events = await Event.find(config)
      .sort(sort)
      .limit(Number(req.query.limit) || null)
      .populate("owner");

    res.status(200).json(events);
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc get events by a user
// @route GET /api/events/me
// @access Private

exports.fetchEventsByMe = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user._id });
    res.status(200).json(events);
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc edit an event
// @route GET /api/events/edit
// @access Private

exports.editEvent = async (req, res) => {
  try {
    const eventId = mongoose.Types.ObjectId(req.query.eventId);
    const event = await Event.findById(eventId);
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc update an event
// @route PATCH /api/events/edit
// @access Private

exports.updateEvent = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), { ...req.body });
    res.status(200).json();
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc delete an event
// @route DELETE /api/events/delete
// @access Private

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(mongoose.Types.ObjectId(req.query.eventId));
    res.status(200).json();
  } catch (err) {
    res.status(400).json(err);
  }
};
