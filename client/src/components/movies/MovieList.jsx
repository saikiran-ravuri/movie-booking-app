import React, { useEffect, useState } from "react";
import { FetchAllMovies } from "../../api/movie";
import MovieCards from "./MovieCards";

function MovieList() {
    const [movies, setMovies] = useState(null);

    useEffect(() => {
        fetchMoviesData();
    }, []);

    const fetchMoviesData = async () => {
        const moviesData = await FetchAllMovies();

        if (moviesData && moviesData.data) {
            setMovies(moviesData.data);
        } else {
            setMovies([]);
        }
    };

    const todayDate = new Date().toISOString().split("T")[0];

    return (
        <section className="py-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recommended Movies</h2>
                    <p className="text-sm text-slate-500 mt-1">Explore latest releases and book your show now</p>
                </div>

                {/* Loading State */}
                {movies === null && (
                    <div className="text-center my-16">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent mb-4"></div>
                        <h2 className="text-lg font-medium text-slate-600">Fetching Movies ....</h2>
                    </div>
                )}

                {/* Empty State */}
                {movies && movies.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-lg font-medium">No movies currently available for booking.</p>
                        <p className="text-slate-400 text-sm mt-1">Add movies in admin panel or database to see them here.</p>
                    </div>
                )}

                {/* Horizontal Scroll Movie Cards Container */}
                {movies && movies.length > 0 && (
                    <div
                        className="flex overflow-x-auto gap-6 py-4 scroll-smooth no-scrollbar scrollbar-none"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {movies.map((movie) => (
                            <MovieCards key={movie._id} movie={movie} todayDate={todayDate} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default MovieList;
