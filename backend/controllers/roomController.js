const asyncHandler = require("express-async-handler");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

// ====================
// PUBLIC ROUTES
// ====================

/**
 * @desc    Get all active rooms (for public website)
 * @route   GET /api/rooms
 * @access  Public
 */
const getAllRooms = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    minCapacity,
    featured,
    sort = "pricePerNight",
    order = "asc",
  } = req.query;

  // Build query
  const query = { isActive: true };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }

  // Filter by capacity
  if (minCapacity) {
    query["maxOccupancy.total"] = { $gte: Number(minCapacity) };
  }

  // Filter by featured
  if (featured === "true") {
    query.isFeatured = true;
  }

  // Build sort object
  const sortOrder = order === "desc" ? -1 : 1;
  const sortObj = { [sort]: sortOrder };

  // Fetch rooms
  const rooms = await Room.find(query).select("-__v").sort(sortObj).lean();

  // Get primary image for each room
  const roomsWithPrimaryImage = rooms.map((room) => ({
    ...room,
    primaryImage:
      room.images.find((img) => img.isPrimary) || room.images[0] || null,
  }));

  res.status(200).json({
    success: true,
    count: roomsWithPrimaryImage.length,
    data: roomsWithPrimaryImage,
  });
});

/**
 * @desc    Get single room by ID or slug
 * @route   GET /api/rooms/:identifier
 * @access  Public
 */
const getRoomById = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Check if identifier is a valid ObjectId or slug
  let room;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    room = await Room.findById(identifier);
  } else {
    room = await Room.findOne({ slug: identifier });
  }

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Increment view count
  room.viewCount += 1;
  await room.save();

  res.status(200).json({
    success: true,
    data: room,
  });
});

/**
 * @desc    Get featured rooms
 * @route   GET /api/rooms/featured
 * @access  Public
 */
const getFeaturedRooms = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 3;

  const rooms = await Room.find({ isActive: true, isFeatured: true })
    .select("-__v")
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const roomsWithPrimaryImage = rooms.map((room) => ({
    ...room,
    primaryImage:
      room.images.find((img) => img.isPrimary) || room.images[0] || null,
  }));

  res.status(200).json({
    success: true,
    count: roomsWithPrimaryImage.length,
    data: roomsWithPrimaryImage,
  });
});

/**
 * @desc    Get room categories
 * @route   GET /api/rooms/categories
 * @access  Public
 */
const getRoomCategories = asyncHandler(async (req, res) => {
  const categories = await Room.distinct("category", { isActive: true });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

/**
 * @desc    Check room availability for date range
 * @route   GET /api/rooms/:id/availability
 * @access  Public
 */
const checkRoomAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    res.status(400);
    throw new Error("Check-in and check-out dates are required");
  }

  const room = await Room.findById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Validate dates
  if (checkInDate >= checkOutDate) {
    res.status(400);
    throw new Error("Check-out date must be after check-in date");
  }

  if (checkInDate < new Date()) {
    res.status(400);
    throw new Error("Check-in date cannot be in the past");
  }

  // Count overlapping bookings
  const overlappingBookings = await Booking.countDocuments({
    roomId: id,
    status: { $in: ["pending", "confirmed", "checked-in"] },
    $or: [
      { checkIn: { $lte: checkInDate }, checkOut: { $gt: checkInDate } },
      { checkIn: { $lt: checkOutDate }, checkOut: { $gte: checkOutDate } },
      { checkIn: { $gte: checkInDate }, checkOut: { $lte: checkOutDate } },
    ],
  });

  const availableUnits = room.numberOfRooms - overlappingBookings;
  const isAvailable = availableUnits > 0;

  // Calculate number of nights
  const numberOfNights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = room.pricePerNight * numberOfNights;

  res.status(200).json({
    success: true,
    data: {
      isAvailable,
      availableUnits,
      totalUnits: room.numberOfRooms,
      pricePerNight: room.pricePerNight,
      numberOfNights,
      totalPrice,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    },
  });
});

// ====================
// ADMIN ROUTES
// ====================

/**
 * @desc    Get all rooms (including inactive) - Admin only
 * @route   GET /api/admin/rooms
 * @access  Private/Admin
 */
const getAllRoomsAdmin = asyncHandler(async (req, res) => {
  const {
    category,
    isActive,
    isFeatured,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = req.query;

  // Build query
  const query = {};

  if (category) query.category = category;
  if (isActive !== undefined) query.isActive = isActive === "true";
  if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";

  // Build sort
  const sortOrder = order === "desc" ? -1 : 1;
  const sortObj = { [sort]: sortOrder };

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Fetch rooms
  const rooms = await Room.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const total = await Room.countDocuments(query);

  res.status(200).json({
    success: true,
    count: rooms.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: rooms,
  });
});

/**
 * @desc    Create new room
 * @route   POST /api/admin/rooms
 * @access  Private/Admin
 */
const createRoom = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    shortDescription,
    fullDescription,
    pricePerNight,
    weekendPrice,
    maxOccupancy,
    bedConfiguration,
    roomSize,
    numberOfRooms,
    amenities,
    isFeatured,
    isActive,
  } = req.body;

  // Validation
  if (
    !name ||
    !category ||
    !shortDescription ||
    !fullDescription ||
    !pricePerNight ||
    !maxOccupancy ||
    !bedConfiguration
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Generate slug from name
  //   const slug = name
  //     .toLowerCase()
  //     .replace(/[^a-z0-9]+/g, "-")
  //     .replace(/(^-|-$)/g, "");

  //   // Check if slug already exists
  //   const existingRoom = await Room.findOne({ slug });
  //   if (existingRoom) {
  //     res.status(400);
  //     throw new Error("A room with this name already exists");
  //   }

  // Create room
  const room = await Room.create({
    name,
    category,
    shortDescription,
    fullDescription,
    pricePerNight,
    weekendPrice,
    maxOccupancy: {
      adults: maxOccupancy.adults,
      children: maxOccupancy.children || 0,
      total: maxOccupancy.adults + (maxOccupancy.children || 0),
    },
    bedConfiguration,
    roomSize,
    numberOfRooms: numberOfRooms || 1,
    amenities: amenities || [],
    images: [],
    isFeatured: isFeatured || false,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

/**
 * @desc    Update room
 * @route   PUT /api/admin/rooms/:id
 * @access  Private/Admin
 */
const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let room = await Room.findById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // If name is being updated, regenerate slug
  if (req.body.name && req.body.name !== room.name) {
    const newSlug = req.body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if new slug already exists
    const existingRoom = await Room.findOne({
      slug: newSlug,
      _id: { $ne: id },
    });
    if (existingRoom) {
      res.status(400);
      throw new Error("A room with this name already exists");
    }

    req.body.slug = newSlug;
  }

  // If maxOccupancy is being updated, recalculate total
  if (req.body.maxOccupancy) {
    req.body.maxOccupancy.total =
      (req.body.maxOccupancy.adults || room.maxOccupancy.adults) +
      (req.body.maxOccupancy.children || room.maxOccupancy.children || 0);
  }

  // Update room
  room = await Room.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

/**
 * @desc    Delete room
 * @route   DELETE /api/admin/rooms/:id
 * @access  Private/Admin
 */
const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await Room.findById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Check if room has any active bookings
  const activeBookings = await Booking.countDocuments({
    room: id,
    status: { $in: ["pending", "confirmed", "checked-in"] },
    checkOut: { $gte: new Date() },
  });

  if (activeBookings > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete room. It has ${activeBookings} active booking(s). Please cancel or complete those bookings first.`
    );
  }

  // Delete room images from cloudinary
  if (room.images && room.images.length > 0) {
    for (const image of room.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }
  }

  // Delete room
  await Room.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
    data: {},
  });
});

/**
 * @desc    Toggle room active status
 * @route   PATCH /api/admin/rooms/:id/toggle-status
 * @access  Private/Admin
 */
const toggleRoomStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await Room.findById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  room.isActive = !room.isActive;
  await room.save();

  res.status(200).json({
    success: true,
    message: `Room ${room.isActive ? "activated" : "deactivated"} successfully`,
    data: {
      id: room._id,
      name: room.name,
      isActive: room.isActive,
    },
  });
});

/**
 * @desc    Toggle room featured status
 * @route   PATCH /api/admin/rooms/:id/toggle-featured
 * @access  Private/Admin
 */
const toggleFeaturedStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await Room.findById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  room.isFeatured = !room.isFeatured;
  await room.save();

  res.status(200).json({
    success: true,
    message: `Room ${
      room.isFeatured ? "marked as featured" : "removed from featured"
    }`,
    data: {
      id: room._id,
      name: room.name,
      isFeatured: room.isFeatured,
    },
  });
});

/**
 * @desc    Upload room images
 * @route   POST /api/admin/rooms/:id/images
 * @access  Private/Admin
 */
const uploadRoomImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await Room.findById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Please upload at least one image");
  }

  // Files are already uploaded to Cloudinary by multer
  const uploadedImages = req.files.map((file, index) => ({
    url: file.path,
    publicId: file.filename,
    caption: "",
    isPrimary: room.images.length === 0 && index === 0, // First image is primary if no existing images
    order: room.images.length + index,
  }));

  // Add images to room
  room.images.push(...uploadedImages);
  await room.save();

  res.status(200).json({
    success: true,
    message: `${uploadedImages.length} image(s) uploaded successfully`,
    data: room.images,
  });
});

/**
 * @desc    Update room image details
 * @route   PUT /api/admin/rooms/:id/images/:imageId
 * @access  Private/Admin
 */
const updateRoomImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;
  const { caption, isPrimary, order } = req.body;

  const room = await Room.findById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  const image = room.images.id(imageId);

  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  // If setting as primary, unset all other primary images
  if (isPrimary === true) {
    room.images.forEach((img) => {
      img.isPrimary = false;
    });
  }

  // Update image
  if (caption !== undefined) image.caption = caption;
  if (isPrimary !== undefined) image.isPrimary = isPrimary;
  if (order !== undefined) image.order = order;

  await room.save();

  res.status(200).json({
    success: true,
    message: "Image updated successfully",
    data: room.images,
  });
});

/**
 * @desc    Delete room image
 * @route   DELETE /api/admin/rooms/:id/images/:imageId
 * @access  Private/Admin
 */
const deleteRoomImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const room = await Room.findById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  const image = room.images.id(imageId);

  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  // Delete from cloudinary
  if (image.publicId) {
    await cloudinary.uploader.destroy(image.publicId);
  }

  // Remove image from array
  room.images.pull(imageId);

  // If deleted image was primary, make first image primary
  if (image.isPrimary && room.images.length > 0) {
    room.images[0].isPrimary = true;
  }

  await room.save();

  res.status(200).json({
    success: true,
    message: "Image deleted successfully",
    data: room.images,
  });
});

/**
 * @desc    Get room statistics
 * @route   GET /api/admin/rooms/:id/stats
 * @access  Private/Admin
 */
const getRoomStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await Room.findById(id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Get booking statistics
  const totalBookings = await Booking.countDocuments({ room: id });

  const confirmedBookings = await Booking.countDocuments({
    room: id,
    status: "confirmed",
  });

  const upcomingBookings = await Booking.countDocuments({
    room: id,
    status: { $in: ["pending", "confirmed"] },
    checkIn: { $gte: new Date() },
  });

  const totalRevenue = await Booking.aggregate([
    {
      $match: {
        room: mongoose.Types.ObjectId(id),
        status: { $in: ["confirmed", "checked-out"] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$grandTotal" },
      },
    },
  ]);

  const recentBookings = await Booking.find({ room: id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select(
      "bookingReference guest.firstName guest.lastName checkIn checkOut status grandTotal"
    )
    .lean();

  res.status(200).json({
    success: true,
    data: {
      room: {
        id: room._id,
        name: room.name,
        category: room.category,
        pricePerNight: room.pricePerNight,
        viewCount: room.viewCount,
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        upcoming: upcomingBookings,
      },
      revenue: {
        total: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      },
      recentBookings,
    },
  });
});

/**
 * @desc    Bulk update rooms
 * @route   PATCH /api/admin/rooms/bulk-update
 * @access  Private/Admin
 */
const bulkUpdateRooms = asyncHandler(async (req, res) => {
  const { roomIds, updates } = req.body;

  if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
    res.status(400);
    throw new Error("Please provide an array of room IDs");
  }

  if (!updates || Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error("Please provide updates");
  }

  // Perform bulk update
  const result = await Room.updateMany(
    { _id: { $in: roomIds } },
    { $set: updates },
    { runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} room(s) updated successfully`,
    data: {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    },
  });
});

// Export all controllers
module.exports = {
  // Public routes
  getAllRooms,
  getRoomById,
  getFeaturedRooms,
  getRoomCategories,
  checkRoomAvailability,

  // Admin routes
  getAllRoomsAdmin,
  createRoom,
  updateRoom,
  deleteRoom,
  toggleRoomStatus,
  toggleFeaturedStatus,
  uploadRoomImages,
  updateRoomImage,
  deleteRoomImage,
  getRoomStats,
  bulkUpdateRooms,
};
