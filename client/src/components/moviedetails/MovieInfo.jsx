import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FetchMovieById } from '../../api/movie.js';
import { ArrowLeft } from 'lucide-react';

function MovieInfo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getMovieDetails();
    }, [id]);

    const getMovieDetails = async () => {
        setLoading(true);
        setError('');
        const res = await FetchMovieById(id);
        if (res && res.success) {
            setMovie(res.data);
        } else {
            setError(res ? res.message : 'Failed to fetch movie details');
        }
        setLoading(false);
    };

    return (
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent mb-4"></div>
                    <span className="ml-3 text-slate-600 font-medium">Loading...</span>
                </div>
            ) : error ? (
                <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-md my-12">
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                    <button 
                        onClick={() => navigate('/main-home')} 
                        className="px-5 py-2.5 bg-slate-950 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        Back to Home
                    </button>
                </div>
            ) : movie && (
                <div>
                    <button 
                        onClick={() => navigate('/main-home')} 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-950 text-sm font-medium mb-6 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Movies
                    </button>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            {movie.movieName}
                        </h1>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieInfo;
