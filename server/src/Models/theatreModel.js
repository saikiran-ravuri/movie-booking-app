const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        // phone: {
        //     type: Number,
        //     required: true,
        // },
        email: {
            type: String,
            required: true,
        },
        theatreOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const TheatreModel = mongoose.model("Theatres", theatreSchema);

module.exports = TheatreModel;