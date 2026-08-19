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
      <div className="w-full max-w-7xl mx-auto px-[clamp(0.5rem,2vw,2rem)] pt-[clamp(0.75rem,2vw,2rem)] select-none">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-12 px-8 flex flex-col items-center justify-center shadow-xs">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-4" />
          <p className="text-slate-600 font-semibold text-xs sm:text-sm">Fetching Show Details...</p>
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
    <div className="w-full max-w-7xl mx-auto px-[clamp(0.5rem,2vw,2rem)] pt-[clamp(0.75rem,2vw,2rem)] pb-0 select-none">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-[clamp(0.75rem,1.8vw,1.8rem)] px-[clamp(0.75rem,2.2vw,2.5rem)] flex flex-row items-center justify-between gap-[clamp(0.75rem,2vw,2rem)] shadow-xs">
        <div className="space-y-[clamp(0.15rem,0.3vw,0.25rem)] text-left min-w-0 flex-1">
          <p className="text-slate-950 font-extrabold text-[clamp(0.8rem,1.2vw,1.125rem)] tracking-tight truncate">
            {theatre.name || 'Cinema Venue'}
          </p>
          {theatre.address && (
            <p className="flex items-center gap-1.5 text-slate-500 text-[clamp(0.6rem,0.78vw,0.75rem)] font-medium truncate">
              <MapPin className="w-[clamp(0.75rem,0.9vw,0.875rem)] h-[clamp(0.75rem,0.9vw,0.875rem)] text-slate-400 shrink-0" />
              <span className="truncate">{theatre.address}</span>
            </p>
          )}

          <div className="flex flex-wrap items-center gap-[clamp(0.25rem,0.5vw,0.75rem)] pt-1 select-none">
            {formattedDate && (
              <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-600 text-[clamp(0.52rem,0.68vw,0.6875rem)] font-semibold flex items-center">
                {formattedDate}
              </span>
            )}

            {showDetails.showTime && (
              <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-600 text-[clamp(0.52rem,0.68vw,0.6875rem)] font-semibold flex items-center">
                {showDetails.showTime}
              </span>
            )}
          </div>
        </div>

        <div className="text-right shrink-0 space-y-[clamp(0.15rem,0.3vw,0.25rem)] min-w-0 max-w-[50%]">
          <h1 className="text-[clamp(0.95rem,2.2vw,2.25rem)] font-extrabold tracking-tight text-slate-950 leading-[1.18] truncate">
            {movieTitle}
          </h1>
          <p className="text-[clamp(0.58rem,0.85vw,0.875rem)] font-medium text-slate-500 leading-relaxed truncate">
            {formattedGenre || 'Select your seats'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SeatsDetails;
