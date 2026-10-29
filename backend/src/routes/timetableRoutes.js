
const router = require("express").Router();
const controller = require("../controllers/timetableController");
const { authenticate, authorize } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

router.use(authenticate);

router.get("/", asyncHandler(controller.list));
router.post("/", authorize("admin"), asyncHandler(controller.create));

module.exports = router;
