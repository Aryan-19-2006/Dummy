
const router = require("express").Router();
const controller = require("../controllers/studentController");
const { authenticate, authorize } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

router.use(authenticate);

router.get("/", authorize("admin"), asyncHandler(controller.list));
router.get("/:id", asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    const [rows] = await require("../config/db").execute(
      "SELECT id FROM students WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (!rows.length) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
  }

  return controller.getOne(req, res, next);
}));

router.post("/", authorize("admin"), asyncHandler(controller.create));
router.put("/:id", authorize("admin"), asyncHandler(controller.update));
router.delete("/:id", authorize("admin"), asyncHandler(controller.remove));

module.exports = router;
