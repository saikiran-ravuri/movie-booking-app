const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
    {
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movies',
            required: true,
        },
        theatre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Theatres',
            required: true,
        },
        showDate: {
            type: Date,
            required: true,
        },
        showTime: {
            type: String,
            required: true,
        },
        totalSeats: {
            type: Number,
            required: true,
        },
        ticketPrice: {
            type: Number,
            required: true,
            default: 500,
        },
        bookedSeats: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const ShowModel = mongoose.model('Shows', showSchema);

module.exports = ShowModel;
