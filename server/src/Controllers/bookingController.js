const BookingsModel = require("../Models/bookingModel");
const ShowModel = require("../Models/showModle");
const { sendEmail } = require("../utils/EmailUtils");
const { bookingConfirmationTemplate } = require("../Templates/bookingConfirmation");
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.stripe_key;
const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;

// make payment
const makePayment = async (req, res) => {
    const { token, amount } = req.body;

    console.log(token, amount);

    try {
        if (!stripe) {
            const mockTransactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            return res.status(200).send({
                success: true,
                message: "Payment successful",
                transactionId: mockTransactionId
            });
        }

        const customer = await stripe.customers.create({
            email: req.userDetails.email,
            source: token
        });

        const paymentIntent = await stripe.paymentIntents.create({
            customer: customer.id,
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card']
        });

        console.log(paymentIntent);

        return res.status(200).send({
            success: true,
            message: "Payment successful",
            transactionId: paymentIntent.id
        });
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", err });
    }
};

// create booking
const createBooking = async (req, res) => {
    const { show, seats, transactionId } = req.body;
    const userId = req.userDetails._id;

    try {
        const newBooking = new BookingsModel({ show, seats, transactionId, user: userId });
        const newBookingResponse = await newBooking.save();

        const showDetails = await ShowModel.findById(show).populate("movie").populate("theatre");

        const updatedBookedSeats = [...showDetails.bookedSeats, ...seats];

        await ShowModel.findByIdAndUpdate(show, {
            bookedSeats: updatedBookedSeats
        });

        // send booking confirmation email
        const { subject, body } = bookingConfirmationTemplate(
            req.userDetails,
            showDetails,
            newBookingResponse
        );

        sendEmail([req.userDetails.email], subject, body);

        return res.status(201).send({
            success: true,
            message: `Booking successfully created with ${newBookingResponse._id}`,
            data: newBookingResponse
        });

    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal Server Error", err });
    }
};

module.exports = {
    createBooking,
    makePayment
};