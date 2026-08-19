import React from 'react';
import { generateUpcomingDates } from '../../utils/showUtils';

function Showdate({ date, onDateSelect }) {
  const upcomingDates = generateUpcomingDates(7);

  return (
    <div className="flex items-center gap-[clamp(0.35rem,0.6vw,0.625rem)] overflow-x-auto pb-1 pt-1 max-w-full no-scrollbar select-none">
      {upcomingDates.map((item) => {
        const isSelected = date === item.fullDate;

        return (
          <button
            key={item.fullDate}
            type="button"
            onClick={() => onDateSelect(item.fullDate)}
            className={`flex flex-col items-center justify-center min-w-[clamp(48px,5.4vw,76px)] px-[clamp(0.35rem,0.7vw,0.75rem)] py-[clamp(0.25rem,0.5vw,0.5rem)] rounded-2xl border transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs ${isSelected
                ? 'bg-slate-100 text-slate-950 border-slate-400 font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 font-medium'
              }`}
          >
            <span className="text-[clamp(0.5rem,0.65vw,0.625rem)] font-extrabold tracking-wider uppercase">
              {item.dayName}
            </span>
            <span className="text-[clamp(0.75rem,1.1vw,1rem)] font-bold my-0.5 leading-none">
              {item.dayNumber}
            </span>
            <span className="text-[clamp(0.48rem,0.6vw,0.5625rem)] font-bold tracking-wider uppercase">
              {item.monthName}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default Showdate;
