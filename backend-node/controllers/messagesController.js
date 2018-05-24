const db = require('./controller');

// SQL Query Constants
const fetchMessageQuery = "SELECT messages.ID, messages.body, users.username FROM messages JOIN users ON users.id = messages.author_id WHERE messages.id = ?";
const fetchMessagesQuery = "SELECT messages.ID, messages.body, users.username FROM messages JOIN users ON users.id = messages.author_id";
const createMessageQuery = "INSERT INTO messages(body, author_id) VALUES(?, ?)";

exports.fetchMessage = (id, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, serverError);
      return;
    }

    connection.query(fetchMessageQuery, id, (err, results, fields) => {
      connection.release();
      if(err) {
        callback(false, err);
        return;
      }

      callback(true, results[0]);
    });
  });
};

// fetch all messages for the shared channel
exports.fetchMessages = (callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, serverError);
      return;
    }

    connection.query(fetchMessagesQuery, (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false, err);
        return;
      }

      callback(true, results);
    });
  });
};

// create message
exports.createMessage = (body, authorID, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, serverError);
      return;
    }

    connection.query(createMessageQuery, [body, authorID], (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false, err);
        return;
      }

      callback(true, results.insertId);
    });
  });
};
