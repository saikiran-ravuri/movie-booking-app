const mongoose = require("mongoose");
const MovieModel = require("../Models/movieModel");

// get all movies
const getAllMovies = async (req, res) => {
    try {
        const allMovies = await MovieModel.find({});

        return res.status(200).send({
            success: true,
            message: "All movies fetched Successfully",
            data: allMovies
        });
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", err });
    }
};

// create movie
const createMovie = async (req, res) => {
    try {
        const newMovie = new MovieModel(req.body);
        const dbResponse = await newMovie.save();

        if (dbResponse != null) {
            return res.status(201).send({
                success: true,
                message: "New Movie Created Sucessfully",
                data: dbResponse
            });
        }
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", err });
    }
};

// get movie details
const getMovieDetails = async (req, res) => {
    try {
        const movieId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).send({
                success: false,
                message: "Movie Id format is invalid"
            });
        }

        const movieDetails = await MovieModel.findById(movieId);

        if (!movieDetails) {
            return res.status(400).send({
                success: false,
                message: `MovieId ${movieId} doesnot exists in our systems`
            });
        }

        return res.status(200).send({
            success: true,
            message: "Movie Data Fetched Successfully",
            data: movieDetails
        });
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", err });
    }
};

module.exports = { getAllMovies, createMovie, getMovieDetails };
