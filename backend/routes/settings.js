// routes/settings.js - UPDATED
const express = require("express");
const {
  getSettings,
  updateSettings,
  deleteGalleryImage,
} = require("../controllers/settingController");
const router = express.Router();

const { protect, admin } = require("../middleware/auth");
const upload = require("../config/multer"); // This now returns the wrapper function

// GET settings
router.get("/", getSettings);

// UPDATE settings with file uploads
router.put(
  "/",
  protect,
  admin,
  upload([
    // Now using the wrapper function
    { name: "logo", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  updateSettings
);

// DELETE specific gallery image
// router.delete("/gallery/:publicId", protect, admin, deleteGalleryImage);

module.exports = router;
