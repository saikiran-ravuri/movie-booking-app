const router = require('express').Router();
const { getAllMovies, createMovie, getMovieDetails } = require('../Controllers/movieController');
const { verifyToken, verifyAdmin } = require('../Middlewares/authMiddleware');

router.get('/', getAllMovies);
router.get('/:id', getMovieDetails);
router.post('/', [verifyToken, verifyAdmin], createMovie);

module.exports = router;
