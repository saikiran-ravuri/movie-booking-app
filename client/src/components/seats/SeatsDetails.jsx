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
    if (!propShowDetails && showId) {
      const fetchDetails = async () => {
        setLoading(true);
        const res = await GetShowDetails(showId, queryDate);
        if (res && res.data) {
          const data = { ...res.data };
          if (queryDate) data.showDate = queryDate;
          setShowDetails(data);
        }
        setLoading(false);
      };
      fetchDetails();
    } else if (propShowDetails) {
      const data = { ...propShowDetails };
      if (queryDate) data.showDate = queryDate;
      setShowDetails(data);
      setLoading(false);
    }
  }, [showId, propShowDetails, queryDate]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 select-none">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center shadow-xs">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-2" />
          <p className="text-xs font-semibold text-slate-600">Fetching show details...</p>
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
    ? new Date(typeof rawDate === 'string' && !rawDate.includes('T') ? `${rawDate}T00:00:00` : rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  const formattedGenre = Array.isArray(movie.genre)
    ? movie.genre.join(', ')
    : (movie.genre || '').replaceAll(',', ', ');

  const taglineText = formattedGenre || 'Select your seats for an immersive cinema experience';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-0 select-none">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">

        <div className="space-y-3 max-w-xl w-full lg:w-auto">
          <div className="space-y-1">
            <p className="text-slate-950 font-extrabold text-base sm:text-lg tracking-tight">
              {theatre.name || 'Cinema Venue'}
            </p>
            {theatre.address && (
              <p className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{theatre.address}</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {formattedDate && (
              <span className="px-3 py-1 rounded-full bg-white border border-slate-300 text-slate-950 text-xs font-bold">
                {formattedDate}
              </span>
            )}

            {showDetails.showTime && (
              <span className="px-3 py-1 rounded-full bg-white border border-slate-300 text-slate-950 text-xs font-bold">
                {showDetails.showTime}
              </span>
            )}
          </div>
        </div>

        <div className="max-w-xl w-full lg:w-auto text-left lg:text-right shrink-0 space-y-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            {movieTitle}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-wide">
            {taglineText}
          </p>
        </div>

      </div>
    </div>
  );
}

export default SeatsDetails;
