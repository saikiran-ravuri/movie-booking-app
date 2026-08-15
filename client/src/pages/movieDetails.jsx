import React from 'react';
import Navbar from '../components/mainhome/Navbar';
import Footer from '../components/mainhome/Footer';
import MovieInfo from '../components/moviedetails/MovieInfo';
import Shows from '../components/moviedetails/Shows';

function MovieDetails() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between select-none">
      
      {/* Navbar Component */}
      <Navbar />

      {/* Movie Details Info Component */}
      <MovieInfo />

      {/* Shows Component */}
      <Shows />

      {/* Footer Component */}
      <Footer />

    </div>
  );
}

export default MovieDetails;
