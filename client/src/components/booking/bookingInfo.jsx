import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { GetShowDetails } from "../../api/show";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, message, Row } from "antd";
import { createBooking } from "../../api/booking";

function BookShow() {
    const params = useParams();
    const showId = params.showId || params.id;
    const navigate = useNavigate();

    const [showDetails, setShowDetails] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleBooking = async () => {
        const mockTransactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const bookingRequest = {
            show: showId,
            seats: [...selectedSeats],
            transactionId: mockTransactionId
        };

        const bookingResponse = await createBooking(bookingRequest);
        if (bookingResponse && bookingResponse.success) {
            message.success(bookingResponse.message || "Booking created successfully");
            navigate("/");
        } else {
            message.error(bookingResponse ? bookingResponse.message : "Booking failed");
        }
    };

    useEffect(() => {
        fetchShowData();
    }, []);

    const fetchShowData = async () => {
        if (showId) {
            const showResponse = await GetShowDetails(showId);
            if (showResponse && showResponse.data) {
                setShowDetails(showResponse.data);
            }
        }
    };

    const getSeats = () => {
        const totalSeats = showDetails.totalSeats || 120;
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

        const bookedSeats = showDetails.bookedSeats || [];

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

                                if (isSeatBooked) seatClass += " booked";
                                if (isSeatSelected) seatClass += " selected";

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
                    <div> Total Price : Rs. <span> {selectedSeats.length * showDetails.ticketPrice} </span> </div>
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
                        <div className="text-center my-4">
                            <button onClick={handleBooking} className="px-6 py-2 bg-slate-900 text-white rounded-lg cursor-pointer">
                                Book Seats
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default BookShow;
