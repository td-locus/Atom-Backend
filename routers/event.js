const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

const eventController = require("../controllers/eventController");

router.post("/api/event", auth, eventController.createEvent);

router.get("/api/events", auth, eventController.fetchEvents);

router.get("/api/events/me", auth, eventController.fetchEventsByMe);

router.get("/api/events/edit", auth, eventController.editEvent);

router.patch("/api/events/edit", auth, eventController.updateEvent);

router.delete("/api/events/delete", auth, eventController.deleteEvent);

module.exports = router;
