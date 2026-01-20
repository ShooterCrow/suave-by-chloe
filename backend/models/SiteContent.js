const mongoose = require("mongoose");

const SiteContentSchema = new mongoose.Schema(
  {
    homepage: {
      hero: {
        title: { type: String, default: "Luxury Redefined" },
        subtitle: {
          type: String,
          default: "Experience unparalleled comfort and service",
        },
        buttonText: { type: String, default: "Book Your Stay" },
        image: {
          type: String,
          default:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        },
      },
      features: [
        {
          icon: String,
          title: String,
          description: String,
        },
      ],
      testimonials: [
        {
          name: String,
          quote: String,
          rating: Number,
        },
      ],
      cta: {
        title: { type: String, default: "Ready for Your Dream Vacation?" },
        subtitle: {
          type: String,
          default: "Book now and get 20% off your first stay",
        },
        buttonText: { type: String, default: "Book Now" },
      },
    },
    gallery: {
      type: [
        {
          id: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ["general", "special"], // adjust as needed
            default: "general",
          },
          imageCount: {
            type: Number,
            default: 0,
          },
          coverImage: {
            type: String,
            default: "",
          },
          status: {
            type: String,
            enum: ["draft", "published", "archived"], // adjust as needed
            default: "draft",
          },
          updatedAt: {
            type: Date,
            default: Date.now,
          },
          description: {
            type: String,
            default: "",
          },
          images: [
            {
              title: String,
              url: String,
              publicId: String,
              uploadedAt: Date,
              // Add other image properties as needed
            },
          ],
        },
      ],
      default: [],
    },
    mediaLibrary: [
      {
        url: String,
        publicId: String,
        width: Number,
        height: Number,
        format: String,
        originalName: String,
      },
    ],
    offers: [
      {
        title: String,
        code: String,
        discount: Number,
        type: { type: String, enum: ["percentage", "fixed"] },
        status: {
          type: String,
          enum: ["published", "draft"],
          default: "draft",
        },
      },
    ],
    blogs: [
      {
        title: String,
        author: String,
        content: String,
        status: {
          type: String,
          enum: ["published", "draft"],
          default: "draft",
        },
        image: String,
      },
    ],
    pages: [
      {
        title: String,
        content: String,
        slug: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteContent", SiteContentSchema);
