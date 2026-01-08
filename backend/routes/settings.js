const express = require("express");
const {
  getSettings,
  updateSettings,
  uploadLogo,
  uploadGalleryImages,
  deleteGalleryImage,
} = require("../controllers/settingController");
const router = express.Router();

const { protect, admin } = require("../middleware/auth");
const upload = require("../config/multer");

router.route("/").get(getSettings).put(protect, admin, updateSettings);

// Logo upload
router.post("/upload-logo", protect, admin, upload.single("image"), uploadLogo);

// Gallery management
router
  .route("/gallery")
  .post(protect, admin, upload.array("images", 10), uploadGalleryImages);

router.delete("/gallery/:publicId", protect, admin, deleteGalleryImage);

module.exports = router;
