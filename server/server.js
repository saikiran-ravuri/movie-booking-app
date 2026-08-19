require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
require('./src/Config/dbConfig');

// routes import
const userRoute = require('./src/Routes/userRoute');
const movieRoute = require('./src/Routes/movieRoute');
const theatreRoute = require('./src/Routes/theatreRoute');
const showRoute = require('./src/Routes/showRoute');
const bookingRoute = require('./src/Routes/bookingRoute');

const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());

// sanitize query for express 5 compatibility
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    ...Object.getOwnPropertyDescriptor(req, 'query'),
    value: req.query,
    writable: true,
  });
  next();
});

// nosql injection protection
app.use(mongoSanitize());

// rate limiting
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 300,
    message: "Too many requests from this IP, Please try again in sometime"
});


app.use(apiLimiter);

// security headers
app.use(helmet());

// root endpoint
app.get('/', (req, res) => {
    res.send('Movie Booking Server is Running!');
});

// api routes
app.use('/api/users', userRoute);
app.use('/api/movies', movieRoute);
app.use('/api/theatres', theatreRoute);
app.use('/api/shows', showRoute);
app.use('/api/bookings', bookingRoute);

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
