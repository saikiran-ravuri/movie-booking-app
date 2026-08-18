import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { parseShowTimeToMinutes, isShowTimePassed } from '../../utils/showUtils';

function Showcard({ theatreShows, date }) {
  if (!theatreShows || theatreShows.length === 0) return null;

  const activeShows = theatreShows.filter((show) => !isShowTimePassed(show.showTime, date));
  if (activeShows.length === 0) return null;

  const theatreDetails = activeShows[0].theatre || {};

  const sortedShows = [...activeShows].sort((a, b) =>
    parseShowTimeToMinutes(a.showTime) - parseShowTimeToMinutes(b.showTime)
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs hover:border-slate-300 transition-all">
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
          {theatreDetails.name || 'Cinema Venue'}
        </h3>
        {theatreDetails.address && (
          <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{theatreDetails.address}</span>
          </p>
        )}
      </div>

      <div className="w-full md:w-auto">
        <div className="flex flex-wrap items-center gap-3">
          {sortedShows.map((show) => (
            <Link
              key={show._id}
              to={`/book-show/${show._id}${date ? `?date=${date}` : ''}`}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-950 hover:text-white hover:border-slate-950 text-slate-900 text-xs font-bold tracking-tight transition-all cursor-pointer inline-block"
            >
              {show.showTime}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Showcard;
