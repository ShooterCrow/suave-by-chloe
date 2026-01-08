const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: [true, "Please add guest name"],
  },
  email: {
    type: String,
    required: [true, "Please add email"],
  },
  phone: {
    type: String,
    required: [true, "Please add phone number"],
  },
  checkInDate: {
    type: Date,
    required: [true, "Please add check-in date"],
  },
  checkOutDate: {
    type: Date,
    required: [true, "Please add check-out date"],
  },
  roomId: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
    required: true,
  },
  numberOfGuests: {
    adults: { type: Number, required: true },
    children: { type: Number, default: 0 },
  },
  specialRequests: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "checked-in"],
    default: "pending",
  },
  totalNights: Number,
  estimatedPrice: Number,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
