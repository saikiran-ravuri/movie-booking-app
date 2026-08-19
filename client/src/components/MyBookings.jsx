import React from 'react';
import Navbar from './mainhome/Navbar';
import Footer from './mainhome/Footer';

function MyBookings() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between select-none">
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 px-4 text-center space-y-1">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-950">No Bookings Found</h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">You don't have any upcoming bookings yet.</p>
      </main>

      <Footer />
    </div>
  );
}

export default MyBookings;
