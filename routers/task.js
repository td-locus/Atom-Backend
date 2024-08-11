import express from "express";
import auth from "../middleware/auth.js";
import taskController from "../controllers/taskController.js";

const router = express.Router();

router.post("/api/task", auth, taskController.createTask);

router.get("/api/tasks/assignor", auth, taskController.getTasksAssignor);

router.get("/api/tasks/assignee", auth, taskController.getTasksAssignee);

router.get("/api/task/edit", auth, taskController.getTask);

router.patch("/api/task/edit", auth, taskController.updateTask);

router.patch("/api/task/mark", auth, taskController.markTask);

router.delete("/api/task/delete", auth, taskController.deleteTask);

export default router;
