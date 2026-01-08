const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail, getEmailTemplate } = require("../services/emailService");
const { default: mongoose } = require("mongoose");
const Setting = require("../models/Setting");
const Log = require("../models/Log");
const { v4: uuidv4 } = require("uuid");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let transactionCommitted = false;

  try {
    const { firstName, lastName, userName, email, password, roles } = req.body;

    if (!firstName || !lastName || !email || !password) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }

    const emailDuplicate = await User.findOne({ email }).lean().exec();
    const settings = await Setting.findOne().lean().exec();

    if (emailDuplicate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Email already exists" });
    }

    if (userName) {
      const usernameDuplicate = await User.findOne({ userName }).lean().exec();
      if (usernameDuplicate) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    const newUser = {
      firstName,
      lastName,
      userName,
      email,
      password, // Let the User model pre-save hook handle hashing
      roles: roles || ["admin"],
      emailVerified: settings?.hotelInfo?.requireEmailVerification === false,
      lastLogin: new Date(),
    };

    const userArray = await User.create([newUser], { session });
    const createdUser = userArray[0];

    if (!createdUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid user data" });
    }

    // Commit transaction BEFORE email operations
    await session.commitTransaction();
    transactionCommitted = true;
    session.endSession();

    // Generate verification token (after commit)
    const verificationToken = jwt.sign(
      { email: createdUser.email, id: createdUser._id },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    await Log.create({
      logId: uuidv4(),
      type: "email_signup",
      message: `${createdUser.email} signed up`,
      details: {
        userId: createdUser._id,
        info: { email: createdUser.email },
      },
    });

    // Send verification email (after commit)
    let emailSent = false;
    let emailError = null;

    if (!createdUser.emailVerified) {
      try {
        const template = await getEmailTemplate(
          "verification",
          createdUser,
          verificationToken
        );
        if (template) {
          const emailResult = await sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
          });
          emailSent = emailResult.success;
        }
      } catch (emailErr) {
        console.error("Email sending error:", emailErr);
        emailError = emailErr.message;
      }
    }

    res.status(201).json({
      success: true,
      message: createdUser.emailVerified
        ? "Account created successfully!"
        : emailSent
        ? "Account created successfully! Please check your email to verify your account."
        : "Account created successfully! However, there was an issue sending the verification email.",
      emailSent,
      userInfo: {
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        emailVerified: createdUser.emailVerified,
      },
    });
  } catch (error) {
    if (!transactionCommitted) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("Error aborting transaction:", abortError);
      }
    }
    if (session) session.endSession();
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email }).select("+password").exec();
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.emailVerified) {
    return res.status(401).json({
      success: false,
      message: "Please verify your email before signing in",
      emailVerificationRequired: true,
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
      roles: user.roles,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Update last login and refresh token
  user.lastLogin = new Date();
  user.refreshToken = refreshToken;
  await user.save();

  await Log.create({
    logId: uuidv4(),
    type: "login",
    message: `${user.email} logged in`,
    details: { userId: user._id },
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userData = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roles: user.roles,
  };

  res.json({
    success: true,
    user: userData,
    accessToken,
  });
});

// @desc    Refresh token
// @route   GET /api/auth/refresh
// @access  Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id).exec();

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    };

    res.json({ user: userData, accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken }).exec();
  if (user) {
    user.refreshToken = "";
    await user.save();

    await Log.create({
      logId: uuidv4(),
      type: "logout",
      message: `${user.email} logged out`,
      details: { userId: user._id },
    });
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  res.json({ message: "Logged out successfully" });
});

// @desc    Send verification email
// @route   POST /api/auth/send-verification
// @access  Public
const sendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).exec();

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.emailVerified) {
    return res.status(400).json({ message: "Email is already verified" });
  }

  const verificationToken = jwt.sign(
    { email: user.email, id: user._id },
    process.env.EMAIL_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const template = await getEmailTemplate(
    "verification",
    user,
    verificationToken
  );
  if (!template) {
    return res
      .status(500)
      .json({ message: "Verification template not configured" });
  }

  const emailResult = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });

  res.json({
    success: emailResult.success,
    message: emailResult.success
      ? "Verification email sent successfully"
      : "Failed to send verification email",
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.emailVerified) {
      return res.json({
        message: "Email already verified",
        alreadyVerified: true,
      });
    }

    user.emailVerified = true;
    await user.save();

    await Log.create({
      logId: uuidv4(),
      type: "email_verified",
      message: `${user.email} verified their email`,
      details: { userId: user._id },
    });

    // Send welcome email if template exists
    try {
      const template = await getEmailTemplate("welcome", user);
      if (template) {
        await sendEmail({
          to: user.email,
          subject: template.subject,
          html: template.html,
        });
      }
    } catch (err) {
      console.error("Welcome email error:", err);
    }

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired", expired: true });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).exec();

  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = jwt.sign(
    { email: user.email, id: user._id },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const template = await getEmailTemplate("password_reset", user, resetToken);
  if (!template) {
    return res.status(500).json({ message: "Reset template not configured" });
  }

  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });

  res.json({ success: true, message: "Password reset email sent" });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    user.refreshToken = ""; // Invalidate active sessions
    await user.save();

    await Log.create({
      logId: uuidv4(),
      type: "password_reset",
      message: `${user.email} reset their password`,
      details: { userId: user._id },
    });

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

module.exports = {
  signup,
  login,
  refresh,
  logout,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
