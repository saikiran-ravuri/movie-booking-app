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

export const isShowTimePassed = (timeStr, selectedDateStr) => {
  if (!timeStr || !selectedDateStr) return false;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  if (selectedDateStr < todayStr) return true;
  if (selectedDateStr > todayStr) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const showMinutes = parseShowTimeToMinutes(timeStr);

  return showMinutes <= currentMinutes;
};

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
