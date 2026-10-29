
const router = require("express").Router();
const controller = require("../controllers/resultController");
const { authenticate, authorize } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

router.use(authenticate);

router.get("/:studentId", asyncHandler(controller.list));
router.post("/", authorize("admin"), asyncHandler(controller.create));

module.exports = router;
