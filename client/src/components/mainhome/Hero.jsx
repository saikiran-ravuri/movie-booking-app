import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { FetchAllMovies } from '../../api/movie';

function Hero() {
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await FetchAllMovies();
        if (res && res.data && res.data.length > 0) {
          setMovies(res.data);
        }
      } catch (err) {
        console.error('Failed to load hero carousel movies:', err);
      }
    };
    getMovies();
  }, []);

  // auto-rotate poster carousel every 4s unless hovered
  useEffect(() => {
    if (movies.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % movies.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [movies.length, isHovered]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStartIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStartIndex((prev) => (prev + 1) % movies.length);
  };

  const scrollToMovies = () => {
    const el = document.getElementById('recommended-movies');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const todayDate = new Date().toISOString().split('T')[0];

  const visibleMovies = movies.length > 0
    ? [0, 1, 2].slice(0, Math.min(3, movies.length)).map((i) => movies[(startIndex + i) % movies.length])
    : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-0 select-none">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-8 sm:py-10 px-8 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[280px] sm:min-h-[320px] md:min-h-[350px] group"
      >
        <div className="relative z-10 w-full md:max-w-xl text-left space-y-3.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-[1.18]">
            Book Your Movie Tickets Instantly
          </h1>

          <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-lg">
            Discover trending releases, check live showtimes, and book your preferred seats with our seamless booking platform.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 select-none">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-500 text-[10px] sm:text-[11px] font-medium flex items-center">
              Instant
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-500 text-[10px] sm:text-[11px] font-medium flex items-center">
              100% Secure
            </span>
            <button
              type="button"
              onClick={scrollToMovies}
              className="h-9 px-5 rounded-xl bg-white border border-slate-300 hover:border-slate-600 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer hover:bg-slate-50 group/btn"
            >
              <span>Explore Movies</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {visibleMovies.length > 0 && (
          <div className="flex items-center justify-center md:justify-end gap-2.5 sm:gap-4 relative z-10 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 sm:p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Previous"
              aria-label="Previous movie"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {visibleMovies.map((movie, index) => (
                <Link
                  key={`${movie._id}-${index}`}
                  to={`/movies/${movie._id}?date=${todayDate}`}
                  className="w-24 sm:w-32 md:w-36 aspect-[2/3] rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-600 bg-white transition-colors duration-200 cursor-pointer shrink-0"
                  title={movie.movieName}
                >
                  <img
                    src={movie.poster}
                    alt={movie.movieName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 sm:p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Next"
              aria-label="Next movie"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;
