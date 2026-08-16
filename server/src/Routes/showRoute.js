const router = require('express').Router();
const { createNewShow, getAllShows, getShowById, getTheatesAndShowsByMovieId } = require('../Controllers/showController');
const { verifyToken, verifyAdmin } = require('../Middlewares/authMiddleware');

// fetch all shows route
router.get('/', [verifyToken], getAllShows);

// fetch shows & theatres by movie id route (public for movie details page)
router.get('/movies/:movieId', getTheatesAndShowsByMovieId);

// fetch show by id route
router.get('/:id', getShowById);

// create new show route (authenticated & admin authorized)
router.post('/', [verifyToken, verifyAdmin], createNewShow);

module.exports = router;