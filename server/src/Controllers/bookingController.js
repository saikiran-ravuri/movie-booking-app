const BookingsModel = require("../Models/bookingModel");
const ShowModel = require("../Models/showModle");
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;

const makePayment = async (req, res) => {
    const { token, amount } = req.body;

    console.log(token, amount);

    try {
        if (!stripe) {
            // Mock transaction fallback when Stripe key is not set in environment
            const mockTransactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            return res.status(200).send({
                success: true,
                message: "Payment successful",
                transactionId: mockTransactionId
            });
        }

        // create a new stripe customer 
        const customer = await stripe.customers.create({
            email: req.userDetails.email,
            source: token
        });

        // create the payment intent 
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