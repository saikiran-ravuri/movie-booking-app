const mongoose = require("mongoose");

// movie schema definition
const movieSchema = new mongoose.Schema({
    movieName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    poster: {
        type: String,
        required: true
    }
}, { timestamps: true });

// create movie model from schema
const MovieModel = mongoose.model("movies_scalerAug25", movieSchema);

module.exports = MovieModel;
