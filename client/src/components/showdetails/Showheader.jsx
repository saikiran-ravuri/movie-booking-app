import React from 'react';
import Showdate from './Showdate';

function Showheader({ date, onDateSelect }) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
      <div className="shrink-0">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
          Available Showtimes
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Select your preferred theatre and showtime to book seats
        </p>
      </div>

      <Showdate date={date} onDateSelect={onDateSelect} />
    </div>
  );
}

export default Showheader;
