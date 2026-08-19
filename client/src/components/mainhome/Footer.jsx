import React from 'react';
import { Clapperboard, Film } from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-6 mt-12 sm:mt-20 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-end gap-2">



        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700">
            <span>Developed by <strong className="text-slate-950">SaiKiran Ravuri</strong></span>
          </div>

          <a
            href="https://github.com/saikiran-ravuri"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-950 hover:text-white text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center group"
            title="View GitHub Profile"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
