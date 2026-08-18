const router = require('express').Router();
const { createNewShow, getAllShows, getShowById, getTheatesAndShowsByMovieId } = require('../Controllers/showController');
const { verifyToken, verifyAdmin } = require('../Middlewares/authMiddleware');

router.get('/', [verifyToken], getAllShows);
router.get('/movies/:movieId', getTheatesAndShowsByMovieId);
router.get('/:id', getShowById);

router.post('/', [verifyToken, verifyAdmin], createNewShow);

module.exports = router;