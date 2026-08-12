import React, { useState, useRef, useEffect } from 'react';
import { Clapperboard, Film, User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Navbar({ username = 'User' }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Retrieve logged-in user's full name from localStorage
  const userName = localStorage.getItem('userName') || username || 'User';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <header className="w-full bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-sm select-none">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white shadow-sm">
          <Clapperboard className="w-5 h-5 text-red-500 stroke-[1.75]" />
          <Film className="w-2.5 h-2.5 text-white absolute bottom-1 right-1 opacity-80" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-950">
          Movie Booking Application
        </span>
      </div>

      {/* Profile Dropdown Container */}
      <div className="relative" ref={dropdownRef}>
        
        {/* Profile Button Trigger - Displaying Full User Name */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 hover:bg-slate-200/60 transition-all cursor-pointer text-xs font-semibold text-slate-800"
        >
          <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center text-white shadow-sm font-bold text-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span>Hi, {userName}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu Popup - Only Logout Option */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              Logout
            </button>
          </div>
        )}

      </div>

    </header>
  );
}

export default Navbar;
