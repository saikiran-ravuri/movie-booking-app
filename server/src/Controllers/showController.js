const mongoose = require("mongoose");
const MovieModel = require("../Models/movieModel");
const ShowModel = require("../Models/showModle");
const TheatreModel = require("../Models/theatreModel");
const BookingsModel = require("../Models/bookingModel");

// create new show
const createNewShow = async (req, res) => {
    const { theatre, movie } = req.body;

    try {
        const theatreObj = await TheatreModel.findById(theatre);
        if (theatreObj == null) {
            return res.status(400).send({
                success: false,
                message: "TheatreId passed is invalid",
            });
        }

        const movieObj = await MovieModel.findById(movie);
        if (movieObj == null) {
            return res.status(400).send({
                success: false,
                message: "MovieId passed is invalid",
            });
        }

        const newShow = new ShowModel(req.body);
        const dbResponse = await newShow.save();

        if (dbResponse != null) {
            return res.status(201).send({
                success: true,
                message: "New Show Created Successfully",
                data: dbResponse,
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            err: err.message || err,
        });
    }
};

// get all shows
const getAllShows = async (req, res) => {
    try {
        const allShows = await ShowModel.find({}).populate("theatre").populate("movie");

        return res.status(200).send({
            success: true,
            message: "Shows fetched successfully",
            data: allShows,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            err: err.message || err,
        });
    }
};

// get show by id
const getShowById = async (req, res) => {
    try {
        const showId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(showId)) {
            return res.status(400).send({
                success: false,
                message: "Show Id format is invalid",
            });
        }

        const showDetails = await ShowModel.findById(showId).populate("theatre").populate("movie");

        if (!showDetails) {
            return res.status(400).send({
                success: false,
                message: `ShowId ${showId} does not exist in our systems`,
            });
        }

        const showObj = showDetails.toObject();
        const targetDate = req.query.date || req.query.showDate;

        if (targetDate) {
            const dateBookings = await BookingsModel.find({
                show: showId,
                $or: [
                    { bookingDate: targetDate },
                    { bookingDate: { $regex: `^${targetDate}` } }
                ]
            });

            let dateBookedSeats = [];
            dateBookings.forEach((b) => {
                if (Array.isArray(b.seats)) {
                    dateBookedSeats.push(...b.seats);
                }
            });

            showObj.bookedSeats = dateBookedSeats;
        }

        return res.status(200).send({
            success: true,
            message: "Show Data Fetched Successfully",
            data: showObj,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            err: err.message || err,
        });
    }
};

// get theatres and shows by movie id
const getTheatesAndShowsByMovieId = async (req, res) => {
    try {
        const movieId = req.params.movieId;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).send({
                success: false,
                message: "movie Id format is invalid",
            });
        }

        const allShows = await ShowModel.find({ movie: movieId }).populate('theatre').populate('movie');

        let showsByTheatreId = {};

        allShows.forEach((show) => {
            if (!show.theatre) return;
            const theatreId = show.theatre._id ? show.theatre._id.toString() : show.theatre.toString();

            if (!showsByTheatreId[theatreId]) {
                showsByTheatreId[theatreId] = [];
            }

            showsByTheatreId[theatreId].push(show);
        });

        return res.status(200).send({
            success: true,
            data: showsByTheatreId,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            err: err.message || err,
        });
    }
};

module.exports = {
    createNewShow,
    getAllShows,
    getShowById,
    getTheatesAndShowsByMovieId,
    getTheatresAndShowsByMovieId: getTheatesAndShowsByMovieId,
};