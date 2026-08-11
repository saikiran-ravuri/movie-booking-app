import React from 'react';
import { Ticket } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-lg flex flex-col items-center">
        {/* Ticket Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-md">
          <Ticket className="w-6 h-6 text-red-500" />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
          Movie Booking Application
        </h1>

        {/* Welcome Tagline */}
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
          Welcome to Your Ultimate Movie Experience
        </p>

        {/* Project Description */}
        <p className="text-slate-600 text-sm leading-relaxed max-w-md">
          An online platform to browse trending movies, check theatre showtimes, and book your tickets effortlessly.
        </p>

        {/* Login Button with smooth interactive scale effect */}
        <div className="pt-2">
          <button className="px-6 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
