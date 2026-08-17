import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { GetShowDetails } from "../../api/show";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, message, Row } from "antd";
import { createBooking, makePayment } from "../../api/booking";
import StripeCheckout from "react-stripe-checkout";

function BookShow() {
    const params = useParams();
    const showId = params.showId || params.id;
    const navigate = useNavigate();

    const [showDetails, setShowDetails] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchShowData();
    }, [showId]);

    const fetchShowData = async () => {
        if (showId) {
            const showResponse = await GetShowDetails(showId);
            if (showResponse && showResponse.data) {
                setShowDetails(showResponse.data);
            }
        }
    };

    // Direct booking flow without payment gateway
    const handleBooking = async () => {
        if (!selectedSeats || selectedSeats.length === 0) return;

        setLoading(true);
        const mockTransactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const bookingRequest = {
            show: showId,
            seats: [...selectedSeats],
            transactionId: mockTransactionId
        };

        const bookingResponse = await createBooking(bookingRequest);
        setLoading(false);

        if (bookingResponse && bookingResponse.success) {
            message.success(bookingResponse.message || "Booking created successfully");
            navigate("/");
        } else {
            message.error(bookingResponse ? bookingResponse.message : "Booking failed");
        }
    };

    // Stripe checkout payment flow
    const onToken = async (token) => {
        console.log("Token generated ", token);

        const paymentRequest = {
            token: token.id,
            amount: selectedSeats.length * (showDetails ? showDetails.ticketPrice : 0) * 100
        };

        setLoading(true);
        const response = await makePayment(paymentRequest);

        if (response && response.success) {
            message.success(response.message || "Payment successful");

            const bookingRequest = {
                show: showId,
                seats: [...selectedSeats],
                transactionId: response.transactionId
            };

            const bookingResponse = await createBooking(bookingRequest);
            setLoading(false);

            if (bookingResponse && bookingResponse.success) {
                message.success(bookingResponse.message || "Booking created successfully");
                navigate("/");
            } else {
                message.error(bookingResponse ? bookingResponse.message : "Booking failed");
            }
        } else {
            setLoading(false);
            message.error(response ? response.message : "Payment failed");
        }
    };

    const getSeats = () => {
        const totalSeats = showDetails ? showDetails.totalSeats : 120;
        const columns = 12;
        const rows = Math.ceil(totalSeats / columns);

        let allRows = [];
        for (let i = 0; i < rows; i++) {
            allRows.push(i);
        }

        let allColumns = [];
        for (let i = 0; i < columns; i++) {
            allColumns.push(i);
        }

        const handleSeatSelect = (seatNumber) => {
            if (!selectedSeats.includes(seatNumber)) {
                setSelectedSeats([...selectedSeats, seatNumber]);
                return;
            }

            const updatedSeats = selectedSeats.filter((seat) => seat !== seatNumber);
            setSelectedSeats(updatedSeats);
        };

        const bookedSeats = (showDetails && showDetails.bookedSeats) || [];

        return (
            <div>
                <div className="seat-ul">
                    {allRows.map((row) => (
                        <div key={row} className="seat-ul">
                            {allColumns.map((col) => {
                                let seatNumber = row * columns + col + 1;
                                let seatClass = "seat-btn";

                                const isSeatBooked = bookedSeats.includes(seatNumber);
                                const isSeatSelected = selectedSeats.includes(seatNumber);

                                if (isSeatBooked) {
                                    seatClass += " booked";
                                }

                                if (isSeatSelected) {
                                    seatClass += " selected";
                                }

                                return (
                                    <button
                                        key={seatNumber}
                                        disabled={isSeatBooked}
                                        onClick={() => handleSeatSelect(seatNumber)}
                                        className={seatClass}
                                    >
                                        {`${seatNumber}`}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="mt-3 mx-auto bottom-card max-width-600">
                    <div> Selected Seats : <span> {selectedSeats.join(", ")} </span> </div>
                    <div> Total Price : Rs. <span> {selectedSeats.length * (showDetails ? showDetails.ticketPrice : 0)} </span> </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Navbar />

            {showDetails == null && (
                <div className="text-center">
                    <h2> Fetching Seat View ....</h2>
                </div>
            )}

            {showDetails && (
                <div>
                    <Row>
                        <Col>
                            <Card
                                title={
                                    <div>
                                        <h1> {showDetails.movie ? showDetails.movie.movieName : ''} </h1>
                                        <p> {showDetails.theatre ? showDetails.theatre.name : ''} </p>
                                        <p> {showDetails.theatre ? showDetails.theatre.address : ''} </p>
                                    </div>
                                }
                                extra={
                                    <div className="ms-3">
                                        <div>
                                            <h4> Date : {showDetails.showDate} </h4>
                                        </div>
                                        <div>
                                            <h4> Time : {showDetails.showTime} </h4>
                                        </div>
                                        <div>
                                            <h4> Ticket Price : {showDetails.ticketPrice} </h4>
                                        </div>
                                        <div>
                                            <h4>
                                                Total Seats : {showDetails.totalSeats} | Available Seats : {showDetails.totalSeats - (showDetails.bookedSeats || []).length}
                                            </h4>
                                        </div>
                                    </div>
                                }
                                style={{ width: "100vw" }}
                            >
                                {getSeats()}
                            </Card>
                        </Col>
                    </Row>

                    {selectedSeats.length > 0 && (
                        <div className="text-center my-4 flex items-center justify-center gap-4">
                            <button
                                disabled={loading}
                                onClick={handleBooking}
                                className="px-6 py-2 bg-slate-900 text-white rounded-lg cursor-pointer hover:bg-slate-800 disabled:opacity-60"
                            >
                                {loading ? "Booking..." : "Book Seats Directly"}
                            </button>

                            <StripeCheckout
                                token={onToken}
                                stripeKey={(typeof process !== 'undefined' && process.env && process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) ? process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY : (import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51U5IIOP4CdTODxXhkTAL1UuG4TaF13mRILXYjzDCp2dKH9dE63iAmQbinoSXM50BfyJGa665uhdFtRRIfq1z4B8300I62rgUnc")}
                                amount={selectedSeats.length * (showDetails ? showDetails.ticketPrice : 0) * 100}
                                currency="INR"
                            >
                                <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg cursor-pointer hover:bg-emerald-700">
                                    Pay with Card (Stripe)
                                </button>
                            </StripeCheckout>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default BookShow;
