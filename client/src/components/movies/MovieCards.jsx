import React from 'react';
import { Link } from 'react-router-dom';

function MovieCards({ movie, todayDate }) {
    // Return null if no movie object is passed
    if (!movie) return null;

    // Fallback to today's date formatted as YYYY-MM-DD for booking route
    const formattedDate = todayDate || new Date().toISOString().split("T")[0];

    return (
        <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-48 sm:w-52 shrink-0">
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
                </div>

                {/* Movie Info Section - Minimal Centered Movie Title */}
                <div className="p-3.5 flex items-center justify-center text-center bg-white">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 text-center w-full">
                        {movie.movieName}
                    </h3>
                </div>
            </Link>
        </div>
    );
}

export default MovieCards;
