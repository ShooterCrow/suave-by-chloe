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
 * @route   PUT /api/admin/settings
 * @access  Private/Admin
 */
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  // Handle nested updates properly
  // Using findOneAndUpdate with the req.body
  settings = await Setting.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    data: settings,
  });
});

/**
 * @desc    Upload hotel logo
 * @route   POST /api/admin/settings/upload-logo
 * @access  Private/Admin
 */
const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});

  // Image is already uploaded to Cloudinary by multer-storage-cloudinary
  const imageData = {
    url: req.file.path,
    publicId: req.file.filename,
  };

  // Delete old logo if exists
  if (
    settings.hotelInfo &&
    settings.hotelInfo.logo &&
    settings.hotelInfo.logo.publicId
  ) {
    await cloudinary.uploader.destroy(settings.hotelInfo.logo.publicId);
  }

  // Update logo in settings
  // Ensure hotelInfo exists
  if (!settings.hotelInfo) settings.hotelInfo = {};
  settings.hotelInfo.logo = imageData;
  await settings.save();

  res.status(200).json({
    success: true,
    message: "Logo uploaded successfully",
    data: imageData,
  });
});

/**
 * @desc    Upload gallery images
 * @route   POST /api/admin/settings/gallery
 * @access  Private/Admin
 */
const uploadGalleryImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Please upload at least one image");
  }

  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});

  const newImages = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  // Ensure hotelInfo and gallery exist
  if (!settings.hotelInfo) settings.hotelInfo = {};
  if (!settings.hotelInfo.gallery) settings.hotelInfo.gallery = [];

  // Add to gallery
  settings.hotelInfo.gallery.push(...newImages);
  await settings.save();

  res.status(200).json({
    success: true,
    message: "Gallery images uploaded successfully",
    data: newImages,
  });
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
