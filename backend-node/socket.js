const usersController = require('./controllers/usersController');
const messagesController = require('./controllers/messagesController');

const generateSocketEventHandlers = (io) => {
  // server variables to quickly list who's online
  const activeSockets = [];
  const users = [];

  io.on('connection', (socket) => {
    activeSockets.push(socket);

    socket.on('new user', function(username){
      usersController.createUser(username, (success, data) => {
        if(success) {
          users.push(username);

          // Bind user id and username to socket for easy access
          socket.id = data;
          socket.username = username;

          socket.emit('login', username);
          socket.broadcast.emit('update online list', users);
        } else {
          // Current hack to send error message to socket owner
          socket.emit('login error', data);
        }
      });
    });

    // User disconnect event handler
    socket.on('disconnect', () => {

      // update last online timestamp to handle unread messages on next sign in
      usersController.updateUser(socket.username, (success, error) => {
        if(success) {
          // remove socket and user from server variables
          activeSockets.splice(activeSockets.indexOf(socket), 1);
          users.splice(users.indexOf(socket.username), 1);
          socket.broadcast.emit('update online list', users);
        }
      });
    });

    // TODO consider error handling for 'disconnect' event

    // Update online list for users that just logged in
    socket.on('request online list', () => {
      socket.emit('update online list', users);
    });

    // New message event handler
    socket.on('new message', (body) => {
      messagesController.createMessage(body, socket.id, (success, data) => {
        if(success) {
          messagesController.fetchMessage(data, (innerSuccess, innerData) => {
            socket.broadcast.emit('incoming message', innerData);
          });
        } else {
          socket.emit('messages-error', data);
        }
      });
    });

    socket.on('request messages', (username) => {
      messagesController.fetchMessages((success, data) => {
        if(success) {
          socket.emit('receive messages', data);
        } else {
          socket.emit('messages-error', data);
        }
      });
    });
  });
};

module.exports = generateSocketEventHandlers;
