import React from 'react';
import Showcard from './Showcard';
import { isShowTimePassed } from '../../utils/showUtils';

function Showlist({ shows, date, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-3" />
        <p className="text-xs font-semibold text-slate-600">Fetching available showtimes...</p>
      </div>
    );
  }

  const activeTheatreIds = Object.keys(shows || {}).filter((theatreId) => {
    const theatreShows = shows[theatreId];
    return theatreShows && theatreShows.some((show) => !isShowTimePassed(show.showTime, date));
  });

  if (!shows || Object.keys(shows).length === 0 || activeTheatreIds.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-[clamp(1.5rem,3vw,3rem)] text-center space-y-1.5 shadow-xs">
        <h3 className="text-[clamp(0.85rem,1.1vw,1.125rem)] font-bold text-slate-900">
          No showtimes available for this date
        </h3>
        <p className="text-[clamp(0.6rem,0.8vw,0.875rem)] text-slate-500 font-medium">
          All showtimes for this date have completed or are unavailable. Please select another date for upcoming showtimes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-[clamp(0.5rem,1vw,1rem)]">
      {activeTheatreIds.map((theatreId) => (
        <Showcard
          key={theatreId}
          theatreShows={shows[theatreId]}
          date={date}
        />
      ))}
    </div>
  );
}

export default Showlist;
