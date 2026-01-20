const asyncHandler = require("express-async-handler");
const Setting = require("../models/Setting");
const cloudinary = require("../config/cloudinary");

// Import helper functions (create these in your helpers file)
const {
  // isValidImageFile,
  processImageUploads,
  // cleanupFailedImages,
  safeJsonParse,
} = require("../utils/imageUtils");

// Helper function to validate image files (add to helpers if not exists)
const isValidImageFile = (file) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB
  return allowedTypes.includes(file.mimetype) && file.size <= maxSize;
};

// Helper function to process gallery uploads (similar to screenshots)
const processGalleryUploads = async (files) => {
  const result = {
    success: true,
    images: [],
    errors: [],
  };

  if (!files || !files.gallery || files.gallery.length === 0) {
    return result; // No gallery images to process
  }

  try {
    // Validate each gallery file
    for (const file of files.gallery) {
      if (!isValidImageFile(file)) {
        result.errors.push(`Invalid image file: ${file.originalname}`);
        result.success = false;
        return result;
      }
    }

    // Process valid images
    result.images = files.gallery.map((file) => ({
      url: file.path,
      publicId: file.filename,
      width: file.width || null,
      height: file.height || null,
      format: file.format || file.mimetype,
      originalName: file.originalname,
    }));

    return result;
  } catch (error) {
    console.error("Gallery processing error:", error);
    return {
      success: false,
      images: [],
      errors: ["Gallery processing failed"],
    };
  }
};

// Helper function to cleanup failed uploads
const cleanupFailedImages = async (images) => {
  if (!images || images.length === 0) return;

  const cleanupPromises = images.map((image) => {
    if (image.publicId) {
      return cloudinary.uploader
        .destroy(image.publicId)
        .catch((error) =>
          console.error("Error cleaning up failed image upload:", error)
        );
    }
  });

  await Promise.allSettled(cleanupPromises);
};

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  res.status(200).json({
    success: true,
    data: settings,
  });
});

// @desc    Update settings with logo and gallery uploads
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  // Store old logo for cleanup
  const oldLogo = settings.hotelInfo?.logo;
  let newLogo = null;
  let newGalleryImages = [];

  try {
    const updateData = { ...req.body };

    // Parse stringified JSON fields from FormData
    const jsonFields = [
      "hotelInfo",
      "taxesAndFees",
      "policies",
      "emailTemplates",
      "coordinates",
      "existingGalleryImages",
      "galleryMetadata",
    ];

    jsonFields.forEach((field) => {
      if (updateData[field] && typeof updateData[field] === "string") {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (error) {
          console.error(`Error parsing ${field}:`, error);
          throw new Error(`Invalid JSON format for ${field}`);
        }
      }
    });

    // Initialize hotelInfo if it doesn't exist
    if (!updateData.hotelInfo) {
      // Handle backward compatibility for individual fields
      const hotelInfoFields = [
        "name",
        "tagline",
        "description",
        "address",
        "city",
        "state",
        "country",
        "postalCode",
        "phone",
        "email",
        "website",
        "checkInTime",
        "checkOutTime",
        "timezone",
        "currency",
        "totalRooms",
        "starRating",
        "googleEmbedLink",
      ];

      const hasHotelInfoFields = hotelInfoFields.some(
        (field) => updateData[field] !== undefined
      );

      if (hasHotelInfoFields) {
        updateData.hotelInfo = {};
        hotelInfoFields.forEach((field) => {
          if (updateData[field] !== undefined) {
            updateData.hotelInfo[field] = updateData[field];
            delete updateData[field];
          }
        });
      } else {
        updateData.hotelInfo = {};
      }
    }

    // Handle Logo Upload
    if (req.files?.logo?.[0]) {
      const logoFile = req.files.logo[0];

      if (!isValidImageFile(logoFile)) {
        res.status(400);
        throw new Error(
          "Invalid logo file. Must be JPG, PNG, WebP, or GIF under 10MB"
        );
      }

      newLogo = {
        url: logoFile.path,
        publicId: logoFile.filename,
        width: logoFile.width || null,
        height: logoFile.height || null,
        format: logoFile.format || logoFile.mimetype.split("/")[1],
      };

      updateData.hotelInfo.logo = newLogo;
    }

    // Handle Logo Removal
    if (req.body?.removeLogo === "true") {
      updateData.hotelInfo.logo = null;
    }

    // Update settings in database
    settings = await Setting.findOneAndUpdate({}, updateData, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });

    // Asynchronous cleanup of old assets
    setTimeout(async () => {
      try {
        // Delete old logo if replaced or removed
        // if ((newLogo || req.body?.removeLogo === "true") && oldLogo?.publicId) {
        //   await cloudinary.uploader.destroy(oldLogo.publicId);
        // }
      } catch (cleanupError) {
        console.error("Error during asset cleanup:", cleanupError);
      }
    }, 5000);
  } catch (error) {
    console.error("Settings update error:", error);

    // Send error response
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

module.exports = {
  getSettings,
  updateSettings,
};
