const cloudinary = require("cloudinary").v2;

// Helper function to validate image files
const isValidImageFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return allowedTypes.includes(file.mimetype) && file.size <= maxSize;
};

// Helper function to process screenshot uploads
const processScreenshotUploads = async (files) => {
  const result = {
    success: true,
    screenshots: [],
    errors: [],
  };

  if (!files || !files.screenshots || files.screenshots.length === 0) {
    return result; // No screenshots to process
  }

  try {
    // Validate each screenshot file
    for (const file of files.screenshots) {
      if (!isValidImageFile(file)) {
        result.errors.push(`Invalid screenshot file: ${file.originalname}`);
        result.success = false;
        return result;
      }
    }

    // Process valid screenshots
    result.screenshots = files.screenshots.map((file) => ({
      url: file.path,
      publicId: file.filename,
      width: file.width || null,
      height: file.height || null,
      format: file.format || file.mimetype,
      originalName: file.originalname,
    }));

    return result;
  } catch (error) {
    console.error("Screenshot processing error:", error);
    return {
      success: false,
      screenshots: [],
      errors: ["Screenshot processing failed"],
    };
  }
};

// Helper function to cleanup failed uploads
const cleanupFailedScreenshots = async (screenshots) => {
  if (!screenshots || screenshots.length === 0) return;

  const cleanupPromises = screenshots.map((screenshot) => {
    if (screenshot.publicId) {
      return cloudinary.uploader
        .destroy(screenshot.publicId)
        .catch((error) =>
          console.error("Error cleaning up failed screenshot upload:", error)
        );
    }
  });

  await Promise.allSettled(cleanupPromises);
};

// Helper function to cleanup screenshots by public IDs
const cleanupScreenshotsByPublicIds = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) return;

  const cleanupPromises = publicIds.map((publicId) => {
    return cloudinary.uploader
      .destroy(publicId)
      .catch((error) =>
        console.error(`Error deleting screenshot ${publicId}:`, error)
      );
  });

  await Promise.allSettled(cleanupPromises);
};

// Helper function to extract screenshot public IDs from task submissions
const extractScreenshotPublicIds = (task) => {
  const screenshotsToDelete =
    task.submissions?.flatMap(
      (submission) =>
        submission.screenshots
          ?.filter((screenshot) => screenshot.publicId)
          .map((screenshot) => screenshot.publicId) || []
    ) || [];

  return screenshotsToDelete;
};

// Helper function to safely parse JSON
const safeJsonParse = (data, fallback = {}) => {
  if (typeof data === "object" && data !== null) return data;
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
};

module.exports = {
  safeJsonParse,
  extractScreenshotPublicIds,
  cleanupScreenshotsByPublicIds,
  cleanupFailedScreenshots,
  processScreenshotUploads,
  isValidImageFile,
};
