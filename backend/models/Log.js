const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  logId: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: [
      "system",
      "error",
      "request",
      "email_signup",
      "email_verified",
      "password_reset",
      "login",
      "logout",
    ],
    default: "system",
  },
  level: {
    type: String,
    enum: ["info", "warn", "error", "critical"],
    default: "info",
  },
  message: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: "30d", // Optional: MongoDB TTL index to auto-delete after 30 days
  },
});

// Index for efficient querying and cleanup
logSchema.index({ timestamp: -1 });
logSchema.index({ type: 1, level: 1 });

module.exports = mongoose.model("Log", logSchema);
