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

  useEffect(() => {
    if (movies.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % movies.length);
    }, 2000);
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
    <div className="w-full max-w-7xl mx-auto px-[clamp(0.5rem,2vw,2rem)] pt-[clamp(0.75rem,2vw,2.5rem)] pb-0 select-none">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-[clamp(0.875rem,2vw,2.5rem)] px-[clamp(0.75rem,2.5vw,3rem)] flex flex-row items-center justify-between gap-[clamp(0.5rem,1.8vw,2rem)] min-h-[clamp(170px,22vw,350px)] group"
      >
        <div className="relative z-10 flex-1 min-w-0 text-left space-y-[clamp(0.35rem,0.8vw,0.875rem)]">
          <h1 className="text-[clamp(0.95rem,2.2vw,2.25rem)] font-extrabold tracking-tight text-slate-950 leading-[1.18]">
            Book Your Movie Tickets Instantly
          </h1>

          <p className="text-[clamp(0.58rem,0.85vw,0.875rem)] font-medium text-slate-500 leading-relaxed max-w-lg">
            Discover trending releases, check live showtimes, and book your preferred seats with our seamless booking platform.
          </p>

          <div className="pt-[clamp(0.2rem,0.4vw,0.5rem)] flex flex-wrap items-center gap-[clamp(0.25rem,0.6vw,0.75rem)] select-none">
            <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-500 text-[clamp(0.52rem,0.65vw,0.6875rem)] font-medium flex items-center">
              Instant
            </span>
            <span className="px-[clamp(0.35rem,0.5vw,0.625rem)] py-[clamp(0.15rem,0.25vw,0.25rem)] rounded-lg bg-white border border-slate-200 text-slate-500 text-[clamp(0.52rem,0.65vw,0.6875rem)] font-medium flex items-center">
              100% Secure
            </span>
            <button
              type="button"
              onClick={scrollToMovies}
              className="h-[clamp(1.6rem,2vw,2.25rem)] px-[clamp(0.5rem,1vw,1.25rem)] rounded-xl bg-white border border-slate-300 hover:border-slate-600 text-slate-950 text-[clamp(0.6rem,0.75vw,0.875rem)] font-bold flex items-center gap-[clamp(0.2rem,0.35vw,0.5rem)] transition-colors cursor-pointer hover:bg-slate-50 group/btn shrink-0 shadow-xs"
            >
              <span>Explore Movies</span>
              <ArrowRight className="w-[clamp(0.7rem,0.9vw,0.875rem)] h-[clamp(0.7rem,0.9vw,0.875rem)] text-slate-600 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {visibleMovies.length > 0 && (
          <div className="flex items-center justify-end gap-[clamp(0.2rem,0.5vw,0.875rem)] relative z-10 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="w-[clamp(1.4rem,1.8vw,2rem)] h-[clamp(1.4rem,1.8vw,2rem)] rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              title="Previous"
              aria-label="Previous movie"
            >
              <ChevronLeft className="w-[clamp(0.75rem,1vw,1rem)] h-[clamp(0.75rem,1vw,1rem)]" />
            </button>

            <div className="flex items-center justify-center gap-[clamp(0.25rem,0.6vw,0.875rem)]">
              {visibleMovies.map((movie, index) => (
                <Link
                  key={`${movie._id}-${index}`}
                  to={`/movies/${movie._id}?date=${todayDate}`}
                  className="w-[clamp(44px,7.5vw,144px)] aspect-[2/3] rounded-[clamp(0.5rem,0.9vw,1rem)] overflow-hidden border border-slate-200 hover:border-slate-600 bg-white transition-colors duration-200 cursor-pointer shrink-0 shadow-2xs"
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
              className="w-[clamp(1.4rem,1.8vw,2rem)] h-[clamp(1.4rem,1.8vw,2rem)] rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              title="Next"
              aria-label="Next movie"
            >
              <ChevronRight className="w-[clamp(0.75rem,1vw,1rem)] h-[clamp(0.75rem,1vw,1rem)]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;
