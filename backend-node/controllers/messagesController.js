const db = require('./controller');

// SQL Query Constants
const fetchMessagesQuery = "SELECT * FROM messages";
const createMessageQuery = "INSERT INTO messages(body, author_id) VALUES(?, ?, ?)";

// fetch information about a specific user
exports.fetchMessages = (req, res) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      res.status(501).send(serverError.message);
      connection.release();
      return;
    }

    connection.query(fetchMessagesQuery, (err, results, fields) => {
        if (err) {
          res.status(501).send(err.message);
          connection.release();
          return;
        }

        if (results.length === 0) {
          res.status(404).send("No messages found.");
          connection.release();
          return;
        }

        res.json({
          messages: results
        });

        connection.release();
    });
  });
};

// create message
exports.createMessage = (body, authorID) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      connection.release();
      return;
    }

    connection.query(createMessageQuery, [body, authorID], (err, results, fields) => {
      if (err) {
        connection.release();
        return;
      }

      connection.release();
    });
  });
};

// TODO Change return value for createMessage function
// TODO Change where the SQL queries get their values query vs body
// TODO consider removing 501 errors within query callback
