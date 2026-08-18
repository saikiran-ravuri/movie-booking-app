import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
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

  const stripeKey = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
    ? process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
    : (import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51U5IIOP4CdTODxXhkTAL1UuG4TaF13mRILXYjzDCp2dKH9dE63iAmQbinoSXM50BfyJGa665uhdFtRRIfq1z4B8300I62rgUnc');

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
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
          <span>Booking Completed Successfully</span>
        </div>
      )}

      {errorPopup && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg max-w-md text-center">
          <span>{errorPopup}</span>
        </div>
      )}

      {!ticketData && selectedSeats && selectedSeats.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 select-none">
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-5 sm:py-6 px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Selected Seats ({selectedSeats.length}/6)
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Seats: <span className="font-extrabold text-slate-950">{selectedSeats.sort((a, b) => a - b).map(getSeatLabel).join(', ')}</span>
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Price</p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-950">₹{totalPrice}</p>
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
                  className="px-6 py-2.5 bg-slate-950 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <span>{loading ? 'Processing...' : 'Proceed to Pay'}</span>
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
