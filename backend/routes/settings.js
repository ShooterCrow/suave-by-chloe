const express = require("express");
const {
  getSettings,
  updateSettings,
  deleteGalleryImage,
} = require("../controllers/settingController");
const router = express.Router();

const { protect, admin } = require("../middleware/auth");
const upload = require("../config/multer");

// GET settings
router.get("/", getSettings);

// UPDATE settings with file uploads (matches controller exactly)
router.put(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  updateSettings
);

// DELETE specific gallery image
router.delete("/gallery/:publicId", protect, admin, deleteGalleryImage);

module.exports = router;

// const express = require("express");
// const {
//   getSettings,
//   updateSettings,
//   uploadLogo,
//   uploadGalleryImages,
//   deleteGalleryImage,
// } = require("../controllers/settingController");
// const router = express.Router();

// const { protect, admin } = require("../middleware/auth");
// const upload = require("../config/multer");

// // Main settings update (for text/data only - no file uploads)
// router.route("/").get(getSettings).put(protect, admin, updateSettings);

// // Logo management (matching blog controller pattern)
// router.post(
//   "/logo",
//   protect,
//   admin,
//   upload.single("logo"), // Changed to single upload like blog
//   uploadLogo
// );

// // Gallery management (multiple uploads like tasks)
// router.post(
//   "/gallery",
//   protect,
//   admin,
//   upload.array("gallery", 10), // Changed to array for multiple uploads
//   uploadGalleryImages
// );

// router.delete("/gallery/:publicId", protect, admin, deleteGalleryImage);

// module.exports = router;
