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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-0 select-none">
            {loading ? (
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-12 px-8 flex flex-col items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-950 border-t-transparent mb-4"></div>
                    <p className="text-slate-600 font-semibold text-sm">Fetching Movie Details...</p>
                </div>
            ) : error ? (
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-10 px-8 text-center max-w-lg mx-auto my-6">
                    <p className="text-red-600 font-bold mb-4">{error}</p>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        Go Back
                    </button>
                </div>
            ) : movie && (
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-6 sm:py-8 px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                    <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-start shrink-0">
                        <div className="w-40 sm:w-48 h-56 sm:h-68 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-600 bg-white transition-colors duration-200 shrink-0">
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

                    <div className="relative z-10 flex-1 min-w-0 text-left space-y-3">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-[1.18]">
                            {movie.movieName}
                        </h1>

                        <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                            {movie.description || 'No description available for this movie.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 select-none">
                            {movie.duration && (
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-semibold flex items-center">
                                    {movie.duration} mins
                                </span>
                            )}
                            {movie.genre && (
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-semibold flex items-center">
                                    {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}
                                </span>
                            )}
                            {movie.releaseDate && (
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-semibold flex items-center">
                                    Release: {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            )}
                            {movie.language && (
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-[11px] font-semibold flex items-center uppercase">
                                    {movie.language}
                                </span>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={scrollToShows}
                                className="h-9 px-5 rounded-xl bg-white border border-slate-300 hover:border-slate-600 text-slate-950 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer hover:bg-slate-50 group"
                            >
                                <span>Book Tickets</span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieInfo;
