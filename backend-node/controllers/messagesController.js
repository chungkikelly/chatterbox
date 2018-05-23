const db = require('./controller');

// SQL Query Constants
const fetchMessagesQuery = "SELECT * FROM messages";
const createMessageQuery = "INSERT INTO messages(body, author_id) VALUES(?, ?)";

// fetch all messages for the shared channel
exports.fetchMessages = (callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false);
      return;
    }

    connection.query(fetchMessagesQuery, (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false);
        return;
      }

      callback(true);
    });
  });
};

// create message
exports.createMessage = (body, authorID, callback) => {
  return db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false);
      return;
    }

    connection.query(createMessageQuery, [body, authorID], (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false);
        return;
      }

      callback(true);
    });
  });
};
