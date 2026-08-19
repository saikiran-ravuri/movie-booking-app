import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import { ArrowRight } from 'lucide-react';
import { createBooking, makePayment } from '../../api/booking';
import TicketModal from '../booking/TicketModal';

function SeatsPrice({ selectedSeats, ticketPrice, showId, showDetails, getSeatLabel, onBookingSuccess }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryDate = searchParams.get('date');
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [bookedSeatsList, setBookedSeatsList] = useState([]);

  if ((!selectedSeats || selectedSeats.length === 0) && !ticketData) return null;

  const activeSeats = ticketData ? bookedSeatsList : selectedSeats;
  const totalPrice = activeSeats.length * ticketPrice;
  const bookingShowDate = showDetails?.showDate || queryDate || new Date().toISOString().split('T')[0];

  const onToken = async (token) => {
    const userToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!userToken) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const paymentResponse = await makePayment({
        token: token.id,
        amount: totalPrice * 100
      });

      if (paymentResponse?.success) {
        const bookingRequest = {
          show: showId,
          seats: [...selectedSeats],
          transactionId: paymentResponse.transactionId || paymentResponse.data,
          bookingDate: bookingShowDate
        };

        const bookingResponse = await createBooking(bookingRequest);
        setLoading(false);

        if (bookingResponse?.success) {
          setSuccessPopup(true);
          setBookedSeatsList([...selectedSeats]);

          const uniqueId = (bookingResponse.data && (bookingResponse.data._id || bookingResponse.data.id)) ||
            (bookingResponse.booking && bookingResponse.booking._id) ||
            'BK_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

          const fullBookingTicket = {
            _id: uniqueId,
            show: {
              ...showDetails,
              showDate: bookingShowDate
            },
            seats: [...selectedSeats],
            transactionId: paymentResponse.transactionId || 'TXN' + Date.now(),
            bookingDate: bookingShowDate,
            totalPaid: totalPrice
          };

          try {
            const savedBookings = JSON.parse(localStorage.getItem('myBookingsList') || '[]');
            const updatedBookings = [fullBookingTicket, ...savedBookings.filter(b => b._id !== fullBookingTicket._id)];
            localStorage.setItem('myBookingsList', JSON.stringify(updatedBookings));
          } catch (e) {
            console.error("Storage error:", e);
          }

          setTicketData(fullBookingTicket);
        } else {
          setErrorPopup(bookingResponse ? bookingResponse.message : 'Booking failed');
          setTimeout(() => setErrorPopup(''), 4000);
        }
      } else {
        setLoading(false);
        const failureReason = paymentResponse ? paymentResponse.message : 'Payment Failed';
        setErrorPopup(failureReason);
        setTimeout(() => setErrorPopup(''), 4000);
      }
    } catch (err) {
      setLoading(false);
      const failureReason = err.message || 'Payment Failed';
      setErrorPopup(failureReason);
      setTimeout(() => setErrorPopup(''), 4000);
    }
  };

  const handleCloseTicketModal = () => {
    const seatsToClear = [...bookedSeatsList];
    setTicketData(null);
    setSuccessPopup(false);
    if (onBookingSuccess) {
      onBookingSuccess(seatsToClear);
    }
  };

  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  return (
    <>
      {ticketData && (
        <TicketModal
          bookingData={ticketData}
          showDetails={{
            ...showDetails,
            showDate: ticketData.bookingDate || showDetails?.showDate
          }}
          selectedSeats={activeSeats}
          getSeatLabel={getSeatLabel}
          onClose={handleCloseTicketModal}
        />
      )}

      {successPopup && !ticketData && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white text-[clamp(0.65rem,0.8vw,0.875rem)] font-semibold px-5 py-2.5 rounded-full shadow-lg">
          <span>Booking Completed Successfully</span>
        </div>
      )}

      {errorPopup && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-[clamp(0.65rem,0.8vw,0.875rem)] font-semibold px-5 py-2.5 rounded-full shadow-lg max-w-md text-center">
          <span>{errorPopup}</span>
        </div>
      )}

      {!ticketData && selectedSeats && selectedSeats.length > 0 && (
        <div className="select-none w-full">
          <div className="w-full relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-[clamp(0.75rem,1.5vw,1.25rem)] px-[clamp(0.75rem,2vw,2rem)] flex flex-row items-center justify-between gap-[clamp(0.75rem,2vw,1.5rem)] shadow-xs">
            <div className="space-y-[clamp(0.1rem,0.25vw,0.25rem)] text-left min-w-0 flex-1">
              <p className="text-[clamp(0.55rem,0.7vw,0.75rem)] font-semibold text-slate-500 uppercase tracking-wider">
                Selected Seats ({selectedSeats.length}/6)
              </p>
              <p className="text-[clamp(0.65rem,0.8vw,0.875rem)] font-bold text-slate-900 truncate">
                Seats: <span className="font-extrabold text-slate-950">{selectedSeats.sort((a, b) => a - b).map(getSeatLabel).join(', ')}</span>
              </p>
            </div>

            <div className="flex items-center gap-[clamp(0.75rem,2vw,1.5rem)] shrink-0">
              <div className="text-right">
                <p className="text-[clamp(0.55rem,0.68vw,0.6875rem)] font-semibold text-slate-500 uppercase tracking-wider">Total Price</p>
                <p className="text-[clamp(0.95rem,1.8vw,1.5rem)] font-extrabold text-slate-950 leading-none">₹{totalPrice}</p>
              </div>

              <StripeCheckout
                token={onToken}
                stripeKey={stripeKey}
                amount={totalPrice * 100}
                currency="INR"
                email={localStorage.getItem('userEmail') || ''}
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
        </div>
      )}
    </>
  );
}

export default SeatsPrice;
