const asyncHandler = require("express-async-handler");
const Setting = require("../models/Setting");
const cloudinary = require("../config/cloudinary");

/**
 * @desc    Get site settings
 * @route   GET /api/settings
 * @access  Public
 */
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  // If no settings exist, create default
  if (!settings) {
    settings = await Setting.create({});
  }

  res.status(200).json({
    success: true,
    data: settings,
  });
});

/**
 * @desc    Update site settings
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  // Build update object
  const updateData = { ...req.body };

  // Parse stringified JSON fields if they arrive via FormData
  const jsonFields = [
    "hotelInfo",
    "taxesAndFees",
    "policies",
    "emailTemplates",
  ];
  jsonFields.forEach((field) => {
    if (updateData[field] && typeof updateData[field] === "string") {
      try {
        updateData[field] = JSON.parse(updateData[field]);
      } catch (error) {
        console.error(`Error parsing ${field}:`, error);
      }
    }
  });

  // Handle Logo Upload via main settings update
  let newLogo = null;
  if (req.files && req.files.logo && req.files.logo.length > 0) {
    const logoFile = req.files.logo[0];
    newLogo = {
      url: logoFile.path,
      publicId: logoFile.filename,
      width: logoFile.width || null,
      height: logoFile.height || null,
      format: logoFile.format || logoFile.mimetype,
    };

    if (!updateData.hotelInfo) updateData.hotelInfo = {};
    updateData.hotelInfo.logo = newLogo;
  }

  // Handle Gallery Uploads via main settings update
  let newGalleryImages = [];
  if (req.files && req.files.gallery && req.files.gallery.length > 0) {
    newGalleryImages = req.files.gallery.map((file) => ({
      url: file.path,
      publicId: file.filename,
      width: file.width || null,
      height: file.height || null,
      format: file.format || file.mimetype,
    }));

    if (!updateData.hotelInfo) updateData.hotelInfo = {};
    const existingGallery = settings.hotelInfo?.gallery || [];
    updateData.hotelInfo.gallery = [...existingGallery, ...newGalleryImages];
  }

  // Store old files for cleanup on success
  const oldLogo = settings.hotelInfo?.logo;

  try {
    settings = await Setting.findOneAndUpdate({}, updateData, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    // Success cleanup: delete old logo if a new one was uploaded
    if (newLogo && oldLogo?.publicId) {
      try {
        await cloudinary.uploader.destroy(oldLogo.publicId);
      } catch (error) {
        console.error("Error deleting old logo from Cloudinary:", error);
      }
    }

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    // Failure cleanup: delete newly uploaded files from Cloudinary
    if (newLogo?.publicId) {
      try {
        await cloudinary.uploader.destroy(newLogo.publicId);
      } catch (cleanupError) {
        console.error("Error cleaning up new logo:", cleanupError);
      }
    }
    if (newGalleryImages.length > 0) {
      const cleanupPromises = newGalleryImages.map((image) =>
        cloudinary.uploader
          .destroy(image.publicId)
          .catch((err) => console.error("Error cleaning up new image:", err))
      );
      await Promise.all(cleanupPromises);
    }
    throw error;
  }
});

/**
 * @desc    Upload hotel logo
 * @route   POST /api/settings/upload-logo
 * @access  Private/Admin
 */
const uploadLogo = asyncHandler(async (req, res) => {
  // Support both upload.single (req.file) and upload.fields (req.files.logo[0])
  const logoFile =
    (req.files && req.files.logo && req.files.logo[0]) || req.file;

  if (!logoFile) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});

  const logoData = {
    url: logoFile.path,
    publicId: logoFile.filename,
    width: logoFile.width || null,
    height: logoFile.height || null,
    format: logoFile.format || logoFile.mimetype,
  };

  const oldLogo = settings.hotelInfo?.logo;

  try {
    if (!settings.hotelInfo) settings.hotelInfo = {};
    settings.hotelInfo.logo = logoData;
    await settings.save();

    // Success cleanup
    if (oldLogo?.publicId) {
      try {
        await cloudinary.uploader.destroy(oldLogo.publicId);
      } catch (error) {
        console.error("Error deleting old logo from Cloudinary:", error);
      }
    }

    res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      data: logoData,
    });
  } catch (error) {
    // Failure cleanup
    if (logoData.publicId) {
      try {
        await cloudinary.uploader.destroy(logoData.publicId);
      } catch (cleanupError) {
        console.error("Error cleaning up new logo:", cleanupError);
      }
    }
    throw error;
  }
});

/**
 * @desc    Upload gallery images
 * @route   POST /api/settings/gallery
 * @access  Private/Admin
 */
const uploadGalleryImages = asyncHandler(async (req, res) => {
  // Support both upload.array (req.files) and upload.fields (req.files.gallery)
  const galleryFiles =
    (req.files && req.files.gallery) ||
    (Array.isArray(req.files) ? req.files : null);

  if (!galleryFiles || galleryFiles.length === 0) {
    res.status(400);
    throw new Error("Please upload at least one image");
  }

  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});

  const newImages = galleryFiles.map((file) => ({
    url: file.path,
    publicId: file.filename,
    width: file.width || null,
    height: file.height || null,
    format: file.format || file.mimetype,
  }));

  try {
    if (!settings.hotelInfo) settings.hotelInfo = {};
    if (!settings.hotelInfo.gallery) settings.hotelInfo.gallery = [];

    settings.hotelInfo.gallery.push(...newImages);
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Gallery images uploaded successfully",
      data: newImages,
    });
  } catch (error) {
    // Failure cleanup
    if (newImages.length > 0) {
      const cleanupPromises = newImages.map((image) =>
        cloudinary.uploader
          .destroy(image.publicId)
          .catch((err) => console.error("Error cleaning up new image:", err))
      );
      await Promise.all(cleanupPromises);
    }
    throw error;
  }
});

/**
 * @desc    Delete gallery image
 * @route   DELETE /api/admin/settings/gallery/:publicId
 * @access  Private/Admin
 */
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  let settings = await Setting.findOne();
  if (!settings) {
    res.status(404);
    throw new Error("Settings not found");
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(publicId);

  // Remove from database
  if (settings.hotelInfo && settings.hotelInfo.gallery) {
    settings.hotelInfo.gallery = settings.hotelInfo.gallery.filter(
      (img) => img.publicId !== publicId
    );
  }

  await settings.save();

  res.status(200).json({
    success: true,
    message: "Gallery image deleted successfully",
  });
});

module.exports = {
  getSettings,
  updateSettings,
  uploadLogo,
  uploadGalleryImages,
  deleteGalleryImage,
};
