import express from "express";
import auth from "../middleware/auth.js";
import eventController from "../controllers/eventController.js";

const router = new express.Router();

router.post("/api/event", auth, eventController.createEvent);

router.get("/api/events", auth, eventController.fetchEvents);

router.get("/api/events/me", auth, eventController.fetchEventsByMe);

router.get("/api/events/edit", auth, eventController.editEvent);

router.patch("/api/events/edit", auth, eventController.updateEvent);

router.delete("/api/events/delete", auth, eventController.deleteEvent);

export default router;
