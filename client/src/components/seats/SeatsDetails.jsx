import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { GetShowDetails } from '../../api/show';

function SeatsDetails({ showDetails: propShowDetails }) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const queryDate = searchParams.get('date');
  const showId = params.id || params.showId;

  const [showDetails, setShowDetails] = useState(propShowDetails || null);
  const [loading, setLoading] = useState(!propShowDetails);

  useEffect(() => {
    if (propShowDetails) {
      const data = { ...propShowDetails };
      if (queryDate) data.showDate = queryDate;
      setShowDetails(data);
      setLoading(false);
    } else if (showId) {
      const fetchDetails = async () => {
        setLoading(true);
        const res = await GetShowDetails(showId, queryDate);
        if (res?.data) {
          const data = { ...res.data };
          if (queryDate) data.showDate = queryDate;
          setShowDetails(data);
        }
        setLoading(false);
      };
      fetchDetails();
    }
  }, [showId, propShowDetails, queryDate]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 select-none">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-12 px-8 flex flex-col items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-4" />
          <p className="text-slate-600 font-semibold text-sm">Fetching Show Details...</p>
        </div>
      </div>
    );
  }

  if (!showDetails) return null;

  const movie = showDetails.movie || {};
  const theatre = showDetails.theatre || {};
  const movieTitle = movie.movieName || movie.title || 'Movie Title';

  const rawDate = showDetails.showDate;
  const formattedDate = rawDate
    ? new Date(typeof rawDate === 'string' && !rawDate.includes('T') ? `${rawDate}T00:00:00` : rawDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  const formattedGenre = Array.isArray(movie.genre)
    ? movie.genre.join(' • ')
    : (movie.genre || '').replaceAll(',', ' • ');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-0 select-none">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-6 sm:py-8 px-6 sm:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
        <div className="space-y-2 max-w-xl">
          <p className="text-slate-950 font-extrabold text-base sm:text-lg tracking-tight">
            {theatre.name || 'Cinema Venue'}
          </p>
          {theatre.address && (
            <p className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{theatre.address}</span>
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 select-none">
            {formattedDate && (
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-semibold flex items-center">
                {formattedDate}
              </span>
            )}

            {showDetails.showTime && (
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-semibold flex items-center">
                {showDetails.showTime}
              </span>
            )}
          </div>
        </div>

        <div className="max-w-xl text-left md:text-right shrink-0 space-y-1.5 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-[1.18]">
            {movieTitle}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
            {formattedGenre || 'Select your seats for an immersive cinema experience'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SeatsDetails;
