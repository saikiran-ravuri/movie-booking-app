import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Film, MapPin, Calendar, Clock } from 'lucide-react';
import { GetShowDetails } from '../../api/show';

function SeatsDetails({ showDetails: propShowDetails }) {
  const params = useParams();
  const showId = params.id || params.showId;
  const [showDetails, setShowDetails] = useState(propShowDetails || null);
  const [loading, setLoading] = useState(!propShowDetails);

  useEffect(() => {
    if (!propShowDetails && showId) {
      const fetchDetails = async () => {
        setLoading(true);
        const res = await GetShowDetails(showId);
        if (res && res.data) {
          setShowDetails(res.data);
        }
        setLoading(false);
      };
      fetchDetails();
    } else if (propShowDetails) {
      setShowDetails(propShowDetails);
      setLoading(false);
    }
  }, [showId, propShowDetails]);

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

  // Minimise date format (e.g., Aug 20, 2026)
  const formattedDate = showDetails.showDate
    ? new Date(showDetails.showDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  // Format genre with proper spaces after commas (e.g., Action, Adventure, Sci-Fi)
  const formattedGenre = Array.isArray(movie.genre)
    ? movie.genre.join(', ')
    : (movie.genre || '').replaceAll(',', ', ');

  const taglineText = formattedGenre || 'Select your seats for an immersive cinema experience';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-0 select-none">
      {/* Show Details Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">
        
        {/* Left Side: Theatre Name, Location, Date & Time */}
        <div className="space-y-3 max-w-xl w-full lg:w-auto">
          {/* Theatre Name & Location (Stacked) */}
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-slate-950 font-extrabold text-base sm:text-lg tracking-tight">
              <Film className="w-4 h-4 text-slate-600 shrink-0" />
              {theatre.name || 'Cinema Venue'}
            </p>
            {theatre.address && (
              <p className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium pl-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {theatre.address}
              </p>
            )}
          </div>

          {/* Date & Time Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            {formattedDate && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-900 text-xs font-bold shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{formattedDate}</span>
              </div>
            )}

            {showDetails.showTime && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-900 text-xs font-bold shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{showDetails.showTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Movie Title & Tagline Underneath (Genre only) */}
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
