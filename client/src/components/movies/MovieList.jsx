import React, { useEffect, useState, useRef } from "react";
import { FetchAllMovies } from "../../api/movie";
import MovieCards from "./MovieCards";

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

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <section id="recommended-movies" className="pt-8 sm:pt-12 pb-0 bg-slate-50 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">Recommended Movies</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Explore latest releases, re-releases, and book your tickets</p>
        </div>

        {movies === null && (
          <div className="text-center my-16 py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-slate-950 border-t-transparent mb-3"></div>
            <p className="text-sm font-medium text-slate-600">Loading recommended movies...</p>
          </div>
        )}

        {movies && movies.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <p className="text-slate-700 text-base font-bold">No movies currently available</p>
            <p className="text-slate-400 text-xs mt-1 font-medium">Check back soon for new movie releases.</p>
          </div>
        )}

        {movies && movies.length > 0 && (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-5 pb-2.5 pt-1 scroll-smooth [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300"
          >
            {movies.map((movie, index) => (
              <MovieCards key={movie._id} movie={movie} todayDate={todayDate} isPromoted={index === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MovieList;
