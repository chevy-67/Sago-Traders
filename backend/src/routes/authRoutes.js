const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const protect = require("../middlewares/authMiddleware");

router.post('/google', authController.googleLogin)
router.post('/admin/login', authController.adminLogin)
router.get("/me", protect, authController.getMe);

router.get("/profile", protect, authController.getMe); // Alias to getMe
router.put("/profile", protect, authController.updateProfile);

module.exports = router