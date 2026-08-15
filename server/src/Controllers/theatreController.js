const TheatreModel = require("../Models/theatreModel");

const createTheatre = async (req, res) => {
    if (req.userDetails && req.userDetails._id) {
        req.body.theatreOwner = req.userDetails._id;
    }

    try {
        const newTheatre = new TheatreModel(req.body);
        const response = await newTheatre.save();

        return res.status(201).send({
            success: true,
            message: "Theatre added successfully",
            data: response,
        });
    } catch (err) {
        return res.status(500).send({ message: "Internal Server Error", err: err.message || err });
    }
};

const fetchAllTheatres = async (req, res) => {
    try {
        const allTheatres = await TheatreModel.find({}).populate("theatreOwner");

        return res.status(200).send({
            success: true,
            message: "Theatre fetched successfully",
            data: allTheatres,
        });
    } catch (err) {
        return res.status(500).send({ message: "Internal Server Error", err: err.message || err });
    }
};

module.exports = { createTheatre, fetchAllTheatres };