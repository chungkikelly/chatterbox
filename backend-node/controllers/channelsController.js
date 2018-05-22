const db = require('./controller');

// SQL Query Constants
const fetchChannelQuery = "SELECT * FROM channels WHERE id = ?;";
const createChannelQuery = "INSERT INTO channels(name) VALUES(?);";
const searchChannelQuery = "SELECT * FROM channels WHERE name LIKE ?";

// fetch information about a specific channel
exports.fetchChannel = (req, res) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      res.status(501).send(serverError.message);
      connection.release();
      return;
    }

    connection.query(fetchChannelQuery, req.params.id, (err, results, fields) => {
        if (err) {
          res.status(501).send(err.message);
          connection.release();
          return;
        }

        if (results.length === 0) {
          res.status(404).send("No channel found.");
          connection.release();
          return;
        }

        res.json({
          channel: results
        });

        connection.release();
    });
  });
};

// Search database for channel with username that matches provided string
exports.searchChannel = (req, res) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      res.status(501).send(serverError.message);
      connection.release();
      return;
    }

    connection.query(searchChannelQuery, '%' + req.query.name + '%', (err, results, fields) => {
      if (err) {
        res.status(501).send(err.message);
        connection.release();
        return;
      }

      res.json({
        channel: results
      });

      connection.release();
    });
  });
};

// create channel
exports.createChannel = (req, res) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      res.status(501).send(serverError.message);
      connection.release();
      return;
    }

    if (!req.query.name) {
      res.status(422).send("No name provided.");
      return;
    }

    connection.query(createChannelQuery, req.query.name, (err, results, fields) => {
      if (err) {
        res.status(422).send("Channel name already exists.");
        connection.release();
        return;
      }

      res.json({
        channel: req.query.name
      });

      connection.release();
    });
  });
};

// TODO Change return value for createChannel function
// TODO Change where the SQL queries get their values query vs body
// TODO consider removing 501 errors within query callback
