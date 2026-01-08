const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "webp", "png", "jpeg", "gif", "mp4", "pdf"],
    // Add transformation options if needed
    transformation: [
      { width: 1000, height: 1000, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/webp",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "video/mp4",
      "application/pdf",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images, videos, and PDFs are allowed."
        )
      );
    }
  },
});

module.exports = upload;
