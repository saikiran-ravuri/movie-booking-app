import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FetchMovieById } from '../../api/movie.js';
import { ArrowRight } from 'lucide-react';

function MovieInfo() {
  const params = useParams();
  const movieId = params.id || params.movieId;
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (movieId) {
      getMovieDetails();
    }
  }, [movieId]);

  const getMovieDetails = async () => {
    setLoading(true);
    setError('');
    const res = await FetchMovieById(movieId);
    if (res && res.success) {
      setMovie(res.data);
    } else if (res && res.data) {
      setMovie(res.data);
    } else {
      setError(res ? res.message : 'Failed to fetch movie details');
    }
    setLoading(false);
  };

  const scrollToShows = () => {
    const showsElement = document.getElementById('shows-section');
    if (showsElement) {
      showsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-[clamp(0.5rem,2vw,2rem)] pt-[clamp(0.75rem,2vw,2rem)] pb-0 select-none">
      {loading ? (
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-12 px-8 flex flex-col items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-semibold text-xs sm:text-sm">Fetching Movie Details...</p>
        </div>
      ) : error ? (
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-8 px-6 text-center max-w-lg mx-auto my-6 shadow-xs">
          <p className="text-red-600 font-bold mb-4 text-xs sm:text-sm">{error}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-white border border-slate-300 hover:border-slate-600 text-slate-950 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Go Back
          </button>
        </div>
      ) : movie && (
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-[clamp(0.875rem,2vw,2rem)] px-[clamp(0.75rem,2.5vw,2.5rem)] flex flex-row items-center justify-between gap-[clamp(0.75rem,2vw,2rem)] shadow-xs">
          <div className="relative z-10 shrink-0">
            <div className="w-[clamp(80px,14vw,192px)] aspect-[2/3] rounded-[clamp(0.5rem,1vw,1rem)] overflow-hidden border border-slate-200 hover:border-slate-600 bg-white transition-colors duration-200 shrink-0 shadow-2xs">
              <img
                src={movie.poster}
                alt={movie.movieName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
          </div>

          <div className="relative z-10 flex-1 min-w-0 text-left space-y-[clamp(0.3rem,0.7vw,0.75rem)]">
            <h1 className="text-[clamp(0.95rem,2.2vw,2.25rem)] font-extrabold tracking-tight text-slate-950 leading-[1.18]">
              {movie.movieName}
            </h1>

            <p className="text-[clamp(0.58rem,0.85vw,0.875rem)] font-medium text-slate-500 leading-relaxed max-w-2xl">
              {movie.description || 'No description available for this movie.'}
            </p>

            <div className="flex flex-wrap items-center gap-[clamp(0.25rem,0.5vw,0.75rem)] select-none">
              {movie.duration && (
                <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-600 text-[clamp(0.52rem,0.68vw,0.6875rem)] font-semibold flex items-center">
                  {movie.duration} mins
                </span>
              )}
              {movie.genre && (
                <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-600 text-[clamp(0.52rem,0.68vw,0.6875rem)] font-semibold flex items-center">
                  {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}
                </span>
              )}
              {movie.releaseDate && (
                <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-600 text-[clamp(0.52rem,0.68vw,0.6875rem)] font-semibold flex items-center">
                  Release: {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
              {movie.language && (
                <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-600 text-[clamp(0.52rem,0.68vw,0.6875rem)] font-semibold flex items-center uppercase">
                  {movie.language}
                </span>
              )}
            </div>

            <div className="pt-[clamp(0.2rem,0.4vw,0.5rem)]">
              <button
                type="button"
                onClick={scrollToShows}
                className="h-[clamp(1.6rem,2vw,2.25rem)] px-[clamp(0.5rem,1vw,1.25rem)] rounded-xl bg-white border border-slate-300 hover:border-slate-600 text-slate-950 text-[clamp(0.6rem,0.75vw,0.875rem)] font-bold inline-flex items-center gap-[clamp(0.2rem,0.35vw,0.5rem)] transition-colors cursor-pointer hover:bg-slate-50 group shadow-xs"
              >
                <span>Book Tickets</span>
                <ArrowRight className="w-[clamp(0.7rem,0.9vw,0.875rem)] h-[clamp(0.7rem,0.9vw,0.875rem)] text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieInfo;
