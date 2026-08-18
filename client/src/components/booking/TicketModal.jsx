import React from 'react';
import { X, MapPin } from 'lucide-react';

function TicketModal({ bookingData, showDetails, selectedSeats, getSeatLabel, onClose }) {
  if (!bookingData) return null;

  const movieName = showDetails?.movie?.movieName || 'Spider-Man: Brand New Day';
  const poster = showDetails?.movie?.poster || showDetails?.movie?.posterUrl || 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&q=80';
  const theatreName = showDetails?.theatre?.name || 'INOX: Varun Beach';
  const theatreAddress = showDetails?.theatre?.address || 'Beach Road, Visakhapatnam';

  const rawDate = showDetails?.showDate || bookingData?.bookingDate || bookingData?.show?.showDate;
  const dateObj = rawDate ? new Date(typeof rawDate === 'string' && !rawDate.includes('T') ? `${rawDate}T00:00:00` : rawDate) : null;
  const formattedDate = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : (rawDate || 'N/A');

  const showTime = showDetails?.showTime || 'N/A';
  const totalPrice = bookingData.totalPaid || (selectedSeats?.length * (showDetails?.ticketPrice || 0)) || 212;

  const formattedSeats = selectedSeats
    ?.map((s) => {
      if (typeof s === 'string') return s;
      if (typeof getSeatLabel === 'function') return getSeatLabel(s);
      const rowLetter = String.fromCharCode(65 + Math.floor(s / 12));
      const colNumber = (s % 12) + 1;
      return `${rowLetter}${colNumber}`;
    })
    ?.join(', ') || 'N/A';

  const bookingId = bookingData._id || bookingData.id || 'N/A';

  const handleDone = () => {
    if (onClose) onClose();
  };

  return (
    <div
      onClick={handleDone}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative overflow-hidden bg-white w-full max-w-sm rounded-3xl border border-slate-200 shadow-2xl"
      >
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900">Movie Ticket</h2>
          <button
            type="button"
            onClick={handleDone}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
            {poster ? (
              <img
                src={poster}
                alt={movieName}
                className="w-16 h-22 object-cover rounded-2xl shadow-xs shrink-0 border border-slate-200"
              />
            ) : (
              <div className="w-16 h-22 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200" />
            )}

            <div className="space-y-1 min-w-0">
              <h3 className="font-extrabold text-slate-950 text-lg leading-snug">{movieName}</h3>
              <p className="text-xs font-semibold text-slate-600">{theatreName}</p>
              {theatreAddress && (
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{theatreAddress}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-0.5 text-left">
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Date</p>
              <p className="font-extrabold text-slate-950 text-sm">{formattedDate}</p>
            </div>

            <div className="space-y-0.5 text-right">
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Time</p>
              <p className="font-extrabold text-slate-950 text-sm">{showTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-0.5 text-left">
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Seats ({selectedSeats?.length})</p>
              <p className="font-extrabold text-slate-950 text-sm tracking-tight">{formattedSeats}</p>
            </div>

            <div className="space-y-0.5 text-right">
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Paid</p>
              <p className="font-extrabold text-slate-950 text-sm">₹{totalPrice}</p>
            </div>
          </div>

          <div className="pt-1 text-center space-y-0.5">
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Booking ID</p>
            <p className="font-mono text-xs font-bold text-slate-900 select-all tracking-wider">{bookingId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketModal;
