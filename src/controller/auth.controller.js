const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tokenBlacklistModel = require("../models/blacklist.models");
// const sendEmail = require("../services/email.service");  // ❌ disabled
// const { generateOtp, getOtpHtml } = require("../utils/utils"); // ❌ not needed now
const otpModel = require("../models/otp.model");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

// ✅ HARDCODED OTP FOR DEMO (since email service is not working)
const DEMO_OTP = "123456";

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(401).json({
      message: "user already exists with same username or email",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  // 🔒 Use hardcoded OTP instead of generating
  const otp = DEMO_OTP;
  const otpHash = await bcrypt.hash(otp, 10);

  await otpModel.create({
    email,
    user: user._id,
    otpHash,
  });

  console.log(`✅ Demo OTP for ${email} is: ${otp}`);

  res.status(201).json({
    message: "user created successfully. Use 123456 as OTP to verify your email.",
    demoOtpNote: "Use 123456 as OTP (email service disabled)",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $and: [{ username }, { email }],
  });

  if (!user) {
    return res.status(401).json({
      message: "user doesn't exist with such username or email",
    });
  }

  if (!user.verified) {
    return res.status(401).json({
      message: "email is not verified",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "password must be valid",
    });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET
  );

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    message: "user login successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function logoutUser(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  res.clearCookie("token", cookieOptions);

  res.status(200).json({
    message: "user logout successfully",
  });
}

async function getmeController(req, res) {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  res.status(200).json({
    message: "user detail fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function verifyEmail(req, res) {
  const { otp, email } = req.body || {};

  if (!otp || !email) {
    return res.status(400).json({
      message: "otp and email are required",
    });
  }

  const otpdoc = await otpModel.findOne({ email }).sort({ createdAt: -1 });

  if (!otpdoc) {
    return res.status(400).json({
      message: "OTP expired or not found",
    });
  }

  const isOtpValid = await bcrypt.compare(otp, otpdoc.otpHash);

  if (!isOtpValid) {
    return res.status(400).json({
      message: "Invalid OTP. Please use 123456",
    });
  }

  const user = await userModel.findByIdAndUpdate(
    otpdoc.user,
    { verified: true },
    { new: true }
  );

  await otpModel.deleteMany({ user: otpdoc.user });

  return res.status(200).json({
    message: "email verified successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getmeController,
  verifyEmail,
};
