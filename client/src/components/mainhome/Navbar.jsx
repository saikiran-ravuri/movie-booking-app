import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Clapperboard, Film, User } from 'lucide-react';
import { FetchAllMovies } from '../../api/movie';

function Navbar({ username = 'User' }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const userName = localStorage.getItem('userName') || username;

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await FetchAllMovies();
        if (res && res.data) {
          setAllMovies(res.data);
        }
      } catch (err) {
        console.error('Failed to load movies for search:', err);
      }
    };
    loadMovies();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    navigate('/');
  };

  const query = searchQuery.trim().toLowerCase();
  const searchResults = query
    ? allMovies.filter(
      (movie) =>
        movie.movieName?.toLowerCase().includes(query) ||
        movie.language?.toLowerCase().includes(query) ||
        (Array.isArray(movie.genre) && movie.genre.some((g) => g.toLowerCase().includes(query)))
    )
    : [];

  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between select-none">
      <Link to="/main-home" className="flex items-center gap-3 hover:opacity-90 transition-opacity shrink-0">
        <div className="relative w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-sm shrink-0">
          <Clapperboard className="w-5 h-5 text-white stroke-[1.75]" />
          <Film className="w-2.5 h-2.5 text-white absolute bottom-1 right-1 opacity-80" />
        </div>
        <span className="text-base font-bold tracking-tight text-slate-950">
          Movie Booking Application
        </span>
      </Link>

      <div className="flex-1 max-w-sm mx-4 sm:mx-6 relative" ref={searchRef}>
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search movies..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-full pl-9 pr-4 py-2 focus:outline-none focus:bg-white focus:border-slate-950 transition-all placeholder:text-slate-400"
          />
        </div>

        {query.length > 0 && isSearchFocused && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 max-h-56 overflow-y-auto space-y-0.5 shadow-md animate-in fade-in duration-150">
            {searchResults.length > 0 ? (
              searchResults.map((movie) => (
                <Link
                  key={movie._id}
                  to={`/movies/${movie._id}`}
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-6 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={movie.poster}
                      alt={movie.movieName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-slate-900 truncate flex-1 min-w-0">{movie.movieName}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </Link>
              ))
            ) : (
              <div className="px-3 py-3 text-center text-xs font-medium text-slate-400">
                No movies found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          to="/main-home"
          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
        >
          Home
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-slate-700" />
            <span>Hi, {userName}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-2xl p-1.5 z-50 animate-in fade-in duration-150 text-left shadow-lg space-y-1">
              <Link
                to="/my-bookings"
                onClick={() => setIsDropdownOpen(false)}
                className="w-full block px-3 py-2 text-xs font-bold text-slate-800 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
              >
                My Bookings
              </Link>
              <div className="border-t border-slate-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-full block px-3 py-2 text-xs font-bold text-slate-800 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
              >
                Logout
              </button>
            </div>
          )}





        </div>
      </div>
    </header>
  );
}

export default Navbar;
