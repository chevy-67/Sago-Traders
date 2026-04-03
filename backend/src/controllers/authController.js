const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
console.log("DEBUG: Google Client ID loaded:", process.env.GOOGLE_CLIENT_ID ? "Yes (length " + process.env.GOOGLE_CLIENT_ID.length + ")" : "No");


exports.googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }

  try {
    // Verify the id_token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user by googleId; fall back to matching by email
    let user = await User.findOne({ googleId });

    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        // Link the Google account to the existing user
        user.googleId = googleId;
        if (!user.profilePicture) user.profilePicture = picture;
        await user.save();
      }
    }

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        profilePicture: picture,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("DEBUG: Google login error detail:", error);
    res.status(401).json({
      message: "Invalid Google credential",
      error: error.message
    });
  }
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
    const { name, email, phone, alternatePhone, gender, dateOfBirth, address } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
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

exports.adminLogin = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};
