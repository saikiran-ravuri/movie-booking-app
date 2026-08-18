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
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-400 transition-colors w-48 sm:w-52 shrink-0 cursor-pointer">
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
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
              Re-Release
            </div>
          ) : isPromoted ? (
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
              Promoted
            </div>
          ) : null}
        </div>

        <div className="p-3.5 flex flex-col text-left space-y-1 grow bg-white">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 truncate">
            {movie.movieName}
          </h3>
          {formattedGenre && (
            <p className="text-[11px] font-medium text-slate-500 truncate">
              {formattedGenre}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default MovieCards;
