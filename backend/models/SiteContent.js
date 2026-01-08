const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
  aboutUs: String,
  heroTitle: String,
  heroSubtitle: String,
  contactInfo: {
    address: String,
    phone: String,
    email: String,
    mapCoordinates: {
      lat: Number,
      lng: Number
    }
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  bookingComUrl: String,
  policies: {
    cancellation: String,
    privacy: String,
    terms: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SiteContent', SiteContentSchema);
