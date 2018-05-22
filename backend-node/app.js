const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Include middleware
app.use(bodyParser());

// Add API endpoints
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/messageRoutes'));


// app.get('/test', function (req, res) {
//     db.getConnection(function (err, connection) {
//         if (err) {
//             res.status(501).send(err.message);
//             return;
//         }
//         connection.query('SELECT col FROM test', function (err, results, fields) {
//             if (err) {
//                 res.status(501).send(err.message);
//                 connection.release();
//                 return;
//             }
//
//             res.json({
//                 result: results[0].col,
//                 backend: 'nodejs',
//             });
//             connection.release();
//         });
//     });
// });

// Start the server
const port = process.env.PORT || 8000;

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
