const usersController = require('./controllers/usersController');
const messagesController = require('./controllers/messagesController');

const generateSocketEventHandlers = (io) => {
  // server variables to quickly list who's online
  const activeSockets = [];
  const users = [];

  io.on('connection', (socket) => {
    activeSockets.push(socket);

    socket.on('new user', function(username){
      usersController.createUser(username, (success, error) => {
        if(success) {
          socket.broadcast.emit('update online list', username);
          socket.emit('login', username);
          users.push(username);
          socket.username = username;
        } else {
          // Current hack to send error message to socket owner
          socket.emit('login-error', error);
        }
      });
    });

    // User disconnect event handler
    // socket.on('disconnect', () => {
    //   // remove socket and user from server variables
    //   activeSockets.splice(activeSockets.indexOf(socket), 1);
    //   users.splice(users.indexOf(socket.username), 1);
    //
    //   // update last online timestamp to handle unread messages on next sign in
    //   usersController.updateUser(socket.username);
    //   socket.broadcast.emit('update online list', users);
    // });

    // New message event handler
    // socket.on('new message', (data, ack) => {
    //   messagesController.createMessage(data.body, data.authorID)
    //                     .then(() => ack(true), () => ack(false))
    //                     .then(() => socket.broadcast.emit('incoming message', data));
    // });
  });
};

module.exports = generateSocketEventHandlers;
