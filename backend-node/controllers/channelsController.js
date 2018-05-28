const db = require('./controller');

// SQL Query Constants
const fetchChannelQuery = "SELECT * FROM channels WHERE title = ?;";
const createChannelQuery = "INSERT INTO channels(title) VALUES(?);";
const searchChannelQuery = "SELECT * FROM channels WHERE title LIKE ?";

// fetch information about a specific channel
exports.fetchChannel = (title, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error.");
      return;
    }

    connection.query(fetchChannelQuery, title, (err, results, fields) => {
      connection.release();
      if (err || results.length === 0) {
        callback(false, "No channel found by that name.");
        return;
      }

      callback(true, results[0]);
    });
  });
};

// Search database for channel with username that matches provided string
exports.searchChannel = (title, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error.");
      return;
    }

    connection.query(searchChannelQuery, '%' + title + '%', (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false, "No channels found.");
        return;
      }

      callback(true, results);

    });
  });
};

// create channel
exports.createChannel = (title, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error.");
      return;
    }

    connection.query(createChannelQuery, title, (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false, "Unprocessable Entity.");
        return;
      }

      callback(true, results.insertId);

    });
  });
};
