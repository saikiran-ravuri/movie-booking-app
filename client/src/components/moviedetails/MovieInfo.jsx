import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FetchMovieById } from '../../api/movie.js';
import { ArrowRight, Calendar, Clock, Film, Globe, Sparkles, Ticket } from 'lucide-react';

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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-0 select-none">
            {loading ? (
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 py-16 px-8 flex flex-col items-center justify-center shadow-xs">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-4"></div>
                    <p className="text-slate-600 font-semibold text-sm">Fetching Movie Details...</p>
                </div>
            ) : error ? (
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 py-12 px-8 text-center max-w-lg mx-auto shadow-xs my-8">
                    <p className="text-red-600 font-bold mb-4">{error}</p>
                    <button
                        type="button"
                        onClick={() => navigate('/main-home')}
                        className="px-6 py-2.5 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        Back to Home
                    </button>
                </div>
            ) : movie && (
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 py-8 sm:py-10 px-8 sm:px-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 sm:gap-12 min-h-[320px] shadow-xs">
                        
                        {/* Background Soft Glow */}
                        <div className="absolute -left-20 -top-20 w-80 h-80 bg-slate-100/70 rounded-full blur-3xl pointer-events-none" />

                    {/* Left Section: Featured Movie Poster */}
                    <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-start shrink-0">
                        <div className="w-52 sm:w-60 h-76 sm:h-88 rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-100 transition-transform duration-300 hover:scale-[1.02]">
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

                    {/* Right Section: Text & Movie Details */}
                    <div className="relative z-10 flex-grow text-left space-y-4">
                        
                        {/* Tagline Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>MOVIE DETAILS</span>
                        </div>

                        {/* Title & Genre */}
                        <div className="space-y-1.5">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-[1.18]">
                                {movie.movieName}
                            </h1>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-2">
                                <Film className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>{Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}</span>
                            </p>
                        </div>

                        {/* Metadata Pills */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            {movie.language && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-bold uppercase">
                                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{movie.language}</span>
                                </div>
                            )}
                            {movie.duration && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-bold">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{movie.duration} mins</span>
                                </div>
                            )}
                            {movie.releaseDate && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-bold">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Released: {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                            )}
                        </div>

                        {/* About the Movie Description */}
                        <div className="pt-2 space-y-1">
                            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                About the Movie
                            </h2>
                            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-2xl">
                                {movie.description || 'No description available for this movie.'}
                            </p>
                        </div>

                        {/* Book Tickets Action Trigger Button */}
                        <div className="pt-3">
                            <button
                                type="button"
                                onClick={scrollToShows}
                                className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs group"
                            >
                                <Ticket className="w-4 h-4 text-white" />
                                <span>Book Tickets</span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default MovieInfo;
