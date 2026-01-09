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

router
  .route("/")
  .get(getSettings)
  .put(
    protect,
    admin,
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "gallery", maxCount: 10 },
    ]),
    updateSettings
  );

// Logo upload
router.post(
  "/upload-logo",
  protect,
  admin,
  upload.fields([{ name: "logo", maxCount: 1 }]),
  uploadLogo
);

// Gallery management
router.post(
  "/gallery",
  protect,
  admin,
  upload.fields([{ name: "gallery", maxCount: 10 }]),
  uploadGalleryImages
);

router.delete("/gallery/:publicId", protect, admin, deleteGalleryImage);

module.exports = router;
