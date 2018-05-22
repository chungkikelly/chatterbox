const db = require('./controller');

// SQL Query Constants
const fetchMessagesQuery = "SELECT * FROM messages WHERE channel_id = ?";
const createMessageQuery = "INSERT INTO messages(body, author_id, channel_id) VALUES(?, ?, ?)";

// fetch information about a specific user
exports.fetchMessages = (req, res) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      res.status(501).send(serverError.message);
      connection.release();
      return;
    }

    connection.query(fetchMessagesQuery, req.params.channel_id, (err, results, fields) => {
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
exports.createMessage = (req, res) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      res.status(501).send(serverError.message);
      connection.release();
      return;
    }

    // const values = "'"+ req.query.body + "', " + req.query.author_id + ", " + req.query.channel_id;
    // console.log(values);
    connection.query(createMessageQuery, [req.query.body, req.query.author_id, req.query.channel_id], (err, results, fields) => {
      if (err) {
        res.status(422).send(err.message);
        connection.release();
        return;
      }

      res.json({
        message: results
      });

      connection.release();
    });
  });
};

// TODO Change return value for createMessage function
// TODO Change where the SQL queries get their values query vs body
// TODO consider removing 501 errors within query callback
