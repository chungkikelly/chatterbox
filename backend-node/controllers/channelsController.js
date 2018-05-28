const db = require('./controller');

// SQL Query Constants
const fetchChannelQuery = "SELECT * FROM channels WHERE title = ?;";
const fetchUserChannelsQuery = "SELECT channels.ID, channels.title " +
                               "FROM channels JOIN memberships ON channels.ID = memberships.channel_id " +
                               "JOIN users ON memberships.user_id = users.ID " +
                               "WHERE users.username = ?";
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

// fetch an user's list of channels
exports.fetchUserChannels = (username, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error.");
      return;
    }

    connection.query(fetchUserChannelsQuery, username, (err, results, fields) => {
      connection.release();
      if (err || results.length === 0) {
        callback(false, "No channels for that user.");
        return;
      }

      callback(true, results);
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
