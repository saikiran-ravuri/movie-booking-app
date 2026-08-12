require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dbConfig = require('./src/Config/dbConfig');
const userRoute = require('./src/Routes/userRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', userRoute);

// Test Route
app.get('/', (req, res) => {
    res.send('Movie Booking Server is Running!');
});

// Port & Server Listener
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
