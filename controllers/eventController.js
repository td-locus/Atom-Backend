import Event from "../models/Event.js";
import User from "../models/User.js";
import { mongooseObjectId } from "../utils/helpers/functions.js";
import { sendEventInviteMail } from "../utils/mail/index.js";
import { logErrorToSentry } from "../utils/sentry/index.js";

// @desc Create a new event
// @route POST /api/event
// @access Private

const createEvent = async (req, res) => {
  const event = new Event(req.body);
  event.owner = req.user._id;
  try {
    await event.save();
    // send mail to members
    const date = new Date();
    const type = `roles.${date.getFullYear()}`;
    let query = {};
    // if event is internal, send mail to all members (with roles other than registered) else, send mail to all members
    if (event.meta.isInternal) {
      query = {
        [type]: {
          $ne: "registered",
        },
      };
    }
    // if domain is not all, send mail to members of that domain
    if (event.domain !== "All") {
      query = {
        ...query,
        "domain.domainPrimary": event.domain,
      };
    }
    const emailList = await User.find(query).select("name email roles -_id");
    emailList.forEach((user) => {
      sendEventInviteMail(user.email, user.name, event);
    });
    res.status(201).json({ event });
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "createEvent",
    });
    res.status(400).json(err);
  }
};

// @desc get events
// @route GET /api/events
// @access Private
const fetchEvents = async (req, res) => {
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
    logErrorToSentry(err, {
      workflow: "fetchEvents",
    });
    res.status(400).json(err);
  }
};

// @desc get events by a user
// @route GET /api/events/me
// @access Private

const fetchEventsByMe = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user._id });
    res.status(200).json(events);
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "fetchEventsByMe",
    });
    res.status(400).json(err);
  }
};

// @desc edit an event
// @route GET /api/events/edit
// @access Private

const editEvent = async (req, res) => {
  try {
    const eventId = mongooseObjectId(req.query.eventId);
    const event = await Event.findById(eventId);
    res.status(200).json(event);
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "editEvent",
    });
    res.status(400).json(err);
  }
};

// @desc update an event
// @route PATCH /api/events/edit
// @access Private

const updateEvent = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(mongooseObjectId(req.body._id), { ...req.body });
    res.status(200).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "updateEvent",
    });
    res.status(400).json(err);
  }
};

// @desc delete an event
// @route DELETE /api/events/delete
// @access Private

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(mongooseObjectId(req.query.eventId));
    res.status(200).json();
  } catch (err) {
    logErrorToSentry(err, {
      workflow: "deleteEvent",
    });
    res.status(400).json(err);
  }
};

export default { createEvent, fetchEvents, fetchEventsByMe, editEvent, updateEvent, deleteEvent };
