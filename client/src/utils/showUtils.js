// Helper to convert showtime strings (e.g., "09:30 AM", "06:45 PM") into total minutes for chronological sorting & time comparison
export const parseShowTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3] ? match[3].toUpperCase() : null;

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Helper to check if a specific showtime on a specific date has already completed/passed
export const isShowTimePassed = (timeStr, selectedDateStr) => {
  if (!timeStr || !selectedDateStr) return false;
  const now = new Date();

  const todayYear = now.getFullYear();
  const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
  const todayDay = String(now.getDate()).padStart(2, '0');
  const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

  // If selected date is in the past (e.g., yesterday), the show is completed
  if (selectedDateStr < todayStr) return true;

  // If selected date is in the future (e.g., tomorrow), the show is upcoming
  if (selectedDateStr > todayStr) return false;

  // If selected date is TODAY, compare current time in minutes with showTime in minutes
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const showMinutes = parseShowTimeToMinutes(timeStr);

  return showMinutes <= currentMinutes;
};

// Helper to generate upcoming days array for BookMyShow style date selector strip
export const generateUpcomingDates = (daysCount = 7) => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < daysCount; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);

    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextDate.getDate()).padStart(2, '0');
    const fullDate = `${year}-${month}-${day}`;

    const dayName = i === 0 ? 'TODAY' : i === 1 ? 'TOM' : nextDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const monthName = nextDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayNumber = nextDate.getDate();

    dates.push({ fullDate, dayName, dayNumber, monthName });
  }

  return dates;
};
