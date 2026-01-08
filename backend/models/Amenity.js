const mongoose = require('mongoose');

const AmenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add amenity name']
  },
  description: String,
  icon: String, // URL or icon class name
  category: {
    type: String,
    default: 'General'
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Amenity', AmenitySchema);
