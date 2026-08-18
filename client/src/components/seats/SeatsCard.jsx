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
        if (res && res.data) {
          setShowDetails(res.data);
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none space-y-6">
      
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-6">

        <div className="border-b border-slate-100 pb-3 text-center">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
            STANDARD - ₹{ticketPrice}
          </p>
        </div>

        <div className="overflow-x-auto pb-2 no-scrollbar max-w-full flex justify-center pt-2">
          <div className="space-y-2.5 min-w-[580px]">
            {Array.from({ length: rows }).map((_, rowIndex) => {
              const rowLetter = String.fromCharCode(65 + rowIndex);

              return (
                <div key={rowIndex} className="flex items-center justify-center">
                  <div className="flex items-center gap-1 sm:gap-1.5">
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
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
                                Max 6 seats
                              </div>
                            )}

                            <button
                              type="button"
                              disabled={isBooked}
                              onClick={() => handleSeatSelect(seatNumber)}
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                                isBooked
                                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-slate-950 text-white border border-slate-950 scale-105'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              {seatLabel}
                            </button>
                          </div>

                          {isCenterAisle && (
                            <div className="w-3 sm:w-6 h-full pointer-events-none" />
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

        <div className="w-full flex flex-col items-center justify-center space-y-2 pt-4 pb-2">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            SCREEN
          </p>
          <div className="w-full max-w-xl h-1.5 bg-slate-900 rounded-full" />
        </div>

        <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md border border-slate-300 bg-white" />
            <span>Available</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-950 border border-slate-950" />
            <span>Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-200 border border-slate-300" />
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
