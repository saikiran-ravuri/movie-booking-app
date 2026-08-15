const router = require('express').Router();
const { getAllMovies, createMovie, getMovieDetails } = require('../Controllers/movieController');
const { verifyToken, verifyAdmin } = require('../Middlewares/authMiddleware');

// get all movies route
router.get('/', getAllMovies);

// get single movie details route
router.get('/:id', getMovieDetails);

// create movie route (authenticated & admin authorized)
router.post('/', [verifyToken, verifyAdmin], createMovie);

module.exports = router;
