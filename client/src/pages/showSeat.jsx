import React, { useEffect } from 'react';
import Navbar from '../components/mainhome/Navbar';
import Footer from '../components/mainhome/Footer';
import SeatsDetails from '../components/seats/SeatsDetails';
import SeatsCard from '../components/seats/SeatsCard';

function ShowSeat() {
  // Ensure page scrolls to top on initial navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between select-none">
      
      {/* Navbar Component */}
      <Navbar />

      {/* Main Page Layout Container */}
      <main className="flex-grow pb-16 space-y-2">
        {/* Show & Venue Information Hero Component */}
        <SeatsDetails />

        {/* Seats Grid & Booking Summary Component */}
        <SeatsCard />
      </main>

      {/* Footer Component */}
      <Footer />

    </div>
  );
}

export default ShowSeat;
