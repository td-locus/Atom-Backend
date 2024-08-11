import express from "express";
import auth from "../middleware/auth.js";
import goodiesController from "../controllers/goodiesController.js";

const router = express.Router();

router.post("/api/confirmOrder", auth, goodiesController.confirmOrder);

router.get("/api/checkOrder", auth, goodiesController.checkOrder);

export default router;
