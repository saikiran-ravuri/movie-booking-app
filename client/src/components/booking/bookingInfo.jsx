import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Navbar from '../mainhome/Navbar';
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
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-[clamp(0.65rem,0.8vw,0.875rem)] font-semibold px-5 py-2.5 rounded-full shadow-lg">
          {errorMsg}
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto px-[clamp(0.5rem,2vw,2rem)] py-[clamp(0.75rem,1.8vw,1.5rem)] w-full space-y-[clamp(0.75rem,1.5vw,1.5rem)]">
        {!showDetails ? (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-12 px-8 flex flex-col items-center justify-center shadow-xs">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-4" />
            <p className="text-slate-600 font-semibold text-xs sm:text-sm">Loading Show Details...</p>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-[clamp(0.75rem,1.8vw,1.8rem)] px-[clamp(0.75rem,2.2vw,2.5rem)] flex flex-row items-center justify-between gap-[clamp(0.75rem,2vw,2rem)] shadow-xs">
              <div className="space-y-1 text-left min-w-0 flex-1">
                <h1 className="text-[clamp(1rem,2vw,2rem)] font-extrabold tracking-tight text-slate-950 truncate">
                  {showDetails.movie ? showDetails.movie.movieName : 'Movie Booking'}
                </h1>
                <p className="text-[clamp(0.6rem,0.78vw,0.75rem)] font-medium text-slate-500 truncate">
                  {showDetails.theatre ? `${showDetails.theatre.name} — ${showDetails.theatre.address}` : ''}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-[clamp(0.25rem,0.5vw,0.75rem)] shrink-0">
                <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-600 text-[clamp(0.52rem,0.68vw,0.6875rem)] font-semibold">
                  Date: {showDetails.showDate}
                </span>
                <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-600 text-[clamp(0.52rem,0.68vw,0.6875rem)] font-semibold">
                  Time: {showDetails.showTime}
                </span>
                <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-600 text-[clamp(0.52rem,0.68vw,0.6875rem)] font-semibold">
                  ₹{showDetails.ticketPrice}
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-[clamp(0.75rem,1.8vw,1.8rem)] px-[clamp(0.5rem,2vw,2.5rem)] space-y-[clamp(0.75rem,1.5vw,1.5rem)] shadow-xs">
              <div className="overflow-x-auto pb-2 no-scrollbar max-w-full flex justify-center">
                <div className="space-y-[clamp(0.25rem,0.5vw,0.625rem)] min-w-max px-2">
                  {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-[clamp(2px,0.4vw,6px)]">
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
                            className={`w-[clamp(15px,2.2vw,28px)] h-[clamp(15px,2.2vw,28px)] rounded-[clamp(4px,0.5vw,8px)] text-[clamp(6px,0.7vw,10px)] font-bold transition-all flex items-center justify-center cursor-pointer ${isBooked
                                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-slate-950 text-white border border-slate-950 scale-105 shadow-2xs'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-2xs'
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
                <div className="pt-[clamp(0.75rem,1.5vw,1.5rem)] flex flex-row items-center justify-between gap-[clamp(0.75rem,2vw,1.5rem)] border-t border-slate-100">
                  <div className="space-y-[clamp(0.1rem,0.25vw,0.25rem)] text-left min-w-0 flex-1">
                    <p className="text-[clamp(0.55rem,0.7vw,0.75rem)] font-semibold text-slate-500 uppercase tracking-wider">
                      Selected Seats
                    </p>
                    <p className="text-[clamp(0.65rem,0.8vw,0.875rem)] font-bold text-slate-900 truncate">
                      Seats: <span className="font-extrabold text-slate-950">{selectedSeats.map(getSeatLabel).join(', ')}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-[clamp(0.75rem,2vw,1.5rem)] shrink-0">
                    <div className="text-right">
                      <p className="text-[clamp(0.55rem,0.68vw,0.6875rem)] font-semibold text-slate-500 uppercase tracking-wider">Total Price</p>
                      <p className="text-[clamp(0.95rem,1.8vw,1.5rem)] font-extrabold text-slate-950 leading-none">
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
                        className="h-[clamp(1.75rem,2.2vw,2.5rem)] px-[clamp(0.75rem,1.5vw,1.5rem)] bg-white border border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-slate-950 text-[clamp(0.62rem,0.8vw,0.875rem)] font-bold rounded-xl flex items-center justify-center gap-[clamp(0.25rem,0.4vw,0.5rem)] transition-colors cursor-pointer disabled:opacity-60 group/btn shadow-xs shrink-0"
                      >
                        <span>{loading ? 'Processing...' : 'Proceed to Pay'}</span>
                        <ArrowRight className="w-[clamp(0.7rem,0.9vw,0.875rem)] h-[clamp(0.7rem,0.9vw,0.875rem)] text-slate-600 group-hover/btn:translate-x-0.5 transition-transform" />
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
