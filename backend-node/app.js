const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Include middleware
app.use(express.static('../frontend-react/public'));
app.use(bodyParser());

// Add API endpoints
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/messageRoutes'));

// Landing Page
app.get('/', (req, res) => {
  res.render('index');
});

// Generate and start HTTP server to be reused for Socket.io
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const io = require('socket.io')(server);

// Install handlers for socket events
const eventHandlers = require('./socket')(io);
