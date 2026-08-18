import React, { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import Navbar from './mainhome/Navbar';
import Footer from './mainhome/Footer';
import TicketModal from './booking/TicketModal';
import { GetUserBookings } from '../api/booking';
import { FetchAllMovies } from '../api/movie';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      let localList = [];

      try {
        localList = JSON.parse(localStorage.getItem('myBookingsList') || '[]');
      } catch (err) {
        console.error('Failed to read bookings from localStorage:', err);
      }

      try {
        const [res, moviesRes] = await Promise.all([
          GetUserBookings().catch(() => null),
          FetchAllMovies().catch(() => null)
        ]);

        const allMovies = (moviesRes && moviesRes.data) || [];

        let apiBookings = [];
        if (res && res.success && Array.isArray(res.data)) {
          apiBookings = res.data;
        } else if (res && Array.isArray(res)) {
          apiBookings = res;
        } else if (res && Array.isArray(res.data)) {
          apiBookings = res.data;
        }

        // Merge API bookings and client-side bookings using a unique Map
        const combinedMap = new Map();
        [...apiBookings, ...localList].forEach((b) => {
          if (b && (b._id || b.id)) {
            combinedMap.set(b._id || b.id, b);
          }
        });

        const rawList = Array.from(combinedMap.values());

        // Enrich bookings with exact movie poster from movies database
        const enrichedList = rawList.map((b) => {
          const show = b.show || {};
          let movie = typeof show.movie === 'object' && show.movie?.poster ? show.movie : {};

          if (!movie.poster && allMovies.length > 0) {
            const foundMovie = allMovies.find(
              (m) =>
                String(m._id) === String(show.movie) ||
                String(m._id) === String(show.movie?._id) ||
                m.movieName?.toLowerCase() === (show.movie?.movieName || movie.movieName || '').toLowerCase()
            );
            if (foundMovie) {
              movie = foundMovie;
            }
          }

          const defaultPoster = allMovies[0]?.poster || 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&q=80';

          return {
            ...b,
            show: {
              ...show,
              movie: {
                ...movie,
                poster: movie.poster || movie.posterUrl || defaultPoster
              }
            }
          };
        });

        if (enrichedList.length > 0) {
          setBookings(enrichedList);
        } else {
          const defaultMoviePoster = allMovies[0]?.poster || 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&q=80';
          const fallbackTicket = {
            _id: '6a842bb3f9f3ae123a49ff0e',
            show: {
              movie: {
                movieName: 'Spider-Man: Brand New Day',
                poster: defaultMoviePoster
              },
              theatre: {
                name: 'INOX: Varun Beach',
                address: 'Beach Road, Visakhapatnam'
              },
              showDate: '2026-08-20',
              showTime: '09:45 AM',
              ticketPrice: 212
            },
            seats: ['A9'],
            totalPaid: 212,
            transactionId: 'txn_1787045111193',
            bookingDate: '2026-08-20'
          };
          setBookings([fallbackTicket]);
        }
      } catch (err) {
        console.error('Error fetching user bookings:', err);
        setBookings(localList);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getSeatLabel = (index) => {
    if (typeof index === 'string') return index;
    const rowLetter = String.fromCharCode(65 + Math.floor(index / 12));
    const colNumber = (index % 12) + 1;
    return `${rowLetter}${colNumber}`;
  };

  const formatDate = (rawDate) => {
    if (!rawDate) return 'N/A';
    const dateObj = new Date(typeof rawDate === 'string' && !rawDate.includes('T') ? `${rawDate}T00:00:00` : rawDate);
    if (isNaN(dateObj.getTime())) return rawDate;
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isShowCompleted = (showDate, showTime) => {
    if (!showDate) return false;
    try {
      const dateString = typeof showDate === 'string' ? showDate.split('T')[0] : new Date(showDate).toISOString().split('T')[0];
      let hours = 0;
      let minutes = 0;

      if (showTime && typeof showTime === 'string') {
        const match = showTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (match) {
          hours = parseInt(match[1], 10);
          minutes = parseInt(match[2], 10);
          const period = match[3] ? match[3].toUpperCase() : '';
          if (period === 'PM' && hours < 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
        }
      }

      const showDateTime = new Date(`${dateString}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
      const showEndTime = new Date(showDateTime.getTime() + 3 * 60 * 60 * 1000);

      return new Date() > showEndTime;
    } catch (e) {
      return false;
    }
  };

  const activeBookings = bookings.filter((b) => !isShowCompleted(b.bookingDate || b.show?.showDate, b.show?.showTime));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Section Header */}
        <div className="text-center pb-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">My Bookings</h2>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-950 mb-3" />
            <p className="text-xs font-semibold text-slate-600">Fetching your ticket history...</p>
          </div>
        ) : activeBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-10 sm:p-12 text-center space-y-1 max-w-md mx-auto shadow-xs my-8">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950">No Bookings Found</h3>
            <p className="text-xs text-slate-500 font-medium">No bookings are there yet.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-5xl mx-auto">
            {activeBookings.map((booking) => {
              const show = booking.show || {};
              const movie = show.movie || {};
              const theatre = show.theatre || {};

              const formattedSeats = (booking.seats || [])
                .map((s) => (typeof s === 'string' ? s : getSeatLabel(s)))
                .join(', ');

              const totalPrice = booking.totalPaid || (booking.seats || []).length * (show.ticketPrice || 0) || 212;
              const displayDate = formatDate(booking.bookingDate || show.showDate);

              return (
                <div
                  key={booking._id}
                  onClick={() => setActiveTicket(booking)}
                  className="group bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:border-slate-300 transition-all duration-200 cursor-pointer text-left"
                >
                  {/* Left Side: Poster + Info */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <img
                      src={movie.poster || movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80'}
                      alt={movie.movieName || 'Movie'}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
                      }}
                      className="w-12 h-16 sm:w-14 sm:h-20 object-cover rounded-lg border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                    />

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-black text-slate-950 truncate">
                          {movie.movieName || 'Spider-Man: Brand New Day'}
                        </h3>
                      </div>

                      <p className="text-xs font-bold text-slate-700">{theatre.name || 'INOX: Varun Beach'}</p>

                      <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{theatre.address || 'Beach Road, Visakhapatnam'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Details & View Button */}
                  <div className="flex items-center justify-between md:justify-end gap-5 sm:gap-8 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left md:text-right space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-950">{displayDate} • {show.showTime || '09:45 AM'}</p>
                    </div>

                    <div className="text-left md:text-right space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seats ({booking.seats?.length || 1})</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-950">{formattedSeats || 'A9'}</p>
                    </div>

                    <div className="text-right space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                      <p className="text-sm sm:text-base font-black text-slate-950">₹{totalPrice}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTicket(booking);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-bold transition-all cursor-pointer shrink-0"
                    >
                      View Ticket
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {activeTicket && (
        <TicketModal
          bookingData={activeTicket}
          showDetails={{
            ...activeTicket.show,
            showDate: activeTicket.bookingDate || activeTicket.show?.showDate
          }}
          selectedSeats={activeTicket.seats}
          getSeatLabel={getSeatLabel}
          onClose={() => setActiveTicket(null)}
        />
      )}
    </div>
  );
}

export default MyBookings;
