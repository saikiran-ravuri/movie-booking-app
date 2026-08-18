import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/mainhome/Navbar';
import Footer from '../components/mainhome/Footer';
import SeatsDetails from '../components/seats/SeatsDetails';
import SeatsCard from '../components/seats/SeatsCard';

function ShowSeat() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const handlePopState = () => {
      navigate('/main-home', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between select-none">
      <Navbar />

      <main className="flex-grow pb-16 space-y-2">
        <SeatsDetails />
        <SeatsCard />
      </main>

      <Footer />
    </div>
  );
}

export default ShowSeat;
