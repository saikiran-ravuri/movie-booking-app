import React from 'react';
import Showdate from './Showdate';

function Showheader({ date, onDateSelect }) {
  return (
    <div className="flex flex-row items-center justify-between gap-[clamp(0.5rem,1.5vw,1.5rem)] mb-[clamp(0.75rem,1.5vw,1.5rem)]">
      <div className="text-left shrink-0">
        <h2 className="text-[clamp(0.95rem,1.6vw,1.5rem)] font-extrabold text-slate-950 tracking-tight">
          Available Showtimes
        </h2>
        <p className="text-[clamp(0.58rem,0.8vw,0.875rem)] text-slate-500 mt-0.5 font-medium">
          Select your preferred theatre and showtime
        </p>
      </div>

      <Showdate date={date} onDateSelect={onDateSelect} />
    </div>
  );
}

export default Showheader;
