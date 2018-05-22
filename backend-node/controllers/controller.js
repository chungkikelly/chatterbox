const mysql = require('mysql');

// create a connection pool other controllers can draw from
const db = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'testpass',
    database: 'challenge',
});

module.exports = db;
