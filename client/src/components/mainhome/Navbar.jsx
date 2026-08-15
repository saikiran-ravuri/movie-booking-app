import React, { useState, useRef, useEffect } from 'react';
import { Clapperboard, LogOut, ChevronDown, Search, Home, Ticket, ChevronRight, Film } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { FetchAllMovies } from '../../api/movie';

function Navbar({ username = 'User' }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Retrieve logged-in user's full name from localStorage
  const userName = localStorage.getItem('userName') || username || 'User';

  // Fetch all movies for live search dropdown
  useEffect(() => {
    const loadMovies = async () => {
      const res = await FetchAllMovies();
      if (res && res.data) {
        setAllMovies(res.data);
      }
    };
    loadMovies();
  }, []);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Filter movies matching current search query
  const searchResults = searchQuery.trim()
    ? allMovies.filter((movie) => {
      const query = searchQuery.trim().toLowerCase();
      return (
        movie.movieName?.toLowerCase().includes(query) ||
        movie.language?.toLowerCase().includes(query) ||
        (Array.isArray(movie.genre) && movie.genre.some((g) => g.toLowerCase().includes(query)))
      );
    })
    : [];

  return (
    <header className="w-full bg-white border-b border-slate-200/80 px-6 py-3 flex items-center justify-between shadow-xs select-none">

      {/* Brand Logo & Title */}
      <Link to="/main-home" className="flex items-center gap-3 hover:opacity-90 transition-opacity shrink-0">
        <div className="relative w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-sm shrink-0">
          <Clapperboard className="w-5 h-5 text-white stroke-[1.75]" />
          <Film className="w-2.5 h-2.5 text-white absolute bottom-1 right-1 opacity-80" />
        </div>
        <span className="text-base font-bold tracking-tight text-slate-950">
          Movie Booking Application
        </span>
      </Link>

      {/* Search Bar with Live Search Dropdown */}
      <div className="flex-1 max-w-sm mx-6 relative" ref={searchRef}>
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search movies..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-full pl-9 pr-4 py-2 focus:outline-none focus:bg-white focus:border-slate-300 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Live Search Results Dropdown (Small Poster + Name + Language Badge) */}
        {searchQuery.trim().length > 0 && isSearchFocused && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md p-1 max-h-56 overflow-y-auto space-y-0.5 animate-in fade-in duration-150">
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
                  {/* Small Poster */}
                  <div className="w-6 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={movie.poster}
                      alt={movie.movieName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Movie Title */}
                  <span className="font-semibold text-slate-900 truncate flex-1 min-w-0">{movie.movieName}</span>

                  {/* Right Arrow Icon */}
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

      {/* Right Controls: Home Icon & Profile Menu */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Home Icon */}
        <Link
          to="/main-home"
          title="Home"
          className="p-2 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
        >
          <Home className="w-4 h-4" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 hover:bg-slate-200/60 transition-all cursor-pointer text-xs font-semibold text-slate-800"
          >
            <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-[11px]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span>Hi, {userName}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Minimalist Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 animate-in fade-in duration-150 text-left">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Redirect disabled for now
                }}
                className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors rounded-lg cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5 text-slate-600" />
                My Bookings
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors rounded-lg"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
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
