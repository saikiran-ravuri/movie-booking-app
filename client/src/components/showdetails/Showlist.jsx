import React from 'react';
import Showcard from './Showcard';
import { isShowTimePassed } from '../../utils/showUtils';

function Showlist({ shows, date, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-3" />
        <p className="text-xs font-semibold text-slate-600">Fetching available showtimes...</p>
      </div>
    );
  }

  // Filter theatres that have at least one upcoming/active showtime for the selected date
  const activeTheatreIds = Object.keys(shows || {}).filter((theatreId) => {
    const theatreShows = shows[theatreId];
    return theatreShows && theatreShows.some((show) => !isShowTimePassed(show.showTime, date));
  });

  if (!shows || Object.keys(shows).length === 0 || activeTheatreIds.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-2 shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          No showtimes available for this date
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          All showtimes for this date have completed or are unavailable. Please select another date for upcoming showtimes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
