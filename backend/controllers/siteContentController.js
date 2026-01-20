const asyncHandler = require("express-async-handler");
const SiteContent = require("../models/SiteContent");
const cloudinary = require("../config/cloudinary");
const { safeJsonParse, isValidImageFile } = require("../utils/imageUtils");

// Helper function to process media library uploads
const processMediaUploads = async (files) => {
  const result = {
    success: true,
    images: [],
    errors: [],
  };

  if (!files || !files.mediaLibrary || files.mediaLibrary.length === 0) {
    return result;
  }

  try {
    for (const file of files.mediaLibrary) {
      if (!isValidImageFile(file)) {
        result.errors.push(`Invalid image file: ${file.originalname}`);
        result.success = false;
        return result;
      }
    }

    result.images = files.mediaLibrary.map((file) => ({
      url: file.path,
      publicId: file.filename,
      width: file.width || null,
      height: file.height || null,
      format: file.format || file.mimetype,
      originalName: file.originalname,
    }));

    return result;
  } catch (error) {
    console.error("Media processing error:", error);
    return {
      success: false,
      images: [],
      errors: ["Media processing failed"],
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

// @desc    Get site content
// @route   GET /api/site-content
// @access  Public
const getSiteContent = asyncHandler(async (req, res) => {
  let content = await SiteContent.findOne();
  if (!content) {
    content = await SiteContent.create({});
  }
  res.status(200).json({
    success: true,
    data: content,
  });
});

// @desc    Update homepage content
// @route   PUT /api/site-content/homepage
// @access  Private/Admin
const updateHomePage = asyncHandler(async (req, res) => {
  console.log("=== Updating Homepage ===");

  let homepageData = req.body.homepage;

  // Parse homepage data if provided
  if (homepageData) {
    if (typeof homepageData === "string") {
      homepageData = safeJsonParse(homepageData);
    }
  }

  // Handle Hero Image Upload
  if (req.files?.heroImage?.length > 0) {
    const heroImageFile = req.files.heroImage[0];

    // Get current content to preserve existing homepage data
    const content = await SiteContent.findOne();
    if (!homepageData) {
      homepageData = content?.homepage || {};
    }
    if (!homepageData.hero) {
      homepageData.hero = content?.homepage?.hero || {};
    }
    homepageData.hero.image = heroImageFile.path;
  }

  // Only update if we have homepage data
  if (!homepageData) {
    res.status(400);
    throw new Error("No homepage data provided");
  }

  // Use MongoDB update operator to only modify homepage field
  const updatedContent = await SiteContent.findOneAndUpdate(
    {},
    { $set: { homepage: homepageData } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: updatedContent.homepage });
});

// @desc    Update gallery content
// @route   PUT /api/site-content/gallery
// @access  Private/Admin
// const updateGallery = asyncHandler(async (req, res) => {
//   let galleryData = req.body.gallery;

//   // Handle missing data
//   if (!galleryData) {
//     res.status(400);
//     throw new Error("No gallery data provided");
//   }

//   // Parse if data is sent as a string (common with FormData)
//   if (typeof galleryData === "string") {
//     try {
//       galleryData = JSON.parse(galleryData);
//     } catch (err) {
//       res.status(400);
//       throw new Error("Invalid JSON format for gallery data");
//     }
//   }

//   // Final validation - ensure it's an array
//   if (!Array.isArray(galleryData)) {
//     res.status(400);
//     throw new Error("Gallery data must be an array of albums");
//   }

//   // File Handling Logic - update image URLs if files were uploaded
//   if (req.files?.galleryManagement?.length > 0) {
//     const galleryFiles = req.files.galleryManagement;
//     const fileMap = new Map();

//     // Create a map for quick file lookup by original name
//     galleryFiles.forEach((file) => {
//       fileMap.set(file.originalname, file);
//     });

//     // Update image URLs with uploaded file paths
//     galleryData = galleryData.map((album) => {
//       if (!album.images) return album;

//       const updatedImages = album.images.map((img) => {
//         const matchedFile = fileMap.get(img.title);
//         if (matchedFile) {
//           return {
//             ...img,
//             url: matchedFile.path,
//             publicId: matchedFile.filename,
//           };
//         }
//         return img;
//       });

//       return { ...album, images: updatedImages };
//     });
//   }

//   // Get or create site content document
//   let content = await SiteContent.findOne();
//   if (!content) {
//     content = new SiteContent();
//   }

//   console.log(content);

//   // Set the gallery data - FIXED: Changed 'galleries' to 'gallery' to match the field name
//   // content.set("gallery", galleryData);
//   // content.markModified("gallery");

//   await content.save();

//   res.status(200).json({
//     success: true,
//     data: content.gallery,
//     message: "Gallery updated successfully",
//   });
// });

const updateGallery = asyncHandler(async (req, res) => {
  try {
    let galleryData = req.body.gallery;

    // Handle missing data
    if (!galleryData) {
      return res.status(400).json({
        success: false,
        error: "No gallery data provided",
      });
    }

    // Parse if data is sent as a string (common with FormData)
    if (typeof galleryData === "string") {
      try {
        galleryData = JSON.parse(galleryData);
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: "Invalid JSON format for gallery data",
        });
      }
    }

    // Validate it's an array
    if (!Array.isArray(galleryData)) {
      return res.status(400).json({
        success: false,
        error: "Gallery data must be an array of albums",
      });
    }

    // Optional: Validate each album structure
    try {
      for (const album of galleryData) {
        if (!album || typeof album !== "object") {
          throw new Error("Invalid album structure");
        }
        // Add more validations as needed based on your schema
        // e.g., if (album.images && !Array.isArray(album.images)) { ... }
      }
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: `Invalid gallery data structure: ${validationError.message}`,
      });
    }

    // Process file uploads if any
    if (req.files?.galleryManagement?.length > 0) {
      try {
        const galleryFiles = req.files.galleryManagement;
        const fileMap = new Map();

        galleryFiles.forEach((file) => {
          fileMap.set(file.originalname, file);
        });

        galleryData = galleryData.map((album) => {
          if (!album.images || !Array.isArray(album.images)) return album;

          const updatedImages = album.images.map((img) => {
            if (!img || typeof img !== "object") return img;

            const matchedFile = fileMap.get(img.title);
            if (matchedFile) {
              return {
                ...img,
                url: matchedFile.path || matchedFile.location,
                publicId: matchedFile.filename || matchedFile.key,
                uploadedAt: new Date(),
              };
            }
            return img;
          });

          return { ...album, images: updatedImages };
        });
      } catch (fileProcessingError) {
        console.error("File processing error:", fileProcessingError);
        return res.status(500).json({
          success: false,
          error: "Failed to process uploaded files",
        });
      }
    }

    // Find existing content
    let content;
    try {
      content = await SiteContent.findOne().lean();
    } catch (findError) {
      console.error("Database find error:", findError);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve site content",
      });
    }

    // Prepare update data
    const updateData = { gallery: galleryData };

    // Add timestamp
    updateData.updatedAt = new Date();

    let result;
    if (content) {
      // Update existing document
      try {
        result = await SiteContent.findOneAndUpdate(
          { _id: content._id },
          { $set: updateData },
          {
            new: true, // Return the updated document
            runValidators: true, // Run schema validators
            upsert: false, // Don't create if not found
          }
        )
          .select("gallery updatedAt")
          .lean();
      } catch (updateError) {
        console.error("Database update error:", updateError);
        return res.status(500).json({
          success: false,
          error: "Failed to update gallery",
          details: updateError.message,
        });
      }
    } else {
      // Create new document
      try {
        const newContent = new SiteContent(updateData);
        result = await newContent.save();
        result = result.toObject();
      } catch (createError) {
        console.error("Database create error:", createError);
        return res.status(500).json({
          success: false,
          error: "Failed to create gallery",
          details: createError.message,
        });
      }
    }

    // Verify the update was successful
    if (!result) {
      return res.status(500).json({
        success: false,
        error: "Gallery update failed - no result returned",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      data: result.gallery,
      updatedAt: result.updatedAt,
      message: content
        ? "Gallery updated successfully"
        : "Gallery created successfully",
    });
  } catch (unexpectedError) {
    // Catch any unexpected errors
    console.error("Unexpected error in updateGallery:", unexpectedError);

    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
      details:
        process.env.NODE_ENV === "development"
          ? unexpectedError.message
          : undefined,
    });
  }
});

// @desc    Update offers content
// @route   PUT /api/site-content/offers
// @access  Private/Admin
const updateOffers = asyncHandler(async (req, res) => {
  console.log("=== Updating Offers ===");

  let offersData = req.body.offers;

  if (!offersData) {
    res.status(400);
    throw new Error("No offers data provided");
  }

  if (typeof offersData === "string") {
    offersData = safeJsonParse(offersData);
  }

  // Use MongoDB update operator to only modify offers field
  const updatedContent = await SiteContent.findOneAndUpdate(
    {},
    { $set: { offers: offersData } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: updatedContent.offers });
});

// @desc    Update blog content
// @route   PUT /api/site-content/blogs
// @access  Private/Admin
const updateBlog = asyncHandler(async (req, res) => {
  console.log("=== Updating Blogs ===");

  let blogsData = req.body.blogs;

  if (!blogsData) {
    res.status(400);
    throw new Error("No blogs data provided");
  }

  if (typeof blogsData === "string") {
    blogsData = safeJsonParse(blogsData);
  }

  // Use MongoDB update operator to only modify blogs field
  const updatedContent = await SiteContent.findOneAndUpdate(
    {},
    { $set: { blogs: blogsData } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: updatedContent.blogs });
});

// @desc    Update media library
// @route   PUT /api/site-content/media-library
// @access  Private/Admin
const updateMediaLibrary = asyncHandler(async (req, res) => {
  console.log("=== Updating Media Library ===");

  let existingMedia = req.body.existingMediaImages;
  if (typeof existingMedia === "string") {
    existingMedia = safeJsonParse(existingMedia);
  }

  // Handle specific file uploads
  let newMediaImages = [];
  if (req.files?.mediaLibrary?.length > 0) {
    const mediaResult = await processMediaUploads(req.files);
    if (!mediaResult.success) {
      res.status(400);
      throw new Error(mediaResult.errors.join(", "));
    }
    newMediaImages = mediaResult.images;
  }

  // Get current media library
  const content = await SiteContent.findOne();
  const currentMedia = existingMedia || content?.mediaLibrary || [];
  const updatedMediaLibrary = [...currentMedia, ...newMediaImages];

  // Use MongoDB update operator to only modify mediaLibrary field
  const updatedContent = await SiteContent.findOneAndUpdate(
    {},
    { $set: { mediaLibrary: updatedMediaLibrary } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: updatedContent.mediaLibrary });
});

// @desc    Delete media image
// @route   DELETE /api/site-content/media/:publicId
// @access  Private/Admin
const deleteMediaImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;
  const content = await SiteContent.findOne();
  if (!content) {
    res.status(404);
    throw new Error("Site content not found");
  }

  const imageIndex = content.mediaLibrary?.findIndex(
    (img) => img.publicId === publicId
  );
  if (imageIndex === -1 || imageIndex === undefined) {
    res.status(404);
    throw new Error("Image not found in media library");
  }

  content.mediaLibrary.splice(imageIndex, 1);
  await content.save();

  res.status(200).json({
    success: true,
    message: "Image deleted successfully",
    data: content.mediaLibrary,
  });

  setTimeout(async () => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }, 3000);
});

module.exports = {
  getSiteContent,
  updateHomePage,
  updateGallery,
  updateOffers,
  updateBlog,
  updateMediaLibrary,
  deleteMediaImage,
};
