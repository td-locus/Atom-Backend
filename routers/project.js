const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

const projectController = require("../controllers/projectController");

router.post("/api/project", auth, projectController.createProject);

router.get("/api/project", auth, projectController.getProject);

module.exports = router;
