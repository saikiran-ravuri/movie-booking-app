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
    <section id="recommended-movies" className="pt-[clamp(1rem,2.2vw,2.5rem)] pb-0 bg-slate-50 select-none">
      <div className="max-w-7xl mx-auto px-[clamp(0.5rem,2vw,2rem)]">
        <div className="mb-[clamp(0.75rem,1.5vw,1.5rem)] text-left">
          <h2 className="text-[clamp(1rem,1.8vw,1.5rem)] font-extrabold text-slate-950 tracking-tight">Recommended Movies</h2>
          <p className="text-[clamp(0.6rem,0.85vw,0.875rem)] text-slate-500 mt-0.5 font-medium">Explore latest releases, re-releases, and book your tickets</p>
        </div>

        {movies === null && (
          <div className="text-center my-12 py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-slate-950 border-t-transparent mb-3"></div>
            <p className="text-xs font-medium text-slate-600">Loading recommended movies...</p>
          </div>
        )}

        {movies && movies.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-slate-700 text-sm font-bold">No movies currently available</p>
            <p className="text-slate-400 text-xs mt-1 font-medium">Check back soon for new movie releases.</p>
          </div>
        )}

        {movies && movies.length > 0 && (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-[clamp(0.5rem,1.2vw,1.25rem)] pb-2.5 pt-1 scroll-smooth"
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
