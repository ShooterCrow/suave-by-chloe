const createUniqueSlug = require("../utils/slugGenerator");
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Standard", "Deluxe", "Suite", "Presidential", "Family"],
    },

    // Descriptions
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    fullDescription: {
      type: String,
      required: true,
    },

    // Pricing
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    weekendPrice: {
      type: Number,
      min: 0,
    },

    // Capacity
    maxOccupancy: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },

    // Room Details
    bedConfiguration: {
      type: String,
      required: true,
      // e.g., "1 King Bed", "2 Queen Beds", "1 Queen + 1 Single"
    },
    roomSize: {
      value: Number,
      unit: {
        type: String,
        enum: ["sqft", "sqm"],
        default: "sqft",
      },
    },
    numberOfRooms: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      // How many physical rooms of this type exist
    },

    // Amenities (what comes with the room)
    amenities: [
      {
        type: String,
        // e.g., ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony']
      },
    ],

    // Images
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: String, // For Cloudinary deletion
        caption: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Status & Visibility
    isActive: {
      type: Boolean,
      default: true,
      // Can turn off without deleting
    },
    isFeatured: {
      type: Boolean,
      default: false,
      // Show on homepage
    },

    // External Links
    bookingComUrl: {
      type: String,
    },

    // Metadata
    viewCount: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
roomSchema.index({ category: 1, isActive: 1 });
roomSchema.index({ pricePerNight: 1 });
roomSchema.index({ slug: 1 });

// Virtual for calculating availability
roomSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "room",
});

// Create slug from name
// Create slug from name
roomSchema.pre("save", async function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = await createUniqueSlug(this.constructor, this.name);
  }
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
