const express = require("express");
const {
  getAllRooms,
  getRoomById,
  getFeaturedRooms,
  getRoomCategories,
  checkRoomAvailability,
  getAllRoomsAdmin,
  createRoom,
  updateRoom,
  deleteRoom,
  uploadRoomImages,
  updateRoomImage,
  deleteRoomImage,
  toggleRoomStatus,
  toggleFeaturedStatus,
  getRoomStats,
  bulkUpdateRooms,
} = require("../controllers/roomController");

const upload = require("../config/multer");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Public Routes
router.get("/", getAllRooms);
router.get("/featured", getFeaturedRooms);
router.get("/categories", getRoomCategories);
router.get("/:id/availability", checkRoomAvailability);
router.get("/:identifier", getRoomById); // Matches ID or slug

// Admin Routes (Should be protected)
router.get("/admin/all", protect, admin, getAllRoomsAdmin);
router.get("/admin/:id/stats", protect, admin, getRoomStats);
router.post("/", createRoom);
router.put("/:id", protect, admin, updateRoom);
router.delete("/:id", protect, admin, deleteRoom);
router.patch("/bulk-update", protect, admin, bulkUpdateRooms);
router.patch("/:id/toggle-status", protect, admin, toggleRoomStatus);
router.patch("/:id/toggle-featured", protect, admin, toggleFeaturedStatus);

// Image Routes
router.post(
  "/:id/images",
  protect,
  admin,
  upload.array("images", 10),
  uploadRoomImages
);
router.put("/:id/images/:imageId", protect, admin, updateRoomImage);
router.delete("/:id/images/:imageId", protect, admin, deleteRoomImage);

module.exports = router;
