const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

const domainController = require("../controllers/domainController");

router.post("/api/domain", auth, domainController.addDomain);

router.get("/api/domains", auth, domainController.getDomains);

module.exports = router;
