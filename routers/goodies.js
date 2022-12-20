const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const goodiesController = require("../controllers/goodiesController");

router.post("/api/confirmOrder", auth, goodiesController.confirmOrder);

router.get("/api/checkOrder", auth, goodiesController.checkOrder);

module.exports = router;
