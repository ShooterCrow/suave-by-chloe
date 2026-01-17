// config/multer.js - UPDATED VERSION
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

console.log("=== MULTER INITIALIZATION ===");

// Test Cloudinary connection
try {
  cloudinary.api
    .ping()
    .then((result) => console.log("✓ Cloudinary connection successful"))
    .catch((err) => {
      console.error("✗ Cloudinary connection failed:", err.message);
      console.error("Check your CLOUDINARY environment variables:");
      console.error(
        "CLOUDINARY_CLOUD_NAME:",
        process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "NOT SET"
      );
      console.error(
        "CLOUDINARY_API_KEY:",
        process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET"
      );
      console.error(
        "CLOUDINARY_API_SECRET:",
        process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET"
      );
    });
} catch (err) {
  console.error("Cloudinary configuration error:", err.message);
}

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "uploads",
//     allowed_formats: ["jpg", "webp", "png", "jpeg", "gif", "mp4", "pdf", "avif"],
//     resource_type: "auto", // IMPORTANT: This allows auto-detection of image/video
//     // Add transformation options if needed
//     transformation: [
//       { width: 1000, height: 1000, crop: "limit" },
//       { quality: "auto" },
//       { fetch_format: "auto" },
//     ],
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === "logo") {
      return {
        folder: "branding",
        public_id: "logo", // 🔥 FIXED ID
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        transformation: [
          { width: 600, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      };
    } else if (file.fieldname === "heroImage") {
      return {
        folder: "branding",
        public_id: "heroImage", // 🔥 FIXED ID
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        transformation: [
          { width: 1920, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      };
    }

    // Gallery uploads (can stay dynamic)
    return {
      folder: "uploads",
      resource_type: "auto",
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log(
      `File filter checking: ${file.originalname} (${file.mimetype})`
    );

    const allowedMimes = [
      "image/webp",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/avif",
      "video/mp4",
      "application/pdf",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      console.log(`✓ File accepted: ${file.originalname}`);
      cb(null, true);
    } else {
      console.error(`✗ File rejected: ${file.originalname} (${file.mimetype})`);
      cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Only images, videos, and PDFs are allowed.`
        ),
        false
      );
    }
  },
});

// Add error handling middleware wrapper
const uploadWithErrorHandling = (fields) => {
  const middleware = upload.fields(fields);

  return (req, res, next) => {
    console.log("=== MULTER MIDDLEWARE START ===");
    console.log("Request Content-Type:", req.headers["content-type"]);

    middleware(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 10MB",
          });
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            success: false,
            message:
              "Unexpected file field. Only 'logo' and 'gallery' are allowed.",
          });
        }

        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }

      console.log("=== MULTER MIDDLEWARE END ===");
      console.log(
        "Uploaded files:",
        req.files
          ? {
              logo: req.files.logo
                ? `${req.files.logo.length} file(s)`
                : "none",
              gallery: req.files.gallery
                ? `${req.files.gallery.length} file(s)`
                : "none",
            }
          : "no files"
      );

      next();
    });
  };
};

module.exports = uploadWithErrorHandling;
