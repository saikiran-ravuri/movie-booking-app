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
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-[clamp(0.75rem,1.8vw,1.5rem)] flex flex-row items-center justify-between gap-[clamp(0.75rem,2vw,1.5rem)] hover:border-slate-300 transition-colors shadow-xs">
      <div className="space-y-[clamp(0.15rem,0.3vw,0.25rem)] text-left min-w-0 flex-1">
        <h3 className="text-[clamp(0.75rem,1vw,1rem)] font-extrabold text-slate-950 tracking-tight truncate">
          {theatreDetails.name || 'Theatre Venue'}
        </h3>
        {theatreDetails.address && (
          <p className="text-[clamp(0.6rem,0.78vw,0.75rem)] text-slate-500 font-medium flex items-center gap-1.5 truncate">
            <MapPin className="w-[clamp(0.75rem,0.9vw,0.875rem)] h-[clamp(0.75rem,0.9vw,0.875rem)] text-slate-400 shrink-0" />
            <span className="truncate">{theatreDetails.address}</span>
          </p>
        )}
      </div>

      <div className="shrink-0">
        <div className="flex flex-wrap items-center justify-end gap-[clamp(0.35rem,0.6vw,0.75rem)]">
          {sortedShows.map((show) => (
            <Link
              key={show._id}
              to={`/book-show/${show._id}${date ? `?date=${date}` : ''}`}
              className="h-[clamp(1.6rem,2vw,2.25rem)] px-[clamp(0.5rem,1vw,1rem)] rounded-xl border border-slate-300 bg-white hover:border-slate-600 text-slate-900 text-[clamp(0.62rem,0.78vw,0.75rem)] font-bold tracking-tight transition-colors cursor-pointer inline-flex items-center justify-center hover:bg-slate-50 shadow-2xs"
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
