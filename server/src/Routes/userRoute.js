const router = require('express').Router();
const { register, login, getCurrentUser, forgetPassword, resetPassword } = require('../Controllers/userController');
const { verifyToken, verifyAdmin } = require('../Middlewares/authMiddleware');

// user register route (POST only)
router.post('/register', register);

// user login route (POST only)
router.post('/login', login);

// protected route to fetch current logged in user details using verifyToken authMiddleware
router.get('/get-current-user', verifyToken, getCurrentUser);

// forget password route (POST /api/users/forget)
router.post('/forget', forgetPassword);

// reset password route (POST /api/users/reset)
router.post('/reset', resetPassword);

// protected admin route to test verifyAdmin authorization middleware (returns only success and message)
const adminHandler = (req, res) => {
    res.status(200).send({
        success: true,
        message: `Welcome Admin ${req.userDetails ? req.userDetails.name : ''}! Authorization verified successfully.`
    });
};

router.get('/admin-test', [verifyToken, verifyAdmin], adminHandler);
router.post('/admin-test', [verifyToken, verifyAdmin], adminHandler);

module.exports = router;
