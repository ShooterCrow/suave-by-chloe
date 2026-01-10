const asyncHandler = require("express-async-handler");
const Setting = require("../models/Setting");
const cloudinary = require("../config/cloudinary");

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
  console.log(req.gallery, req.logo);

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

  // Initialize hotelInfo in updateData if it doesn't exist
  if (!updateData.hotelInfo) {
    updateData.hotelInfo = {};
  }

  // Store old logo for cleanup (BEFORE any updates)
  const oldLogo = settings.hotelInfo?.logo;
  let newLogo = null;

  // Handle Logo Upload (from req.files.logo array - matches upload.fields())
  if (req.files && req.files.logo && req.files.logo.length > 0) {
    const logoFile = req.files.logo[0];
    newLogo = {
      url: logoFile.path,
      publicId: logoFile.filename,
      width: logoFile.width || null,
      height: logoFile.height || null,
      format: logoFile.format || logoFile.mimetype,
    };

    // Add new logo to hotelInfo
    updateData.hotelInfo.logo = newLogo;
  }

  // Handle Gallery Uploads (from req.files.gallery array - matches upload.fields())
  let newGalleryImages = [];
  if (req.files && req.files.gallery && req.files.gallery.length > 0) {
    // Process gallery images (validation, transformation, etc.)
    newGalleryImages = req.files.gallery.map((file) => ({
      url: file.path,
      publicId: file.filename,
      width: file.width || null,
      height: file.height || null,
      format: file.format || file.mimetype,
      originalName: file.originalname,
    }));

    // Get existing gallery or initialize empty array
    const existingGallery = settings.hotelInfo?.gallery || [];

    // Merge existing gallery with new images
    updateData.hotelInfo.gallery = [...existingGallery, ...newGalleryImages];
  }

  try {
    // Update settings
    settings = await Setting.findOneAndUpdate({}, updateData, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    // Send response first (non-blocking)
    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });

    // Delete old logo AFTER response is sent (with delay for CDN propagation)
    if (newLogo && oldLogo?.publicId) {
      setTimeout(async () => {
        try {
          await cloudinary.uploader.destroy(oldLogo.publicId);
        } catch (error) {
          console.error("Error deleting old logo from Cloudinary:", error);
        }
      }, 5000); // 5 second delay
    }
  } catch (error) {
    // Clean up newly uploaded files if update fails
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

    res.status(500);
    throw error;
  }
});

// @desc    Delete gallery image
// @route   DELETE /api/settings/gallery/:publicId
// @access  Private/Admin
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  const settings = await Setting.findOne();
  if (!settings) {
    res.status(404);
    throw new Error("Settings not found");
  }

  // Find and remove the image from gallery
  const imageIndex = settings.hotelInfo?.gallery?.findIndex(
    (img) => img.publicId === publicId
  );

  if (imageIndex === -1 || imageIndex === undefined) {
    res.status(404);
    throw new Error("Image not found in gallery");
  }

  // Remove from array
  settings.hotelInfo.gallery.splice(imageIndex, 1);

  await settings.save();

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }

  res.status(200).json({
    success: true,
    message: "Image deleted successfully",
    data: settings.hotelInfo.gallery,
  });
});

module.exports = {
  getSettings,
  updateSettings,
  deleteGalleryImage,
};

// const asyncHandler = require("express-async-handler");

// const Setting = require("../models/Setting");
// const cloudinary = require("../config/cloudinary");

// // Helper function to validate image files
// const isValidImageFile = (file) => {
//   const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
//   const maxSize = 5 * 1024 * 1024; // 5MB
//   return allowedTypes.includes(file.mimetype) && file.size <= maxSize;
// };

// // Helper function to process screenshot uploads
// const processScreenshotUploads = async (files) => {
//   const result = {
//     success: true,
//     screenshots: [],
//     errors: [],
//   };

//   if (!files || !files.screenshots || files.screenshots.length === 0) {
//     return result; // No screenshots to process
//   }

//   try {
//     // Validate each screenshot file
//     for (const file of files.screenshots) {
//       if (!isValidImageFile(file)) {
//         result.errors.push(`Invalid screenshot file: ${file.originalname}`);
//         result.success = false;
//         return result;
//       }
//     }

//     // Process valid screenshots
//     result.screenshots = files.screenshots.map((file) => ({
//       url: file.path,
//       publicId: file.filename,
//       width: file.width || null,
//       height: file.height || null,
//       format: file.format || file.mimetype,
//       originalName: file.originalname,
//     }));

//     return result;
//   } catch (error) {
//     console.error("Screenshot processing error:", error);
//     return {
//       success: false,
//       screenshots: [],
//       errors: ["Screenshot processing failed"],
//     };
//   }
// };

// // Helper function to cleanup failed uploads
// const cleanupFailedScreenshots = async (screenshots) => {
//   if (!screenshots || screenshots.length === 0) return;

//   const cleanupPromises = screenshots.map((screenshot) => {
//     if (screenshot.publicId) {
//       return cloudinary.uploader
//         .destroy(screenshot.publicId)
//         .catch((error) =>
//           console.error("Error cleaning up failed screenshot upload:", error)
//         );
//     }
//   });

//   await Promise.allSettled(cleanupPromises);
// };

// // Helper function to cleanup screenshots by public IDs
// const cleanupScreenshotsByPublicIds = async (publicIds) => {
//   if (!publicIds || publicIds.length === 0) return;

//   const cleanupPromises = publicIds.map((publicId) => {
//     return cloudinary.uploader
//       .destroy(publicId)
//       .catch((error) =>
//         console.error(`Error deleting screenshot ${publicId}:`, error)
//       );
//   });

//   await Promise.allSettled(cleanupPromises);
// };

// /**
//  * @desc    Get site settings
//  * @route   GET /api/settings
//  * @access  Public
//  */
// const getSettings = asyncHandler(async (req, res) => {
//   let settings = await Setting.findOne();

//   // If no settings exist, create default
//   if (!settings) {
//     settings = await Setting.create({});
//   }

//   res.status(200).json({
//     success: true,
//     data: settings,
//   });
// });

// /**
//  * @desc    Update site settings
//  * @route   PUT /api/settings
//  * @access  Private/Admin
//  */
// const updateSettings = asyncHandler(async (req, res) => {
//   let settings = await Setting.findOne();

//   if (!settings) {
//     settings = await Setting.create({});
//   }

//   // Build update object
//   const updateData = { ...req.body };

//   // Parse stringified JSON fields if they arrive via FormData
//   const jsonFields = [
//     "hotelInfo",
//     "taxesAndFees",
//     "policies",
//     "emailTemplates",
//   ];
//   jsonFields.forEach((field) => {
//     if (updateData[field] && typeof updateData[field] === "string") {
//       try {
//         updateData[field] = JSON.parse(updateData[field]);
//       } catch (error) {
//         console.error(`Error parsing ${field}:`, error);
//       }
//     }
//   });

//   try {
//     // Update settings (no file handling here - that's done in separate endpoints)
//     settings = await Setting.findOneAndUpdate({}, updateData, {
//       new: true,
//       runValidators: true,
//       upsert: true,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Settings updated successfully",
//       data: settings,
//     });
//   } catch (error) {
//     res.status(500);
//     throw error;
//   }
// });

// // New separate logo upload controller (similar to blog controller)
// const uploadLogo = asyncHandler(async (req, res) => {
//   const settings = await Setting.findOne();

//   if (!settings) {
//     throw new Error("Settings not found");
//   }

//   if (!req.file) {
//     res.status(400);
//     throw new Error("No logo file provided");
//   }

//   // Store old logo for cleanup
//   const oldLogo = settings.hotelInfo?.logo || null;

//   const newLogo = {
//     url: req.file.path,
//     publicId: req.file.filename,
//     width: req.file.width || null,
//     height: req.file.height || null,
//     format: req.file.format || req.file.mimetype,
//   };

//   try {
//     // Update settings with new logo
//     settings.hotelInfo = settings.hotelInfo || {};
//     settings.hotelInfo.logo = newLogo;

//     await settings.save();

//     // Send response first
//     res.status(200).json({
//       success: true,
//       message: "Logo uploaded successfully",
//       data: {
//         logo: newLogo,
//         hotelInfo: settings.hotelInfo,
//       },
//     });

//     // Delete old logo AFTER response is sent (with delay for CDN propagation)
//     if (oldLogo?.publicId) {
//       setTimeout(async () => {
//         try {
//           await cloudinary.uploader.destroy(oldLogo.publicId);
//         } catch (error) {
//           console.error("Error deleting old logo from Cloudinary:", error);
//         }
//       }, 5000); // 5 second delay
//     }
//   } catch (error) {
//     // Clean up newly uploaded file if update fails
//     if (newLogo?.publicId) {
//       try {
//         await cloudinary.uploader.destroy(newLogo.publicId);
//       } catch (cleanupError) {
//         console.error("Error cleaning up new logo:", cleanupError);
//       }
//     }
//     throw error;
//   }
// });

// // Gallery upload controller (multiple images like tasks)
// const uploadGalleryImages = asyncHandler(async (req, res) => {
//   const settings = await Setting.findOne();

//   if (!settings) {
//     throw new Error("Settings not found");
//   }

//   if (!req.files || req.files.length === 0) {
//     res.status(400);
//     throw new Error("No gallery images provided");
//   }

//   const newGalleryImages = req.files.map((file) => ({
//     url: file.path,
//     publicId: file.filename,
//     width: file.width || null,
//     height: file.height || null,
//     format: file.format || file.mimetype,
//     originalName: file.originalname,
//   }));

//   try {
//     // Initialize hotelInfo and gallery if they don't exist
//     settings.hotelInfo = settings.hotelInfo || {};
//     settings.hotelInfo.gallery = settings.hotelInfo.gallery || [];

//     // Add new images to gallery
//     settings.hotelInfo.gallery = [
//       ...settings.hotelInfo.gallery,
//       ...newGalleryImages,
//     ];

//     await settings.save();

//     res.status(200).json({
//       success: true,
//       message: `Successfully uploaded ${newGalleryImages.length} image(s)`,
//       data: {
//         gallery: settings.hotelInfo.gallery,
//         newImages: newGalleryImages,
//       },
//     });
//   } catch (error) {
//     // Clean up newly uploaded files if update fails
//     if (newGalleryImages.length > 0) {
//       const cleanupPromises = newGalleryImages.map((image) =>
//         cloudinary.uploader
//           .destroy(image.publicId)
//           .catch((err) => console.error("Error cleaning up new image:", err))
//       );
//       await Promise.all(cleanupPromises);
//     }
//     throw error;
//   }
// });

// /**
//  * @desc    Upload hotel logo
//  * @route   POST /api/settings/upload-logo
//  * @access  Private/Admin
//  */
// // const uploadLogo = asyncHandler(async (req, res) => {
// //   // Support both upload.single (req.file) and upload.fields (req.files.logo[0])
// //   const logoFile =
// //     (req.files && req.files.logo && req.files.logo[0]) || req.file;

// //   if (!logoFile) {
// //     res.status(400);
// //     throw new Error("Please upload an image");
// //   }

// //   let settings = await Setting.findOne();
// //   if (!settings) settings = await Setting.create({});

// //   const logoData = {
// //     url: logoFile.path,
// //     publicId: logoFile.filename,
// //     width: logoFile.width || null,
// //     height: logoFile.height || null,
// //     format: logoFile.format || logoFile.mimetype,
// //   };

// //   const oldLogo = settings.hotelInfo?.logo;

// //   try {
// //     if (!settings.hotelInfo) settings.hotelInfo = {};
// //     settings.hotelInfo.logo = logoData;
// //     await settings.save();

// //     // Success cleanup
// //     if (oldLogo?.publicId) {
// //       try {
// //         await cloudinary.uploader.destroy(oldLogo.publicId);
// //       } catch (error) {
// //         console.error("Error deleting old logo from Cloudinary:", error);
// //       }
// //     }

// //     res.status(200).json({
// //       success: true,
// //       message: "Logo uploaded successfully",
// //       data: logoData,
// //     });
// //   } catch (error) {
// //     // Failure cleanup
// //     if (logoData.publicId) {
// //       try {
// //         await cloudinary.uploader.destroy(logoData.publicId);
// //       } catch (cleanupError) {
// //         console.error("Error cleaning up new logo:", cleanupError);
// //       }
// //     }
// //     throw error;
// //   }
// // });

// /**
//  * @desc    Upload gallery images
//  * @route   POST /api/settings/gallery
//  * @access  Private/Admin
//  */
// // const uploadGalleryImages = asyncHandler(async (req, res) => {
// //   // Support both upload.array (req.files) and upload.fields (req.files.gallery)
// //   const galleryFiles =
// //     (req.files && req.files.gallery) ||
// //     (Array.isArray(req.files) ? req.files : null);

// //   if (!galleryFiles || galleryFiles.length === 0) {
// //     res.status(400);
// //     throw new Error("Please upload at least one image");
// //   }

// //   let settings = await Setting.findOne();
// //   if (!settings) settings = await Setting.create({});

// //   const newImages = galleryFiles.map((file) => ({
// //     url: file.path,
// //     publicId: file.filename,
// //     width: file.width || null,
// //     height: file.height || null,
// //     format: file.format || file.mimetype,
// //   }));

// //   try {
// //     if (!settings.hotelInfo) settings.hotelInfo = {};
// //     if (!settings.hotelInfo.gallery) settings.hotelInfo.gallery = [];

// //     settings.hotelInfo.gallery.push(...newImages);
// //     await settings.save();

// //     res.status(200).json({
// //       success: true,
// //       message: "Gallery images uploaded successfully",
// //       data: newImages,
// //     });
// //   } catch (error) {
// //     // Failure cleanup
// //     if (newImages.length > 0) {
// //       const cleanupPromises = newImages.map((image) =>
// //         cloudinary.uploader
// //           .destroy(image.publicId)
// //           .catch((err) => console.error("Error cleaning up new image:", err))
// //       );
// //       await Promise.all(cleanupPromises);
// //     }
// //     throw error;
// //   }
// // });

// /**
//  * @desc    Delete gallery image
//  * @route   DELETE /api/admin/settings/gallery/:publicId
//  * @access  Private/Admin
//  */
// const deleteGalleryImage = asyncHandler(async (req, res) => {
//   const { publicId } = req.params;

//   let settings = await Setting.findOne();
//   if (!settings) {
//     res.status(404);
//     throw new Error("Settings not found");
//   }

//   // Delete from Cloudinary
//   await cloudinary.uploader.destroy(publicId);

//   // Remove from database
//   if (settings.hotelInfo && settings.hotelInfo.gallery) {
//     settings.hotelInfo.gallery = settings.hotelInfo.gallery.filter(
//       (img) => img.publicId !== publicId
//     );
//   }

//   await settings.save();

//   res.status(200).json({
//     success: true,
//     message: "Gallery image deleted successfully",
//   });
// });

// module.exports = {
//   getSettings,
//   updateSettings,
//   uploadLogo,
//   uploadGalleryImages,
//   deleteGalleryImage,
// };
