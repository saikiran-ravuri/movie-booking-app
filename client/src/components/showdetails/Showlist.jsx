import React from 'react';
import Showcard from './Showcard';

function Showlist({ shows, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-3" />
        <p className="text-xs font-semibold text-slate-600">Fetching available showtimes...</p>
      </div>
    );
  }

  if (!shows || Object.keys(shows).length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-2 shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          No shows available for this date
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Please select another date or check back later for updated theatre showtimes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.keys(shows).map((theatreId) => (
        <Showcard
          key={theatreId}
          theatreShows={shows[theatreId]}
        />
      ))}
    </div>
  );
}

export default Showlist;
