const mongoose = require("mongoose");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
};

/**
 * Generates a unique slug for a Mongoose model.
 *
 * @param {Model} model - The Mongoose model to check against.
 * @param {string} string - The string to slugify (usually the name or title).
 * @param {string} field - The field to check in the database (default: 'slug').
 * @returns {Promise<string>} - A unique slug.
 */
const createUniqueSlug = async (model, string, field = "slug") => {
  let slug = slugify(string);
  let uniqueSlug = slug;
  let count = 1;

  // Check if slug already exists
  while (await model.findOne({ [field]: uniqueSlug })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
};

module.exports = createUniqueSlug;
