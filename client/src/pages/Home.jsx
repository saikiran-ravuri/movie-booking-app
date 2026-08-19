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
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col items-center justify-center p-[clamp(1rem,3vw,2rem)] text-center select-none">
      <div className="space-y-[clamp(0.75rem,1.8vw,1.5rem)] max-w-lg flex flex-col items-center">
        <div className="relative w-[clamp(3.5rem,5vw,4.5rem)] h-[clamp(3.5rem,5vw,4.5rem)] rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white shadow-md">
          <Clapperboard className="w-[clamp(1.75rem,2.5vw,2.25rem)] h-[clamp(1.75rem,2.5vw,2.25rem)] text-white stroke-[1.75]" />
          <Film className="w-[clamp(0.75rem,1vw,1rem)] h-[clamp(0.75rem,1vw,1rem)] text-white absolute bottom-2 right-2 opacity-80" />
        </div>

        <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold tracking-tight text-slate-950 leading-tight">
          Movie Booking Application
        </h1>

        <p className="text-[clamp(0.6rem,0.75vw,0.6875rem)] font-semibold uppercase tracking-widest text-slate-500 text-center">
          Full-Stack Web Application
        </p>

        <p className="text-slate-600 text-[clamp(0.75rem,1vw,0.875rem)] leading-relaxed max-w-md">
          A complete movie ticketing platform featuring secure JWT authentication, OTP verification, dynamic showtime management, and real-time seat selection.
        </p>

        <p className="text-[clamp(0.68rem,0.85vw,0.75rem)] font-semibold text-slate-500 pt-0.5">
          Please login to continue
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => openAuth('login')}
            className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-slate-950 text-[clamp(0.75rem,0.9vw,0.875rem)] font-bold transition-colors cursor-pointer shadow-xs"
          >
            Login
          </button>
          <button
            onClick={() => openAuth('signup')}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-[clamp(0.75rem,0.9vw,0.875rem)] font-bold transition-colors cursor-pointer shadow-xs"
          >
            Sign Up
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={initialAuthView}
      />
    </div>
  );
}

export default Home;
