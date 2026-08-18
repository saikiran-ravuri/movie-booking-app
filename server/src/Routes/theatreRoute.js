const router = require('express').Router();
const { createTheatre, fetchAllTheatres } = require('../Controllers/theatreController');
const { verifyToken, verifyAdmin } = require('../Middlewares/authMiddleware');

router.get('/', [verifyToken], fetchAllTheatres);
router.post('/', [verifyToken, verifyAdmin], createTheatre);

module.exports = router;