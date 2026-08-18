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

      try {
        const localList = JSON.parse(localStorage.getItem('myBookingsList') || '[]');
        const [res, moviesRes] = await Promise.all([
          GetUserBookings().catch(() => null),
          FetchAllMovies().catch(() => null)
        ]);

        const allMovies = moviesRes?.data || [];
        const apiBookings = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

        const combinedMap = new Map();
        [...apiBookings, ...localList].forEach((b) => {
          if (b && (b._id || b.id)) {
            combinedMap.set(b._id || b.id, b);
          }
        });

        const enrichedList = Array.from(combinedMap.values()).map((b) => {
          const show = b.show || {};
          let movie = typeof show.movie === 'object' && show.movie?.poster ? show.movie : {};

          if (!movie.poster && allMovies.length > 0) {
            const foundMovie = allMovies.find(
              (m) =>
                String(m._id) === String(show.movie) ||
                String(m._id) === String(show.movie?._id) ||
                m.movieName?.toLowerCase() === (show.movie?.movieName || movie.movieName || '').toLowerCase()
            );
            if (foundMovie) movie = foundMovie;
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

        setBookings(enrichedList);
      } catch (err) {
        console.error('Error fetching user bookings:', err);
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
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between select-none">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <div className="text-center pb-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950">
            My Bookings
          </h1>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-950 mb-3" />
            <p className="text-xs font-semibold text-slate-600">Fetching your ticket history...</p>
          </div>
        ) : activeBookings.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-10 sm:p-12 text-center space-y-2 max-w-md mx-auto my-8">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950">No Bookings Found</h3>
            <p className="text-xs text-slate-500 font-medium">You don't have any upcoming bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {activeBookings.map((booking) => {
              const show = booking.show || {};
              const movie = show.movie || {};
              const theatre = show.theatre || {};

              const formattedSeats = (booking.seats || [])
                .map((s) => (typeof s === 'string' ? s : getSeatLabel(s)))
                .join(', ');

              const totalPrice = booking.totalPaid || (booking.seats || []).length * (show.ticketPrice || 0) || 0;
              const displayDate = formatDate(booking.bookingDate || show.showDate);

              return (
                <div
                  key={booking._id}
                  onClick={() => setActiveTicket(booking)}
                  className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:border-slate-300 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <img
                      src={movie.poster || movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80'}
                      alt={movie.movieName || 'Movie'}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
                      }}
                      className="w-14 h-20 object-cover rounded-2xl border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                    />

                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-950 truncate">
                        {movie.movieName || 'Movie Title'}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600">{theatre.name || 'Cinema Venue'}</p>
                      {theatre.address && (
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{theatre.address}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left sm:text-right space-y-0.5">
                      <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Date</p>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-950">{displayDate}</p>
                    </div>

                    <div className="text-left sm:text-right space-y-0.5">
                      <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Time</p>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-950">{show.showTime || 'N/A'}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTicket(booking);
                      }}
                      className="px-4 h-9 rounded-xl bg-white border border-slate-300 hover:border-slate-600 text-slate-950 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer hover:bg-slate-50 shrink-0"
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
