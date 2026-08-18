import React, { useEffect } from 'react';
import Navbar from '../components/mainhome/Navbar';
import Footer from '../components/mainhome/Footer';
import MovieInfo from '../components/moviedetails/MovieInfo';
import Shows from '../components/showdetails/Shows';

function MovieDetails() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between select-none">
      <Navbar />
      <main className="flex-grow pb-16 space-y-2">
        <MovieInfo />
        <Shows />
      </main>
      <Footer />
    </div>
  );
}

export default MovieDetails;
