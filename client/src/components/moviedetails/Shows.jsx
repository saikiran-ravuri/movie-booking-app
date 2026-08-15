import React from 'react';
import { Ticket } from 'lucide-react';

function Shows() {
  return (
    <section id="shows-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-0 select-none">
      
      {/* Clean Section Header (Matching MovieList.jsx) */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-slate-950" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              Available Showtimes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Select your preferred cinema venue and showtime to reserve seats
          </p>
        </div>
      </div>

      {/* Simple Default Info Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-2 shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          No shows available for this movie right now
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Please check back later for updated theatre showtimes and ticket availability.
        </p>
      </div>
    </section>
  );
}

export default Shows;
