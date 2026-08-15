require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dbConfig = require('./src/Config/dbConfig');
const userRoute = require('./src/Routes/userRoute');
const movieRoute = require('./src/Routes/movieRoute');
const theatreRoute = require('./src/Routes/theatreRoute');
const showRoute = require('./src/Routes/showRoute');

const app = express();

// middleware configuration
app.use(cors());
app.use(express.json());

// user api routes
app.use('/api/users', userRoute);

// movie api routes
app.use('/api/movies', movieRoute);

// theatre api routes
app.use('/api/theatres', theatreRoute);

// show api routes
app.use('/api/shows', showRoute);

// test route
app.get('/', (req, res) => {
    res.send('Movie Booking Server is Running!');
});

// port configuration and server listener
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
