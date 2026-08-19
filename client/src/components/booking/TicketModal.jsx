import React from 'react';
import { X } from 'lucide-react';

function TicketModal({ bookingData, showDetails, selectedSeats, getSeatLabel, onClose }) {
  if (!bookingData) return null;

  const movieName = showDetails?.movie?.movieName || bookingData?.show?.movie?.movieName || 'Movie Title';
  const poster = showDetails?.movie?.poster || bookingData?.show?.movie?.poster;
  const theatreName = showDetails?.theatre?.name || bookingData?.show?.theatre?.name || 'Theatre Venue';
  const rawDate = showDetails?.showDate || bookingData?.bookingDate || bookingData?.show?.showDate || 'N/A';
  const showTime = showDetails?.showTime || bookingData?.show?.showTime || 'N/A';
  const totalPrice = bookingData?.totalPaid || ((selectedSeats?.length || 0) * (showDetails?.ticketPrice || bookingData?.show?.ticketPrice || 0)) || 0;
  const bookingId = bookingData?._id || bookingData?.id || 'N/A';

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    try {
      const d = new Date(typeof dateStr === 'string' && !dateStr.includes('T') ? `${dateStr}T00:00:00` : dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formattedSeats = selectedSeats
    ?.map((s) => (typeof s === 'string' && /^[A-Z]\d+$/.test(s) ? s : getSeatLabel ? getSeatLabel(s) : s))
    ?.join(', ') || 'N/A';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 transition-opacity select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative overflow-hidden w-full max-w-[clamp(260px,85vw,380px)] bg-white border border-slate-200 rounded-3xl p-[clamp(0.875rem,2vw,1.5rem)] shadow-2xl space-y-[clamp(0.5rem,1.2vw,1rem)] text-left"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-0.5 pt-0.5">
          <h2 className="text-[clamp(0.95rem,1.3vw,1.15rem)] font-extrabold text-slate-950">Booking Confirmed</h2>
          <p className="text-[clamp(0.55rem,0.72vw,0.68rem)] font-semibold text-slate-500">Your ticket details</p>
        </div>

        <div className="space-y-[clamp(0.45rem,0.9vw,0.75rem)] text-xs font-semibold text-slate-700 border-t border-slate-100 pt-2.5">
          <div className="flex gap-[clamp(0.45rem,0.8vw,0.75rem)] items-center">
            {poster && (
              <img
                src={poster}
                alt={movieName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
                }}
                className="w-[clamp(38px,5.5vw,48px)] aspect-[2/3] object-cover rounded-xl border border-slate-200 shrink-0 shadow-2xs"
              />
            )}
            <div className="space-y-0.5 min-w-0 flex-1">
              <p className="text-[clamp(0.48rem,0.6vw,0.58rem)] font-bold text-slate-400 uppercase tracking-wider">Movie & Theatre</p>
              <p className="text-[clamp(0.72rem,0.95vw,0.875rem)] font-extrabold text-slate-950 leading-tight truncate">{movieName}</p>
              <p className="text-[clamp(0.58rem,0.75vw,0.72rem)] text-slate-600 font-bold truncate">{theatreName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 border border-slate-200 p-[clamp(0.45rem,0.8vw,0.75rem)] rounded-2xl">
            <div>
              <p className="text-[clamp(0.48rem,0.6vw,0.58rem)] font-bold text-slate-500 uppercase tracking-wider">Date & Time</p>
              <p className="text-slate-950 font-extrabold text-[clamp(0.62rem,0.8vw,0.78rem)] truncate">{formatDate(rawDate)} | {showTime}</p>
            </div>
            <div className="text-right">
              <p className="text-[clamp(0.48rem,0.6vw,0.58rem)] font-bold text-slate-500 uppercase tracking-wider">Seats ({selectedSeats?.length || 0})</p>
              <p className="text-slate-950 font-extrabold text-[clamp(0.62rem,0.8vw,0.78rem)] truncate">{formattedSeats}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-500 pt-0.5 text-[clamp(0.55rem,0.7vw,0.68rem)] font-semibold">
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
