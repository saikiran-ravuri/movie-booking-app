const express = require('express');
const router = express.Router();
const { registerUser } = require('../Controllers/userController');

// User Registration Route
router.post('/register', registerUser);

module.exports = router;
