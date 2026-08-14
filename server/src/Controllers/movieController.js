const mongoose = require("mongoose");
const MovieModel = require("../Models/movieModel");

// get all movies controller
const getAllMovies = async (req, res) => {
    try {
        // fetch all movies from database
        const allMovies = await MovieModel.find({});

        // send success response with movies data
        return res.status(200).send({
            success: true,
            message: "All movies fetched Successfully",
            data: allMovies
        });
    } catch (err) {
        // send error response on failure
        return res.status(500).send({ success: false, message: "Internal Server Error", err });
    }
};

// create movie controller (admin authorized only)
const createMovie = async (req, res) => {
    try {
        // create new movie instance with request body
        const newMovie = new MovieModel(req.body);

        // save movie record into database
        const dbResponse = await newMovie.save();

        if (dbResponse != null) {
            // send success response with created movie data
            return res.status(201).send({
                success: true,
                message: "New Movie Created Sucessfully",
                data: dbResponse
            });
        }
    } catch (err) {
        // send error response on failure
        return res.status(500).send({ success: false, message: "Internal Server Error", err });
    }
};

// get single movie details controller
const getMovieDetails = async (req, res) => {
    try {
        // extract movie id from request params
        const movieId = req.params.id;

        // validate if movie id is valid mongodb objectid format
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).send({
                success: false,
                message: "Movie Id format is invalid"
            });
        }

        // find movie details by id in database
        const movieDetails = await MovieModel.findById(movieId);

        if (!movieDetails) {
            return res.status(400).send({
                success: false,
                message: `MovieId ${movieId} doesnot exists in our systems`
            });
        }

        // send success response with movie details
        return res.status(200).send({
            success: true,
            message: "Movie Data Fetched Successfully",
            data: movieDetails
        });
    } catch (err) {
        // send error response on failure
        return res.status(500).send({ success: false, message: "Internal Server Error", err });
    }
};

module.exports = { getAllMovies, createMovie, getMovieDetails };
