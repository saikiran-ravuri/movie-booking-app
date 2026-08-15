import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

function MovieCards({ movie, todayDate }) {
    if (!movie) return null;

    const formattedDate = todayDate || new Date().toISOString().split("T")[0];

    // Format genre array safely with bullet separation
    const formattedGenre = Array.isArray(movie.genre) 
        ? movie.genre.join(" • ") 
        : movie.genre;

    return (
        <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/90 transition-all duration-300 hover:border-slate-400 hover:scale-[1.02] w-48 sm:w-52 shrink-0 cursor-pointer shadow-xs">
            <Link to={`/movies/${movie._id}?date=${formattedDate}`} className="flex flex-col h-full">
                
                {/* Poster Image Container */}
                <div className="relative overflow-hidden aspect-[2/3] bg-slate-100">
                    <img 
                        src={movie.poster} 
                        alt={movie.movieName} 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />

                    {/* Language Badge (Top Right) */}
                    {movie.language && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                            {movie.language}
                        </div>
                    )}
                </div>

                {/* Centered Movie Info Section */}
                <div className="p-3.5 flex flex-col items-center justify-between text-center grow bg-white border-t border-slate-100">
                    <div className="w-full text-center space-y-0.5">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-950 truncate group-hover:text-slate-800 transition-colors">
                            {movie.movieName}
                        </h3>
                        {formattedGenre && (
                            <p className="text-[11px] font-medium text-slate-500 truncate">
                                {formattedGenre}
                            </p>
                        )}
                    </div>

                    <div className="mt-2.5 pt-2 w-full border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-900 group-hover:text-slate-950">
                        <span>Book Tickets</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default MovieCards;
