const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const protect = require("../middlewares/authMiddleware");

router.post('/send-otp',authController.sendOTP)
router.post('/verify-otp',authController.verifyOTP)
router.get("/me", protect, authController.getMe);

module.exports = router