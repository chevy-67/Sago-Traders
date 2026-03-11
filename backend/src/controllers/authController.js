const Otp = require("../models/Otp");
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const generateOTP = require("../utils/generateOTP");
const sendSMS = require("../services/smsService");

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;

  const otp = generateOTP();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  // Remove existing OTP for same phone
  await Otp.deleteMany({ phone });
  await Otp.create({
    phone,
    otp,
    expiresAt
  });

  await sendSMS(phone, otp);

  res.json({ message: "OTP sent successfully" });
};


exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  const existingOTP = await Otp.findOne({ phone });

  if (!existingOTP) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }

  if (existingOTP.attempts >= 3) {
    return res.status(400).json({ message: "Too many attempts" });
  }

  if (existingOTP.otp !== otp) {
    existingOTP.attempts += 1;
    await existingOTP.save();
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP correct → delete it
  await Otp.deleteMany({ phone });

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token,
    user
  });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-__v");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, alternatePhone, gender, dateOfBirth, address } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (alternatePhone) user.alternatePhone = alternatePhone;
    if (gender !== undefined) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (address) {
      user.address = {
        ...user.address,
        ...address
      };
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
