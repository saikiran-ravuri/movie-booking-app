import React from 'react';
import { generateUpcomingDates } from '../../utils/showUtils';

function Showdate({ date, onDateSelect }) {
  const upcomingDates = generateUpcomingDates(7);

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none">
      {upcomingDates.map((item) => {
        const isSelected = date === item.fullDate;

        return (
          <button
            key={item.fullDate}
            type="button"
            onClick={() => onDateSelect(item.fullDate)}
            className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[76px] px-3 py-2 rounded-2xl border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isSelected
                ? 'bg-slate-100 text-slate-950 border-slate-400 font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 font-medium'
            }`}
          >
            <span className="text-[10px] font-extrabold tracking-wider uppercase">
              {item.dayName}
            </span>
            <span className="text-sm sm:text-base font-bold my-0.5 leading-none">
              {item.dayNumber}
            </span>
            <span className="text-[9px] font-bold tracking-wider uppercase">
              {item.monthName}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default Showdate;
