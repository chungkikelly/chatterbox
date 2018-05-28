const db = require('./controller');

// SQL Query Constants

const joinChannelQuery = "INSERT INTO memberships(user_id, channel_id)" +
                         " VALUES(?, ?)";

exports.joinChannel = (userID, channelID) => {
  db.getConnection((serverError, connection) => {
    if(serverError) {
      console.log("Internal Server Error");
      return;
    }

    connection.query(joinChannelQuery, [userID, channelID], (err, results, field) => {
      connection.release();
      if(err) {
        console.log("Could not join channel");
        return;
      }

    console.log("Success");
    });
  });
};
