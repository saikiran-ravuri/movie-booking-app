import React, { useState, useEffect } from 'react';
import { Ticket, Zap, ShieldCheck, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FetchAllMovies } from '../../api/movie';

function Hero() {
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      const res = await FetchAllMovies();
      if (res && res.data && res.data.length > 0) {
        setMovies(res.data);
      }
    };
    getMovies();
  }, []);

  // Auto-rotate poster carousel every 4 seconds unless hovered
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

  const todayDate = new Date().toISOString().split("T")[0];

  // Slice 3 visible movies for the carousel
  const visibleMovies = [];
  if (movies.length > 0) {
    for (let i = 0; i < Math.min(3, movies.length); i++) {
      const idx = (startIndex + i) % movies.length;
      visibleMovies.push(movies[idx]);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-0 select-none">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 py-8 sm:py-10 px-8 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[280px] sm:min-h-[320px] md:min-h-[350px] group shadow-xs"
      >
        
        {/* Left Section: Text & CTAs */}
        <div className="relative z-10 w-full md:max-w-xl text-left space-y-3.5">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>FULL-STACK DEVELOPMENT PROJECT</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-[1.18]">
            Book Your Movie Tickets Instantly
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-lg">
            Discover trending releases, check live showtimes, and reserve your preferred seats with our seamless booking platform.
          </p>

          {/* CTA Buttons & Micro Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToMovies}
              className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
            >
              <Ticket className="w-4 h-4 text-white" />
              <span>Explore Movies</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Micro Feature Badges */}
            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80 text-[11px] sm:text-xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80 text-[11px] sm:text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Section: Auto-Rotating Movie Poster Carousel */}
        {visibleMovies.length > 0 && (
          <div className="flex items-center justify-center md:justify-end gap-2.5 sm:gap-4 relative z-10 w-full md:w-auto shrink-0">
            
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 sm:p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xs"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 3 Rotated Carousel Poster Cards */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {visibleMovies.map((movie, index) => (
                <Link
                  key={`${movie._id}-${index}`}
                  to={`/movies/${movie._id}?date=${todayDate}`}
                  className={`w-24 sm:w-32 md:w-36 aspect-[2/3] rounded-2xl overflow-hidden border border-slate-200 bg-white transition-all duration-500 hover:scale-105 hover:border-slate-400 cursor-pointer shadow-sm ${
                    index === 0
                      ? 'rotate-[-3deg] translate-y-1 opacity-90'
                      : index === 1
                      ? 'z-20 scale-105 border-slate-300 opacity-100 shadow-md'
                      : 'rotate-[3deg] -translate-y-1 opacity-90'
                  }`}
                  title={movie.movieName}
                >
                  <img
                    src={movie.poster}
                    alt={movie.movieName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80";
                    }}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 sm:p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xs"
              title="Next"
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
