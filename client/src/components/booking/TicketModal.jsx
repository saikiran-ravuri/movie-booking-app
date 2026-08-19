import React from 'react';
import { X } from 'lucide-react';

function TicketModal({ bookingData, showDetails, selectedSeats, getSeatLabel, onClose }) {
  if (!bookingData) return null;

  const movieName = showDetails?.movie?.movieName || bookingData?.show?.movie?.movieName || 'Movie Title';
  const poster = showDetails?.movie?.poster || bookingData?.show?.movie?.poster;
  const theatreName = showDetails?.theatre?.name || bookingData?.show?.theatre?.name || 'Theatre Venue';
  const showDate = showDetails?.showDate || bookingData?.bookingDate || 'N/A';
  const showTime = showDetails?.showTime || 'N/A';
  const totalPrice = bookingData?.totalPaid || (selectedSeats?.length * (showDetails?.ticketPrice || 0)) || 0;
  const bookingId = bookingData?._id || bookingData?.id || 'N/A';

  const formattedSeats = selectedSeats
    ?.map((s) => (typeof s === 'string' ? s : getSeatLabel ? getSeatLabel(s) : s))
    ?.join(', ') || 'N/A';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 transition-opacity select-none"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative overflow-hidden w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
      >

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-slate-950">Booking Confirmed</h2>
          <p className="text-xs font-semibold text-slate-500">Your ticket details</p>
        </div>


        <div className="space-y-3.5 text-xs font-semibold text-slate-700 border-t border-slate-100 pt-3">
          <div className="flex gap-4 items-center">
            {poster && (
              <img
                src={poster}
                alt={movieName}
                className="w-14 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
              />
            )}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Movie & Theatre</p>
              <p className="text-base font-extrabold text-slate-950 leading-tight">{movieName}</p>
              <p className="text-xs text-slate-600 font-bold">{theatreName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border border-slate-200 p-3.5 rounded-2xl">


            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date & Time</p>
              <p className="text-slate-950 font-extrabold text-sm">{showDate} | {showTime}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Seats ({selectedSeats?.length || 0})</p>
              <p className="text-slate-950 font-extrabold text-sm">{formattedSeats}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-500 pt-1 text-[11px] font-semibold">
            <div>
              <span>ID: </span>
              <span className="font-mono text-slate-700 font-bold">{bookingId}</span>
            </div>
            <div>
              <span>Paid: </span>
              <span className="font-bold text-slate-900">₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketModal;
