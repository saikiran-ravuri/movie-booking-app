const router = require('express').Router();
const { createTheatre, fetchAllTheatres } = require('../Controllers/theatreController');
const { verifyToken, verifyAdmin } = require('../Middlewares/authMiddleware');

// fetch all theatres route
router.get('/', [verifyToken], fetchAllTheatres);

// create theatre route (authenticated & admin authorized)
router.post('/', [verifyToken, verifyAdmin], createTheatre);

module.exports = router;