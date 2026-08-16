import React from 'react';
import { Ticket } from 'lucide-react';
import Showdate from './Showdate';

function Showheader({ date, onDateSelect }) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
      
      {/* Left: Title & Subtitle */}
      <div className="shrink-0">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-slate-950" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            Available Showtimes
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Select your preferred cinema venue and showtime to reserve seats
        </p>
      </div>

      {/* Right: Showdate Strip Component */}
      <Showdate date={date} onDateSelect={onDateSelect} />
    </div>
  );
}

export default Showheader;
