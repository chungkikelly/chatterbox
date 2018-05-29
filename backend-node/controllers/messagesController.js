const db = require('./controller');

// SQL Query Constants
const fetchMessageQuery = "SELECT messages.ID, messages.body, messages.created_at, users.username" +
                          " FROM messages JOIN users ON users.ID = messages.author_id" +
                          " WHERE messages.id = ?;";
const fetchMessagesQuery = "SELECT messages.ID, messages.body, messages.created_at, users.username" +
                           " FROM messages JOIN users ON users.ID = messages.author_id " +
                           " WHERE messages.channel_id = ?;";
const fetchNewMessagesQuery = "SELECT messages.ID, messages.body, messages.created_at, users.username" +
                              " FROM messages JOIN users on users.ID = messages.author_id" +
                              " WHERE messages.created_at >" +
                              " (SELECT users.last_online" +
                              " FROM users WHERE users.username = ?);";
const createMessageQuery = "INSERT INTO messages(body, author_id, channel_id) VALUES(?, ?, ?);";

exports.fetchMessage = (id, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error.");
      return;
    }

    connection.query(fetchMessageQuery, id, (err, results, fields) => {
      connection.release();
      if(err) {
        callback(false, "Sorry, we are having some technical difficulties.");
        return;
      }

      if(results.length === 0) {
        callback(false, "Could not find the message you were looking for.");
        return;
      }

      callback(true, results[0]);
    });
  });
};

// fetch all messages for the shared channel
exports.fetchMessages = (channelID, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error.");
      return;
    }

    connection.query(fetchMessagesQuery, channelID, (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false, "Could not find any messages.");
        return;
      }

      callback(true, results);
    });
  });
};

// fetch all new messages for the shared channel
exports.fetchNewMessages = (username, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error.");
      return;
    }

    connection.query(fetchNewMessagesQuery, username, (err, results, fields) => {
      connection.release();
      if (err || results.length === 0) {
        callback(false, "Could not find any new messages.");
        return;
      }

      callback(true, results);
    });
  });
};

// create message
exports.createMessage = (body, authorID, channelID, callback) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      callback(false, "Internal Server Error.");
      return;
    }

    connection.query(createMessageQuery, [body, authorID, channelID], (err, results, fields) => {
      connection.release();
      if (err) {
        callback(false, "Could not send message.");
        return;
      }

      callback(true, results.insertId);
    });
  });
};
