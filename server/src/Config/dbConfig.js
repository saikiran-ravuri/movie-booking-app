const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.db_url);

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Connection successful');
});

connection.on('error', (err) => {
    console.log('Connection failed:', err);
});

module.exports = connection;
