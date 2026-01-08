const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  caption: String,
  category: {
    type: String,
    enum: ['Exterior', 'Lobby', 'Rooms', 'Dining', 'Facilities', 'Other'],
    default: 'Other'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', GallerySchema);
