const db = require('./controller');

// SQL Query Constants
const fetchUserQuery = "SELECT * FROM users WHERE username = ?;";
const searchUserQuery = "SELECT * FROM users WHERE username LIKE ?;";
const createUserQuery = "INSERT INTO users(username) VALUES(?);";
const updateUserQuery = "UPDATE users SET last_online = CURRENT_TIMESTAMP WHERE username = ?";

// fetch information about a specific user
exports.fetchUser = (username, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false);
      return;
    }

    connection.query(fetchUserQuery, username, (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false);
        return;
      }

      if (results.length === 0) {
        callback(false);
        return;
      }

      // Should be a unique username, therefore only need the first row of results
      callback(true, results[0]);
    });
  });
};

// Search database for user with username that matches provided string
exports.searchUser = (username, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false);
      return;
    }

    connection.query(searchUserQuery, '%' + username + '%', (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false);
        return;
      }

      callback(true);
    });
  });
};

// Create user
exports.createUser = (username, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error");
      return;
    }

    connection.query(createUserQuery, username, (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false, "Unprocessable entity");
        return;
      }

      // Return new user ID to be bound to socket
      callback(true, results.insertId);
    });
  });
};

// Update user's last log in time
exports.updateUser = (username, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error");
      return;
    }

    connection.query(updateUserQuery, username, (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false, "Failed to update user");
        return;
      }

      callback(true);
    });
  });
};
