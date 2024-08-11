import express from "express";
import auth from "../middleware/auth.js";
import auditController from "../controllers/auditController.js";

const router = new express.Router();

router.post("/api/audit", auth, auditController.createAudit);

router.get("/api/audit", auth, auditController.getAudits);

export default router;
