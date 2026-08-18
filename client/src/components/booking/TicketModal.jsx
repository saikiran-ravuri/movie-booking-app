import React from 'react';
import { X, MapPin } from 'lucide-react';

function TicketModal({ bookingData, showDetails, selectedSeats, getSeatLabel, onClose }) {
  if (!bookingData) return null;

  const movieName = showDetails?.movie?.movieName || 'Movie';
  const poster = showDetails?.movie?.poster || showDetails?.movie?.posterUrl;
  const theatreName = showDetails?.theatre?.name || 'Theatre';
  const theatreAddress = showDetails?.theatre?.address || '';

  const formattedDate = showDetails?.showDate
    ? new Date(showDetails.showDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const showTime = showDetails?.showTime || 'N/A';
  const totalPrice = selectedSeats?.length * (showDetails?.ticketPrice || 0);

  const formattedSeats = selectedSeats
    ?.sort((a, b) => a - b)
    ?.map(getSeatLabel)
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
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200/90"
      >
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Booking Confirmed</h2>
          <button
            type="button"
            onClick={handleDone}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
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
                className="w-16 h-22 object-cover rounded-2xl shadow-xs shrink-0 border border-slate-200/80"
              />
            ) : (
              <div className="w-16 h-22 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200" />
            )}

            <div className="space-y-1 min-w-0">
              <h3 className="font-black text-slate-950 text-lg leading-snug">{movieName}</h3>
              <p className="text-xs font-extrabold text-slate-700">{theatreName}</p>
              {theatreAddress && (
                <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{theatreAddress}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-0.5 text-left">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</p>
              <p className="font-black text-slate-950 text-sm">{formattedDate}</p>
            </div>

            <div className="space-y-0.5 text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</p>
              <p className="font-black text-slate-950 text-sm">{showTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-0.5 text-left">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Seats ({selectedSeats?.length})</p>
              <p className="font-black text-slate-950 text-sm tracking-tight">{formattedSeats}</p>
            </div>

            <div className="space-y-0.5 text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Paid</p>
              <p className="font-black text-slate-950 text-sm">₹{totalPrice}</p>
            </div>
          </div>

          <div className="pt-1 text-center space-y-0.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Booking ID</p>
            <p className="font-mono text-xs font-bold text-slate-900 select-all tracking-wider">{bookingId}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TicketModal;
