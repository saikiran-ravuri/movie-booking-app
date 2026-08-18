const getSeatLabel = (seat) => {
    const num = Number(seat);
    if (!num) return seat;
    const row = String.fromCharCode(65 + Math.floor((num - 1) / 20));
    const col = ((num - 1) % 20) + 1;
    return `${row}${col}`;
};

const bookingConfirmationTemplate = (userDetails, showDetails, bookingDetails) => {
    const subject = "Booking Confirmed Successfully";

    const movieName = showDetails?.movie?.movieName || 'Movie';
    const theatreName = showDetails?.theatre?.name || 'Theatre';
    const showDate = showDetails?.showDate ? new Date(showDetails.showDate).toDateString() : 'N/A';
    const showTime = showDetails?.showTime || 'N/A';
    const seats = Array.isArray(bookingDetails?.seats)
        ? bookingDetails.seats.map(getSeatLabel).join(', ')
        : 'N/A';

    const body = `
    <html>
      <body>
        <h3>Hi ${userDetails?.name || 'User'},</h3>
        <p>Your booking for <strong>${movieName}</strong> at <strong>${theatreName}</strong> is confirmed!</p>
        <p>Date: ${showDate}</p>
        <p>Time: ${showTime}</p>
        <p>Seats: ${seats}</p>
        <p>Booking ID: ${bookingDetails?._id || 'N/A'}</p>
      </body>
    </html>
    `;

    return { subject, body };
};

module.exports = { bookingConfirmationTemplate };
