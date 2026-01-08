const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const mongoose = require("mongoose");
// const sendEmail = require("../utils/sendEmail"); // Uncomment when you add email functionality

// ====================
// PUBLIC ROUTES
// ====================

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Public
 */
const createBooking = asyncHandler(async (req, res) => {
  const {
    guestName,
    email,
    phone,
    checkInDate,
    checkOutDate,
    roomId,
    numberOfGuests,
    specialRequests,
  } = req.body;

  // Validation
  if (
    !guestName ||
    !email ||
    !phone ||
    !checkInDate ||
    !checkOutDate ||
    !roomId ||
    !numberOfGuests
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if room exists
  const room = await Room.findById(roomId);
  if (!room || !room.isActive) {
    res.status(404);
    throw new Error("Room not found or not available");
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Validate dates
  if (checkIn >= checkOut) {
    res.status(400);
    throw new Error("Check-out date must be after check-in date");
  }

  if (checkIn < new Date()) {
    res.status(400);
    throw new Error("Check-in date cannot be in the past");
  }

  // Check capacity
  const totalGuests = numberOfGuests.adults + (numberOfGuests.children || 0);
  if (totalGuests > room.maxOccupancy.total) {
    res.status(400);
    throw new Error(
      `Room can only accommodate ${room.maxOccupancy.total} guests. You requested ${totalGuests} guests.`
    );
  }

  if (numberOfGuests.adults < 1) {
    res.status(400);
    throw new Error("At least one adult is required");
  }

  // Check availability
  const overlappingBookings = await Booking.countDocuments({
    roomId: roomId,
    status: { $in: ["pending", "confirmed", "checked-in"] },
    $or: [
      { checkInDate: { $lte: checkIn }, checkOutDate: { $gt: checkIn } },
      { checkInDate: { $lt: checkOut }, checkOutDate: { $gte: checkOut } },
      { checkInDate: { $gte: checkIn }, checkOutDate: { $lte: checkOut } },
    ],
  });

  const availableUnits = room.numberOfRooms - overlappingBookings;
  if (availableUnits <= 0) {
    res.status(400);
    throw new Error("Room is not available for the selected dates");
  }

  // Calculate nights and price
  const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const estimatedPrice = room.pricePerNight * totalNights;

  // Create booking
  const booking = await Booking.create({
    guestName,
    email,
    phone,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    roomId,
    numberOfGuests: {
      adults: numberOfGuests.adults,
      children: numberOfGuests.children || 0,
    },
    specialRequests: specialRequests || "",
    totalNights,
    estimatedPrice,
    status: "pending",
  });

  // Populate room details
  await booking.populate("roomId", "name category pricePerNight images");

  // TODO: Send confirmation email
  // await sendEmail({
  //   to: email,
  //   subject: 'Booking Confirmation',
  //   text: `Your booking has been received. Booking ID: ${booking._id}`
  // });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Public
 */
const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid booking ID");
  }

  const booking = await Booking.findById(id).populate(
    "roomId",
    "name category pricePerNight images amenities"
  );

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

/**
 * @desc    Get bookings by email
 * @route   GET /api/bookings/guest/:email
 * @access  Public
 */
const getBookingsByEmail = asyncHandler(async (req, res) => {
  const { email } = req.params;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const bookings = await Booking.find({ email })
    .populate("roomId", "name category pricePerNight images")
    .sort({ submittedAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

/**
 * @desc    Cancel booking (Guest can cancel pending bookings)
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Public
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body; // Verify email for security

  if (!email) {
    res.status(400);
    throw new Error("Email is required to cancel booking");
  }

  const booking = await Booking.findById(id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Verify email matches
  if (booking.email !== email) {
    res.status(403);
    throw new Error("You are not authorized to cancel this booking");
  }

  // Check if already cancelled
  if (booking.status === "cancelled") {
    res.status(400);
    throw new Error("Booking is already cancelled");
  }

  // Check if already checked-in
  if (booking.status === "checked-in") {
    res.status(400);
    throw new Error("Cannot cancel a booking that has been checked in");
  }

  // Update status
  booking.status = "cancelled";
  await booking.save();

  // TODO: Send cancellation email
  // await sendEmail({
  //   to: email,
  //   subject: 'Booking Cancelled',
  //   text: `Your booking ${id} has been cancelled successfully`
  // });

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
});

// ====================
// ADMIN ROUTES
// ====================

/**
 * @desc    Get all bookings - Admin only
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
const getAllBookingsAdmin = asyncHandler(async (req, res) => {
  const {
    status,
    roomId,
    startDate,
    endDate,
    sort = "submittedAt",
    order = "desc",
    page = 1,
    limit = 10,
    search,
  } = req.query;

  // Build query
  const query = {};

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by room
  if (roomId) {
    query.roomId = roomId;
  }

  // Filter by date range
  if (startDate && endDate) {
    query.checkInDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Search by guest name or email
  if (search) {
    query.$or = [
      { guestName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  // Build sort
  const sortOrder = order === "desc" ? -1 : 1;
  const sortObj = { [sort]: sortOrder };

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Fetch bookings
  const bookings = await Booking.find(query)
    .populate("roomId", "name category pricePerNight images")
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const total = await Booking.countDocuments(query);

  res.status(200).json({
    success: true,
    count: bookings.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: bookings,
  });
});

/**
 * @desc    Update booking status - Admin only
 * @route   PATCH /api/admin/bookings/:id/status
 * @access  Private/Admin
 */
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error("Status is required");
  }

  // Validate status
  const validStatuses = ["pending", "confirmed", "cancelled", "checked-in"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const booking = await Booking.findById(id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Update status
  booking.status = status;
  await booking.save();

  // Populate room details
  await booking.populate("roomId", "name category pricePerNight");

  // TODO: Send status update email
  // await sendEmail({
  //   to: booking.email,
  //   subject: `Booking ${status}`,
  //   text: `Your booking status has been updated to: ${status}`
  // });

  res.status(200).json({
    success: true,
    message: `Booking status updated to ${status}`,
    data: booking,
  });
});

/**
 * @desc    Update booking details - Admin only
 * @route   PUT /api/admin/bookings/:id
 * @access  Private/Admin
 */
const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let booking = await Booking.findById(id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // If dates are being updated, validate them
  if (req.body.checkInDate || req.body.checkOutDate) {
    const checkIn = req.body.checkInDate
      ? new Date(req.body.checkInDate)
      : booking.checkInDate;
    const checkOut = req.body.checkOutDate
      ? new Date(req.body.checkOutDate)
      : booking.checkOutDate;

    if (checkIn >= checkOut) {
      res.status(400);
      throw new Error("Check-out date must be after check-in date");
    }

    // Recalculate nights and price
    const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const room = await Room.findById(booking.roomId);
    req.body.totalNights = totalNights;
    req.body.estimatedPrice = room.pricePerNight * totalNights;
  }

  // Update booking
  booking = await Booking.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("roomId", "name category pricePerNight");

  res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    data: booking,
  });
});

/**
 * @desc    Delete booking - Admin only
 * @route   DELETE /api/admin/bookings/:id
 * @access  Private/Admin
 */
const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Prevent deletion of checked-in bookings
  if (booking.status === "checked-in") {
    res.status(400);
    throw new Error("Cannot delete a checked-in booking");
  }

  await Booking.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    data: {},
  });
});

/**
 * @desc    Get booking statistics - Admin only
 * @route   GET /api/admin/bookings/stats
 * @access  Private/Admin
 */
const getBookingStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Total bookings
  const totalBookings = await Booking.countDocuments();

  // Bookings by status
  const bookingsByStatus = await Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Today's check-ins
  const todayCheckIns = await Booking.countDocuments({
    checkInDate: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
    status: { $in: ["confirmed", "pending"] },
  });

  // Today's check-outs
  const todayCheckOuts = await Booking.countDocuments({
    checkOutDate: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
    status: "checked-in",
  });

  // Upcoming bookings (next 7 days)
  const upcomingBookings = await Booking.countDocuments({
    checkInDate: {
      $gte: today,
      $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    },
    status: { $in: ["confirmed", "pending"] },
  });

  // Total revenue (confirmed and checked-in)
  const revenueData = await Booking.aggregate([
    {
      $match: {
        status: { $in: ["confirmed", "checked-in"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$estimatedPrice" },
      },
    },
  ]);

  // Revenue this month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyRevenue = await Booking.aggregate([
    {
      $match: {
        submittedAt: { $gte: firstDayOfMonth },
        status: { $in: ["confirmed", "checked-in"] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$estimatedPrice" },
      },
    },
  ]);

  // Recent bookings
  const recentBookings = await Booking.find()
    .populate("roomId", "name category")
    .sort({ submittedAt: -1 })
    .limit(5)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      totalBookings,
      bookingsByStatus: bookingsByStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      todayCheckIns,
      todayCheckOuts,
      upcomingBookings,
      revenue: {
        total: revenueData.length > 0 ? revenueData[0].totalRevenue : 0,
        thisMonth: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0,
      },
      recentBookings,
    },
  });
});

/**
 * @desc    Get bookings for a specific room - Admin only
 * @route   GET /api/admin/rooms/:roomId/bookings
 * @access  Private/Admin
 */
const getRoomBookings = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { status, startDate, endDate } = req.query;

  // Check if room exists
  const room = await Room.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Build query
  const query = { roomId };

  if (status) {
    query.status = status;
  }

  if (startDate && endDate) {
    query.checkInDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Fetch bookings
  const bookings = await Booking.find(query).sort({ checkInDate: 1 }).lean();

  res.status(200).json({
    success: true,
    count: bookings.length,
    room: {
      id: room._id,
      name: room.name,
      category: room.category,
    },
    data: bookings,
  });
});

/**
 * @desc    Bulk update bookings - Admin only
 * @route   PATCH /api/admin/bookings/bulk-update
 * @access  Private/Admin
 */
const bulkUpdateBookings = asyncHandler(async (req, res) => {
  const { bookingIds, updates } = req.body;

  if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
    res.status(400);
    throw new Error("Please provide an array of booking IDs");
  }

  if (!updates || Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error("Please provide updates");
  }

  // Perform bulk update
  const result = await Booking.updateMany(
    { _id: { $in: bookingIds } },
    { $set: updates },
    { runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} booking(s) updated successfully`,
    data: {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    },
  });
});

// Export all controllers
module.exports = {
  // Public routes
  createBooking,
  getBookingById,
  getBookingsByEmail,
  cancelBooking,

  // Admin routes
  getAllBookingsAdmin,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  getBookingStats,
  getRoomBookings,
  bulkUpdateBookings,
};
