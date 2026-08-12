import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 px-6 py-4 text-center text-xs text-slate-500 font-medium select-none">
      <p>© {new Date().getFullYear()} Movie Booking Application. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
