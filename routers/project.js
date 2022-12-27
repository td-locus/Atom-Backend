import express from "express";
import auth from "../middleware/auth.js";
import projectController from "../controllers/projectController.js";

const router = new express.Router();

router.post("/api/project", auth, projectController.createProject);

router.get("/api/project", auth, projectController.getProject);

export default router;
