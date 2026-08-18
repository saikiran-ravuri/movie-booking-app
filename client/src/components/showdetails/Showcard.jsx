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
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 hover:border-slate-300 transition-colors">
      <div className="space-y-1 max-w-md">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-950 tracking-tight">
          {theatreDetails.name || 'Theatre Venue'}
        </h3>
        {theatreDetails.address && (
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{theatreDetails.address}</span>
          </p>
        )}
      </div>

      <div className="w-full md:w-auto">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {sortedShows.map((show) => (
            <Link
              key={show._id}
              to={`/book-show/${show._id}${date ? `?date=${date}` : ''}`}
              className="h-9 px-4 rounded-xl border border-slate-300 bg-white hover:border-slate-600 text-slate-900 text-xs font-bold tracking-tight transition-colors cursor-pointer inline-flex items-center justify-center hover:bg-slate-50"
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
