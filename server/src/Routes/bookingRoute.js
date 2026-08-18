const router = require('express').Router();
const { createBooking, makePayment } = require("../Controllers/bookingController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const { validateCreateBookingRequest } = require("../Middlewares/bookingMiddleware");

router.post("/payments", [verifyToken], makePayment);
router.post("/bookings", [verifyToken, validateCreateBookingRequest], createBooking);

module.exports = router;