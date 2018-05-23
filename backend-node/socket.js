const usersController = require('./controllers/usersController');

const generateSocketEventHandlers = (io) => {
  // server variables to quickly list who's online
  const activeSockets = [];
  const users = [];

  io.on('connection', (socket) => {

    // User connect event handler
    socket.on('connect', (data) => {
      activeSockets.push(socket);
      socket.id = data.id;
      socket.username = data.username;
      users.push(socket.username);
      socket.broadcast.emit('update online list', users);
    });

    // User disconnect event handler
    socket.on('disconnect', () => {
      // remove socket and user from server variables
      activeSockets.splice(activeSockets.indexOf(socket), 1);
      users.splice(users.indexOf(socket.username), 1);

      // update last online timestamp to handle unread messages on next sign in
      usersController.updateUser(socket.id);
      socket.broadcast.emit('update online list', users);
    });

    // New message event handler
    socket.on('new message', (data, ack) => {
      ack(true);
      
      socket.broadcast.emit('incoming message', data);
    });
  });
};

// TODO consider adding ack callback
