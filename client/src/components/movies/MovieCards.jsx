import React from 'react';
import { Link } from 'react-router-dom';

function MovieCards({ movie, todayDate, isPromoted }) {
  if (!movie) return null;

  const formattedDate = todayDate || new Date().toISOString().split('T')[0];
  const formattedGenre = Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre;

  const nameLower = (movie?.movieName || '').toLowerCase();
  const isReRelease = movie?.isReRelease ||
    nameLower.includes('dilwale') ||
    nameLower.includes('ddlj') ||
    nameLower.includes('sanju');

  return (
    <div className="group flex flex-col bg-white rounded-[clamp(0.75rem,1.2vw,1rem)] overflow-hidden border border-slate-200 hover:border-slate-400 transition-colors w-[clamp(124px,14vw,200px)] shrink-0 cursor-pointer shadow-xs">
      <Link to={`/movies/${movie._id}?date=${formattedDate}`} className="flex flex-col h-full">
        <div className="relative overflow-hidden aspect-[2/3] bg-slate-100">
          <img
            src={movie.poster}
            alt={movie.movieName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
            }}
            className="w-full h-full object-cover"
          />

          {isReRelease ? (
            <div className="absolute top-[clamp(0.35rem,0.6vw,0.625rem)] left-[clamp(0.35rem,0.6vw,0.625rem)] px-[clamp(0.35rem,0.5vw,0.5rem)] py-[clamp(0.1rem,0.2vw,0.2rem)] rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[clamp(0.5rem,0.65vw,0.625rem)] font-bold uppercase tracking-wider">
              Re-Release
            </div>
          ) : isPromoted ? (
            <div className="absolute top-[clamp(0.35rem,0.6vw,0.625rem)] left-[clamp(0.35rem,0.6vw,0.625rem)] px-[clamp(0.35rem,0.5vw,0.5rem)] py-[clamp(0.1rem,0.2vw,0.2rem)] rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[clamp(0.5rem,0.65vw,0.625rem)] font-bold uppercase tracking-wider">
              Promoted
            </div>
          ) : null}
        </div>

        <div className="p-[clamp(0.45rem,0.8vw,0.75rem)] flex flex-col text-left space-y-[clamp(0.15rem,0.3vw,0.25rem)] grow bg-white">
          <h3 className="text-[clamp(0.68rem,0.88vw,0.875rem)] font-bold text-slate-950 truncate">
            {movie.movieName}
          </h3>
          {formattedGenre && (
            <p className="text-[clamp(0.58rem,0.75vw,0.6875rem)] font-medium text-slate-500 truncate">
              {formattedGenre}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default MovieCards;
