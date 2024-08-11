import express from "express";
import auth from "../middleware/auth.js";
import domainController from "../controllers/domainController.js";

const router = new express.Router();

router.post("/api/domain", auth, domainController.addDomain);

router.get("/api/domains", auth, domainController.getDomains);

export default router;
