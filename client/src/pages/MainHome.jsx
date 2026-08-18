import React, { useEffect } from 'react';
import Navbar from '../components/mainhome/Navbar';
import Hero from '../components/mainhome/Hero';
import MovieList from '../components/movies/MovieList';
import Footer from '../components/mainhome/Footer';

function MainHome() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between select-none">
      <Navbar />
      <Hero />
      <MovieList />
      <Footer />
    </div>
  );
}

export default MainHome;
