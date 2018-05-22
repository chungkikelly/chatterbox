const db = require('./controller');

// SQL Query Constants
const fetchUserQuery = "SELECT * FROM users WHERE id = ?;";
const createUserQuery = "INSERT INTO users(username) VALUES(?);";
const searchUserQuery = "SELECT * FROM users WHERE username LIKE ?";

// fetch information about a specific user
exports.fetchUser = (req, res) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      res.status(501).send(serverError.message);
      connection.release();
      return;
    }

    connection.query(fetchUserQuery, req.params.id, (err, results, fields) => {
        if (err) {
          res.status(501).send(err.message);
          connection.release();
          return;
        }

        if (results.length === 0) {
          res.status(404).send("No user found.");
          connection.release();
          return;
        }

        res.json({
          user: results
        });

        connection.release();
    });
  });
};

// Search database for user with username that matches provided string
exports.searchUser = (req, res) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      res.status(501).send(serverError.message);
      connection.release();
      return;
    }

    connection.query(searchUserQuery, '%' + req.query.username + '%', (err, results, fields) => {
      if (err) {
        res.status(501).send(err.message);
        connection.release();
        return;
      }

      res.json({
        user: results
      });

      connection.release();
    });
  });
};

// create user
exports.createUser = (req, res) => {
  db.getConnection((serverError, connection) => {
    if (serverError) {
      res.status(501).send(serverError.message);
      connection.release();
      return;
    }

    if (!req.query.username) {
      res.status(422).send("No username provided.");
      return;
    }

    connection.query(createUserQuery, req.query.username, (err, results, fields) => {
      if (err) {
        res.status(422).send("Username already exists.");
        connection.release();
        return;
      }

      res.json({
        user: req.query.username
      });

      connection.release();
    });
  });
};

// TODO Change return value for createUser function
// TODO Change where the SQL queries get their values query vs body
