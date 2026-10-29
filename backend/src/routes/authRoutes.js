
const router = require("express").Router();
const auth = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

router.post("/register", asyncHandler(auth.register));
router.post("/login", asyncHandler(auth.login));
router.get("/me", authenticate, asyncHandler(auth.me));

module.exports = router;
