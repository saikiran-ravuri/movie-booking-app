import React from 'react';
import { Ticket, ArrowRight } from 'lucide-react';

function SeatsPrice({ selectedSeats, ticketPrice, getSeatLabel, onProceed }) {
  if (!selectedSeats || selectedSeats.length === 0) return null;

  const totalPrice = selectedSeats.length * ticketPrice;

  return (
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

        {/* Total Price Calculation & Proceed Action */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Price</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">₹{totalPrice}</p>
          </div>

          <button
            type="button"
            onClick={onProceed}
            className="px-6 sm:px-8 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
          >
            <span>Proceed to Pay</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default SeatsPrice;
