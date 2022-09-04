const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

// Initializing router
const router = express.Router();

// Register new user
router.post('/signup', registerUser)

// Login User
router.post('/sign-in', loginUser)


module.exports = router

