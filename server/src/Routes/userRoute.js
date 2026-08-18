const router = require('express').Router();
const { register, login, getCurrentUser, forgetPassword, resetPassword } = require('../Controllers/userController');
const { verifyToken, verifyAdmin } = require('../Middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/get-current-user', verifyToken, getCurrentUser);
router.post('/forget', forgetPassword);
router.post('/reset', resetPassword);

const adminHandler = (req, res) => {
    res.status(200).send({
        success: true,
        message: `Welcome Admin ${req.userDetails ? req.userDetails.name : ''}! Authorization verified successfully.`
    });
};

router.get('/admin-test', [verifyToken, verifyAdmin], adminHandler);
router.post('/admin-test', [verifyToken, verifyAdmin], adminHandler);

module.exports = router;
