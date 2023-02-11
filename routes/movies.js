const router = require('express').Router();
const {getMovies, createMovies, deleteMovies} = require('../controllers/movies');
const {moviesCreateValidation, deleteMovieValidation} = require('../middleware/validate');

router.get('', getMovies);

router.post('', moviesCreateValidation, createMovies);

router.delete('/:movieId', deleteMovieValidation, deleteMovies);

module.exports = router;