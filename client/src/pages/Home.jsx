import React, { useState } from 'react';
import { Clapperboard, Film } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';

function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [initialAuthView, setInitialAuthView] = useState('login');

  const openAuth = (view) => {
    setInitialAuthView(view);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="space-y-5 max-w-lg flex flex-col items-center">

        {/* Clean Cinema Emblem Logo */}
        <div className="relative w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white shadow-md">
          <Clapperboard className="w-8 h-8 text-red-500 stroke-[1.75]" />
          <Film className="w-4 h-4 text-white absolute bottom-2 right-2 opacity-80" />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
          Movie Booking Application
        </h1>

        {/* Welcome Tagline */}
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 text-center">
          Welcome to Your Ultimate Movie Experience
        </p>

        {/* Project Description */}
        <p className="text-slate-600 text-sm leading-relaxed max-w-md">
          An online platform to browse trending movies, check theatre showtimes, and book your tickets effortlessly.
        </p>

        {/* Auth Modal Triggers */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => openAuth('login')}
            className="px-5 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
          >
            Login
          </button>
          <button
            onClick={() => openAuth('signup')}
            className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-950 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Floating Auth Modal Popup */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={initialAuthView}
      />
    </div>
  );
}

export default Home;
