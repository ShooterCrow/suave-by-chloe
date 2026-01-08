const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader =
    req.headers.authorization ||
    req.headers.Authorization ||
    req.headers["authorization"] ||
    req.headers["Authorization"];

  if (authHeader && authHeader.startsWith("Bearer")) {
    // Set token from Bearer token in header
    token = authHeader.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    res.status(401);
    throw new Error("Not authorized to access this route");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    if (!req.user.emailVerified) {
      // Optional: Enforce email verification at middleware level if needed
      // This depends on the specific route requirements
    }

    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized to access this route");
  }
});

// Grant access to specific roles
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (
      !req.user ||
      !req.user.roles.some((role) => allowedRoles.includes(role))
    ) {
      res.status(403);
      throw new Error(
        `User roles ${req.user.roles.join(
          ", "
        )} are not authorized to access this route`
      );
    }
    next();
  };
};

// Admin only (Shorthand for authorize('admin'))
exports.admin = (req, res, next) => {
  if (req.user && req.user.roles.includes("admin")) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};
