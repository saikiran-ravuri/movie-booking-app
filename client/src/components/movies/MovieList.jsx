import React, { useEffect, useState, useRef } from "react";
import { FetchAllMovies } from "../../api/movie";
import MovieCards from "./MovieCards";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";

function MovieList() {
    const [movies, setMovies] = useState(null);
    const scrollContainerRef = useRef(null);

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

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.75;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const todayDate = new Date().toISOString().split("T")[0];

    return (
        <section id="recommended-movies" className="pt-8 sm:pt-12 pb-0 bg-slate-50 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Clean Section Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <Film className="w-5 h-5 text-slate-950" />
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">Recommended Movies</h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Explore latest releases and reserve your tickets</p>
                    </div>

                    {/* Scroll Arrow Buttons */}
                    {movies && movies.length > 0 && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => scroll('left')}
                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-all cursor-pointer shadow-xs active:scale-95"
                                title="Scroll Left"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scroll('right')}
                                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-all cursor-pointer shadow-xs active:scale-95"
                                title="Scroll Right"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {movies === null && (
                    <div className="text-center my-16 py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-slate-950 border-t-transparent mb-3"></div>
                        <p className="text-sm font-medium text-slate-600">Loading recommended movies...</p>
                    </div>
                )}

                {/* Empty State */}
                {movies && movies.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                        <p className="text-slate-700 text-base font-bold">No movies currently available</p>
                        <p className="text-slate-400 text-xs mt-1 font-medium">Check back soon for new movie releases.</p>
                    </div>
                )}

                {/* Horizontal Scroll Movie Cards Container */}
                {movies && movies.length > 0 && (
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-5 py-2 scroll-smooth no-scrollbar scrollbar-none"
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
