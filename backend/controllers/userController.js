const User = require("../models/User");
const asyncHandler = require("express-async-handler");

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Manager,Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Manager,Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password -refreshToken").lean();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

/**
 * @desc    Update user
 * @route   PATCH /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, userName, email, roles } = req.body;

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if email or username is already taken by another user
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email }).lean().exec();
    if (emailExists) {
      return res.status(409).json({ message: "Email already in use" });
    }
    user.email = email;
  }

  if (userName && userName !== user.userName) {
    const userNameExists = await User.findOne({ userName }).lean().exec();
    if (userNameExists) {
      return res.status(409).json({ message: "Username already in use" });
    }
    user.userName = userName;
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (roles) user.roles = roles;

  const updatedUser = await user.save();

  res.json({
    message: `${updatedUser.userName} updated successfully`,
    user: {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      userName: updatedUser.userName,
      email: updatedUser.email,
      roles: updatedUser.roles,
    },
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();

  res.json({ message: `User ${user.userName} deleted` });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -refreshToken"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
};
