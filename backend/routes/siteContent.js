const express = require("express");
const router = express.Router();
const {
  getSiteContent,
  updateHomePage,
  updateGallery,
  updateOffers,
  updateBlog,
  updateMediaLibrary,
  deleteMediaImage,
} = require("../controllers/siteContentController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../config/multer");

router.route("/").get(getSiteContent);

router.put(
  "/homepage",
  protect,
  admin,
  upload([{ name: "heroImage" }]),
  updateHomePage
);

router.put(
  "/gallery",
  protect,
  admin,
  upload([{ name: "galleryManagement" }]),
  updateGallery
);

router.put("/offers", protect, admin, updateOffers);

router.put("/blogs", protect, admin, updateBlog);

router.put(
  "/media-library",
  protect,
  admin,
  upload([{ name: "mediaLibrary" }]),
  updateMediaLibrary
);

router.delete("/media/:publicId", protect, admin, deleteMediaImage);

module.exports = router;
