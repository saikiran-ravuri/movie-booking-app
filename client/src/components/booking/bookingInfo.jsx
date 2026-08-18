import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { GetShowDetails } from '../../api/show';
import { useParams } from 'react-router-dom';
import { createBooking, makePayment } from '../../api/booking';
import StripeCheckout from 'react-stripe-checkout';
import TicketModal from './TicketModal';

function BookingInfo() {
  const params = useParams();
  const showId = params.showId || params.id;

  const [showDetails, setShowDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (showId) {
      GetShowDetails(showId).then((res) => {
        if (res && res.data) {
          setShowDetails(res.data);
        }
      });
    }
  }, [showId]);

  const getSeatLabel = (seatNum) => {
    const columns = 12;
    const rowIndex = Math.floor((seatNum - 1) / columns);
    const colIndex = ((seatNum - 1) % columns) + 1;
    const rowLetter = String.fromCharCode(65 + rowIndex);
    return `${rowLetter}${colIndex}`;
  };

  const onToken = async (token) => {
    const amount = selectedSeats.length * (showDetails ? showDetails.ticketPrice : 0) * 100;
    setLoading(true);

    const response = await makePayment({ token: token.id, amount });

    if (response && response.success) {
      const bookingRequest = {
        show: showId,
        seats: [...selectedSeats],
        transactionId: response.transactionId,
        bookingDate: showDetails?.showDate
      };

      const bookingResponse = await createBooking(bookingRequest);
      setLoading(false);

      if (bookingResponse && bookingResponse.success) {
        setTicketData(bookingResponse.data || { _id: bookingResponse.message?.split(' ')?.pop(), transactionId: response.transactionId });
      } else {
        setErrorMsg(bookingResponse ? bookingResponse.message : 'Booking failed');
      }
    } else {
      setLoading(false);
      setErrorMsg(response ? response.message : 'Payment failed');
    }
  };

  const handleCloseTicketModal = () => {
    setTicketData(null);
  };

  const totalSeats = showDetails ? showDetails.totalSeats : 120;
  const columns = 12;
  const rows = Math.ceil(totalSeats / columns);
  const bookedSeats = (showDetails && showDetails.bookedSeats) || [];

  const handleSeatSelect = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    if (!selectedSeats.includes(seatNumber)) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    }
  };

  const stripeKey = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
    ? process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
    : (import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51U5IIOP4CdTODxXhkTAL1UuG4TaF13mRILXYjzDCp2dKH9dE63iAmQbinoSXM50BfyJGa665uhdFtRRIfq1z4B8300I62rgUnc');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      {ticketData && (
        <TicketModal
          bookingData={ticketData}
          showDetails={showDetails}
          selectedSeats={selectedSeats}
          getSeatLabel={getSeatLabel}
          onClose={handleCloseTicketModal}
        />
      )}

      {errorMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md">
          {errorMsg}
        </div>
      )}

      {!showDetails ? (
        <div className="text-center py-12 text-slate-500 font-semibold text-sm">
          Loading show details...
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-950">{showDetails.movie ? showDetails.movie.movieName : ''}</h1>
              <p className="text-xs text-slate-500">{showDetails.theatre ? showDetails.theatre.name : ''} - {showDetails.theatre ? showDetails.theatre.address : ''}</p>
            </div>
            <div className="text-right text-xs font-bold text-slate-700">
              <p>Date: {showDetails.showDate}</p>
              <p>Time: {showDetails.showTime}</p>
              <p>Price: ₹{showDetails.ticketPrice}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 text-center">
            <div className="space-y-2">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1.5">
                  {Array.from({ length: columns }).map((_, colIndex) => {
                    const seatNumber = rowIndex * columns + colIndex + 1;
                    if (seatNumber > totalSeats) return null;
                    const isBooked = bookedSeats.includes(seatNumber);
                    const isSelected = selectedSeats.includes(seatNumber);

                    return (
                      <button
                        key={seatNumber}
                        disabled={isBooked}
                        onClick={() => handleSeatSelect(seatNumber)}
                        className={`w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          isBooked
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-slate-950 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {selectedSeats.length > 0 && (
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="text-left text-xs font-bold text-slate-700">
                  <p>Selected: {selectedSeats.map(getSeatLabel).join(', ')}</p>
                  <p>Total: ₹{selectedSeats.length * showDetails.ticketPrice}</p>
                </div>

                <StripeCheckout
                  token={onToken}
                  stripeKey={stripeKey}
                  amount={selectedSeats.length * showDetails.ticketPrice * 100}
                  currency="INR"
                >
                  <button
                    disabled={loading}
                    className="px-6 py-2.5 bg-slate-950 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-800 disabled:opacity-60"
                  >
                    {loading ? 'Processing...' : 'Pay with Card'}
                  </button>
                </StripeCheckout>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingInfo;
