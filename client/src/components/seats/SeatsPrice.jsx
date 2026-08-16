import React, { useState } from 'react';
import { Ticket, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../api/booking';

function SeatsPrice({ selectedSeats, ticketPrice, showId, getSeatLabel, onBookingSuccess }) {
  const navigate = useNavigate();
  const [successPopup, setSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!selectedSeats || selectedSeats.length === 0) return null;

  const totalPrice = selectedSeats.length * ticketPrice;

  const handleProceedBooking = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const mockTransactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const bookingRequest = {
      show: showId,
      seats: [...selectedSeats],
      transactionId: mockTransactionId,
    };

    try {
      const bookingResponse = await createBooking(bookingRequest);
      setLoading(false);
      console.log("Booking response:", bookingResponse);

      if (bookingResponse && bookingResponse.success) {
        setSuccessPopup(true);
        setTimeout(() => {
          setSuccessPopup(false);
          if (onBookingSuccess) {
            onBookingSuccess(selectedSeats);
          }
        }, 1500);
      } else {
        if (bookingResponse && (bookingResponse.message?.includes('token') || bookingResponse.message?.includes('authenticated'))) {
          navigate('/login');
        } else {
          console.error(bookingResponse ? bookingResponse.message : "Booking creation failed");
        }
      }
    } catch (err) {
      setLoading(false);
      console.error("Booking Error:", err);
    }
  };

  return (
    <>
      {/* Simple Success Popup Badge */}
      {successPopup && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Booking Completed Successfully</span>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 select-none">
        {/* Consistent White Card Container matching SeatsDetails & SeatsCard */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          
          {/* Selected Seats Information */}
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Ticket className="w-4 h-4 text-slate-900" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Selected Seats ({selectedSeats.length}/6)
              </p>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Seats: <span className="font-black text-slate-900">{selectedSeats.sort((a, b) => a - b).map(getSeatLabel).join(', ')}</span>
            </p>
          </div>

          {/* Total Price Calculation & Direct Booking Proceed Action */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Price</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">₹{totalPrice}</p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleProceedBooking}
              className="px-6 sm:px-8 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer hover:scale-105 disabled:opacity-60"
            >
              <span>{loading ? 'Booking...' : 'Proceed to Pay'}</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default SeatsPrice;
