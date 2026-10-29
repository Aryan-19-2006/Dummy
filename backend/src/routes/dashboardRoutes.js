
const router = require("express").Router();
const controller = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

router.get("/", authenticate, asyncHandler(controller.getDashboard));

module.exports = router;
