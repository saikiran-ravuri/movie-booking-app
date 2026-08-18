require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dbConfig = require('./src/Config/dbConfig');

const userRoute = require('./src/Routes/userRoute');
const movieRoute = require('./src/Routes/movieRoute');
const theatreRoute = require('./src/Routes/theatreRoute');
const showRoute = require('./src/Routes/showRoute');
const bookingRoute = require('./src/Routes/bookingRoute');

const app = express();

app.use(cors());
app.use(express.json());

// api routes
app.use('/api/users', userRoute);
app.use('/api/movies', movieRoute);
app.use('/api/theatres', theatreRoute);
app.use('/api/shows', showRoute);
app.use('/api/bookings', bookingRoute);

app.get('/', (req, res) => {
    res.send('Movie Booking Server is Running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
