const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

const auditController = require("../controllers/auditController");

router.post("/api/audit", auth, auditController.createAudit);

router.get("/api/audit", auth, auditController.getAudits);

module.exports = router;
