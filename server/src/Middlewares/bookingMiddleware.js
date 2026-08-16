const mongoose = require("mongoose");
const ShowModel = require("../Models/showModle");

const validateCreateBookingRequest = async (req, res, next) => {
    const { show, seats } = req.body;

    if (!show || !mongoose.Types.ObjectId.isValid(show)) {
        return res.status(400).send({ success: false, message: "Invalid Show Id Format" });
    }

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
        return res.status(400).send({ success: false, message: "Please select at least one seat" });
    }

    try {
        const showDetails = await ShowModel.findById(show);

        if (!showDetails) {
            return res.status(400).send({ success: false, message: "Invalid Show Id" });
        }

        const bookedSeats = showDetails.bookedSeats || [];

        const isAnySeatBooked = seats.some((seat) => bookedSeats.includes(seat));
        if (isAnySeatBooked) {
            return res.status(400).send({ success: false, message: "Seats passed are already booked" });
        }

        next();
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};

module.exports = {
    validateCreateBookingRequest,
};