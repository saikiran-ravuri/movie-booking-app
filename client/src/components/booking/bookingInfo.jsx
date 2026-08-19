import { useEffect, useState } from 'react';
import Navbar from '../Navbar';
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
        if (res?.data) {
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

    if (response?.success) {
      const bookingRequest = {
        show: showId,
        seats: [...selectedSeats],
        transactionId: response.transactionId,
        bookingDate: showDetails?.showDate
      };

      const bookingResponse = await createBooking(bookingRequest);
      setLoading(false);

      if (bookingResponse?.success) {
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

  const totalSeats = showDetails?.totalSeats || 120;
  const columns = 12;
  const rows = Math.ceil(totalSeats / columns);
  const bookedSeats = showDetails?.bookedSeats || [];

  const handleSeatSelect = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    if (!selectedSeats.includes(seatNumber)) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    }
  };

  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col justify-between select-none">
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
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
          {errorMsg}
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {!showDetails ? (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-12 px-8 flex flex-col items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-4" />
            <p className="text-slate-600 font-semibold text-sm">Loading Show Details...</p>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-6 sm:py-8 px-6 sm:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                  {showDetails.movie ? showDetails.movie.movieName : 'Movie Booking'}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  {showDetails.theatre ? `${showDetails.theatre.name} — ${showDetails.theatre.address}` : ''}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-semibold">
                  Date: {showDetails.showDate}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-semibold">
                  Time: {showDetails.showTime}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-semibold">
                  ₹{showDetails.ticketPrice}
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-6 sm:py-8 px-6 sm:px-10 space-y-6">
              <div className="overflow-x-auto pb-2 no-scrollbar max-w-full flex justify-center">
                <div className="space-y-2.5">
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
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSeatSelect(seatNumber)}
                            className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                              isBooked
                                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                : isSelected
                                ? 'bg-slate-950 text-white border border-slate-950 scale-105'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            {seatNumber}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Selected Seats
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Seats: <span className="font-extrabold text-slate-950">{selectedSeats.map(getSeatLabel).join(', ')}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Price</p>
                      <p className="text-xl sm:text-2xl font-extrabold text-slate-950">
                        ₹{selectedSeats.length * showDetails.ticketPrice}
                      </p>
                    </div>

                    <StripeCheckout
                      token={onToken}
                      stripeKey={stripeKey}
                      amount={selectedSeats.length * showDetails.ticketPrice * 100}
                      currency="INR"
                    >
                      <button
                        type="button"
                        disabled={loading}
                        className="px-6 py-2.5 bg-slate-950 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {loading ? 'Processing...' : 'Proceed to Pay'}
                      </button>
                    </StripeCheckout>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default BookingInfo;
