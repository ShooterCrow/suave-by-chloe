const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
} = require("../controllers/userController");
const { protect, authorize, admin } = require("../middleware/auth");

// All routes are protected
router.use(protect);

router.get("/profile", getMe);

router.route("/").get(authorize("manager", "admin"), getUsers);

router
  .route("/:id")
  .get(authorize("manager", "admin"), getUserById)
  .patch(admin, updateUser)
  .delete(admin, deleteUser);

module.exports = router;
