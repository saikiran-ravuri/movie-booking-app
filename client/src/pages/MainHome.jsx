import React from 'react';
import Navbar from '../components/MainHome/Navbar.jsx';
import Hero from '../components/MainHome/Hero.jsx';
import Footer from '../components/MainHome/Footer.jsx';

function MainHome() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between select-none">
      
      {/* Navbar Component */}
      <Navbar />

      {/* Hero / Main Content */}
      <Hero />

      {/* Footer Component */}
      <Footer />

    </div>
  );
}

export default MainHome;
