import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { GetShowDetails } from '../../api/show';
import SeatsPrice from './SeatsPrice';

function SeatsCard({ showDetails: propShowDetails }) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const queryDate = searchParams.get('date');
  const showId = params.id || params.showId;
  const [showDetails, setShowDetails] = useState(propShowDetails || null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [maxSeatsErrorSeat, setMaxSeatsErrorSeat] = useState(null);

  useEffect(() => {
    if (!propShowDetails && showId) {
      const fetchDetails = async () => {
        const res = await GetShowDetails(showId, queryDate);
        if (res?.data) {
          const data = { ...res.data };
          if (queryDate) data.showDate = queryDate;
          setShowDetails(data);
        }
      };
      fetchDetails();
    } else if (propShowDetails) {
      const data = { ...propShowDetails };
      if (queryDate) data.showDate = queryDate;
      setShowDetails(data);
    }
  }, [showId, propShowDetails, queryDate]);

  if (!showDetails) return null;

  const totalSeats = showDetails.totalSeats ? Math.min(showDetails.totalSeats, 120) : 120;
  const columns = 20;
  const rows = Math.ceil(totalSeats / columns);

  const bookedSeats = showDetails.bookedSeats || [];
  const ticketPrice = showDetails.ticketPrice || 0;

  const handleSeatSelect = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;

    if (!selectedSeats.includes(seatNumber)) {
      if (selectedSeats.length >= 6) {
        setMaxSeatsErrorSeat(seatNumber);
        setTimeout(() => setMaxSeatsErrorSeat(null), 2000);
        return;
      }
      setMaxSeatsErrorSeat(null);
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      setMaxSeatsErrorSeat(null);
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    }
  };

  const handleBookingSuccess = (newlyBookedSeats) => {
    setShowDetails((prev) => ({
      ...prev,
      bookedSeats: [...(prev?.bookedSeats || []), ...(newlyBookedSeats || [])],
    }));
    setSelectedSeats([]);
  };

  const getSeatLabel = (seatNum) => {
    const rowIndex = Math.floor((seatNum - 1) / columns);
    const colIndex = ((seatNum - 1) % columns) + 1;
    const rowLetter = String.fromCharCode(65 + rowIndex);
    return `${rowLetter}${colIndex}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-[clamp(0.5rem,2vw,2rem)] py-[clamp(0.75rem,1.8vw,1.5rem)] select-none space-y-[clamp(0.75rem,1.5vw,1.5rem)]">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 py-[clamp(0.75rem,1.8vw,1.8rem)] px-[clamp(0.5rem,2vw,2.5rem)] space-y-[clamp(0.75rem,1.5vw,1.5rem)] shadow-xs">
        <div className="border-b border-slate-100 pb-2.5 text-center">
          <p className="text-[clamp(0.62rem,0.8vw,0.75rem)] font-extrabold text-slate-500 uppercase tracking-widest">
            STANDARD — ₹{ticketPrice}
          </p>
        </div>

        <div className="overflow-x-auto pb-2 no-scrollbar max-w-full flex justify-center pt-1">
          <div className="space-y-[clamp(0.25rem,0.5vw,0.625rem)] min-w-max px-2">
            {Array.from({ length: rows }).map((_, rowIndex) => {
              const rowLetter = String.fromCharCode(65 + rowIndex);

              return (
                <div key={rowIndex} className="flex items-center justify-center">
                  <div className="flex items-center gap-[clamp(2px,0.4vw,6px)]">
                    {Array.from({ length: columns }).map((_, colIndex) => {
                      const seatNumber = rowIndex * columns + colIndex + 1;
                      if (seatNumber > totalSeats) return null;

                      const isBooked = bookedSeats.includes(seatNumber);
                      const isSelected = selectedSeats.includes(seatNumber);
                      const seatLabel = `${rowLetter}${colIndex + 1}`;
                      const isErrorOnThisSeat = maxSeatsErrorSeat === seatNumber;
                      const isCenterAisle = colIndex === 9;

                      return (
                        <React.Fragment key={seatNumber}>
                          <div className="relative flex items-center justify-center">
                            {isErrorOnThisSeat && (
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
                                Max 6 seats
                              </div>
                            )}

                            <button
                              type="button"
                              disabled={isBooked}
                              onClick={() => handleSeatSelect(seatNumber)}
                              className={`w-[clamp(15px,2.1vw,28px)] h-[clamp(15px,2.1vw,28px)] rounded-[clamp(4px,0.5vw,8px)] text-[clamp(6px,0.7vw,10px)] font-bold transition-all flex items-center justify-center cursor-pointer ${isBooked
                                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-slate-950 text-white border border-slate-950 scale-105 shadow-2xs'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-2xs'
                                }`}
                            >
                              {seatLabel}
                            </button>
                          </div>

                          {isCenterAisle && (
                            <div className="w-[clamp(6px,1.2vw,24px)] h-full pointer-events-none" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center space-y-1 pt-2 pb-1">
          <p className="text-[clamp(0.55rem,0.7vw,0.625rem)] font-extrabold text-slate-400 uppercase tracking-widest">
            SCREEN
          </p>
          <div className="w-full max-w-[clamp(160px,28vw,380px)] h-[clamp(3px,0.4vw,4px)] bg-slate-900 rounded-full" />
        </div>

        <div className="flex items-center justify-center gap-[clamp(1rem,2.5vw,2.5rem)] text-[clamp(0.62rem,0.8vw,0.75rem)] font-semibold text-slate-600 border-t border-slate-100 pt-[clamp(0.75rem,1.5vw,1.5rem)]">
          <div className="flex items-center gap-[clamp(0.25rem,0.4vw,0.5rem)]">
            <span className="w-[clamp(0.75rem,0.9vw,0.875rem)] h-[clamp(0.75rem,0.9vw,0.875rem)] rounded-md border border-slate-300 bg-white shadow-2xs" />
            <span>Available</span>
          </div>

          <div className="flex items-center gap-[clamp(0.25rem,0.4vw,0.5rem)]">
            <span className="w-[clamp(0.75rem,0.9vw,0.875rem)] h-[clamp(0.75rem,0.9vw,0.875rem)] rounded-md bg-slate-950 border border-slate-950 shadow-2xs" />
            <span>Selected</span>
          </div>

          <div className="flex items-center gap-[clamp(0.25rem,0.4vw,0.5rem)]">
            <span className="w-[clamp(0.75rem,0.9vw,0.875rem)] h-[clamp(0.75rem,0.9vw,0.875rem)] rounded-md bg-slate-200 border border-slate-300" />
            <span>Sold</span>
          </div>
        </div>
      </div>

      <SeatsPrice
        selectedSeats={selectedSeats}
        ticketPrice={ticketPrice}
        showId={showDetails._id || showId}
        showDetails={showDetails}
        getSeatLabel={getSeatLabel}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}

export default SeatsCard;
