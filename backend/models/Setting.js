const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    // Hotel Information
    hotelInfo: {
      name: {
        type: String,
        required: true,
        default: "Suave By Chloe",
      },
      tagline: {
        type: String,
        default: "Experience Luxury in Abuja",
      },
      description: {
        type: String,
        default:
          "A premier hotel offering exceptional comfort, world-class amenities, and impeccable service in the heart of Kubwa.",
      },
      address: {
        type: String,
        required: true,
        default: "Kubwa, Abuja, Nigeria",
      },
      city: {
        type: String,
        default: "Abuja",
      },
      state: {
        type: String,
        default: "FCT",
      },
      country: {
        type: String,
        default: "Nigeria",
      },
      postalCode: {
        type: String,
        default: "901101",
      },
      phone: {
        type: String,
        required: true,
        default: "+234 800 123 4567",
      },
      email: {
        type: String,
        required: true,
        default: "info@suavebychloe.com",
      },
      website: {
        type: String,
        default: "https://suavebychloe.com",
      },
      checkInTime: {
        type: String,
        default: "14:00",
      },
      checkOutTime: {
        type: String,
        default: "12:00",
      },
      timezone: {
        type: String,
        default: "Africa/Lagos",
      },
      currency: {
        type: String,
        default: "NGN",
      },
      currencySign: {
        type: String,
        default: "₦",
      },
      totalRooms: {
        type: Number,
        default: 45,
      },
      starRating: {
        type: Number,
        default: 5,
      },
      logo: {
        url: String,
        publicId: String,
      },
      gallery: [
        {
          url: String,
          publicId: String,
        },
      ],
      // Singleton enforcer
      isSingleton: {
        type: Number,
        default: 1,
        unique: true,
        select: false,
      },
      requireEmailVerification: {
        type: Boolean,
        default: true,
      },
    },

    // Taxes & Fees
    taxesAndFees: [
      {
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "percentage",
        },
        rate: {
          type: Number,
          default: 0,
        },
        amount: {
          type: Number,
          default: 0,
        },
        description: String,
        appliesTo: {
          type: String,
          enum: ["all", "per_night", "per_stay", "services"],
          default: "all",
        },
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Policies
    policies: {
      cancellation: {
        freeCancellationHours: {
          type: Number,
          default: 48,
        },
        cancellationFee: {
          type: Number,
          default: 50000,
        },
        noShowFee: {
          type: Number,
          default: 100000,
        },
        description: String,
      },
      deposit: {
        required: {
          type: Boolean,
          default: true,
        },
        amountType: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "percentage",
        },
        amount: {
          type: Number,
          default: 30,
        },
        dueHours: {
          type: Number,
          default: 24,
        },
        description: String,
      },
      checkIn: {
        earlyCheckIn: {
          type: Boolean,
          default: true,
        },
        earlyCheckInFee: {
          type: Number,
          default: 15000,
        },
        lateCheckIn: {
          type: Boolean,
          default: true,
        },
        latestCheckInTime: {
          type: String,
          default: "22:00",
        },
        description: String,
      },
      children: {
        childrenAllowed: {
          type: Boolean,
          default: true,
        },
        maxChildrenAge: {
          type: Number,
          default: 12,
        },
        extraBedFee: {
          type: Number,
          default: 25000,
        },
        cribAvailable: {
          type: Boolean,
          default: true,
        },
        cribFee: {
          type: Number,
          default: 10000,
        },
        description: String,
      },
      pets: {
        petsAllowed: {
          type: Boolean,
          default: false,
        },
        petFee: {
          type: Number,
          default: 25000,
        },
        maxPets: {
          type: Number,
          default: 1,
        },
        description: String,
      },
      smoking: {
        smokingAllowed: {
          type: Boolean,
          default: false,
        },
        smokingFee: {
          type: Number,
          default: 150000,
        },
        description: String,
      },
      // Additional Global Policy Settings
      sendPolicyConfirmation: {
        type: Boolean,
        default: true,
      },
      requirePolicyAcceptance: {
        type: Boolean,
        default: false,
      },
      displayPolicies: {
        type: Boolean,
        default: true,
      },
    },

    // Email Templates
    emailTemplates: [
      {
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        subject: {
          type: String,
          required: true,
        },
        enabled: {
          type: Boolean,
          default: true,
        },
        lastModified: {
          type: Date,
          default: Date.now,
        },
        variables: [String],
        content: String, // HTML content
        sendDelay: {
          type: Number, // in hours
          default: 24,
        },
        format: {
          type: String,
          enum: ["html", "plain", "both"],
          default: "html",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Enforce singleton: only allow one document to exist
settingSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    if (count > 0) {
      return next(new Error("Only one settings document can exist."));
    }
  }
  next();
});

// Settings is a singleton, so we'll typically have only one document.
// You might want to enforce this in your controller/service layer.
const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
