const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        show: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shows',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        seats: {
            type: Array,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
        },
        bookingDate: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const BookingsModel = mongoose.model("Bookings", bookingSchema);

module.exports = BookingsModel;