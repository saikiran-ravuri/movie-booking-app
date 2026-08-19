import React from 'react';
import Navbar from './mainhome/Navbar';
import Footer from './mainhome/Footer';

function MyBookings() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between select-none">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-[clamp(0.5rem,2vw,2rem)] py-[clamp(2rem,6vw,6rem)] flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-600">
          This page is not built right now.
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default MyBookings;
