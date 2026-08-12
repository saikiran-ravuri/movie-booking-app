const router = require('express').Router();
const { register, login } = require('../Controllers/userController');

// user register route
router.post('/register', register);

// user login route
router.post('/login', login);

module.exports = router;
