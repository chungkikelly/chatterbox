const usersController = require('./controllers/usersController');
const messagesController = require('./controllers/messagesController');

const generateSocketEventHandlers = (io) => {
  // server variables to quickly list who's online
  const activeSockets = [];
  const users = [];

  io.on('connection', (socket) => {
    activeSockets.push(socket);

    // refactored login code
    const loginUser = (username, id) => {
      users.push(username);

      // Bind user ID and username to socket for easy access
      socket.id = id;
      socket.username = username;

      socket.emit('login', username);
      socket.broadcast.emit('update online list', users);
    };

    socket.on('new user', function(username){

      // First check if user exists:
      // 1) if so, fetch user information and login
      // 2) if not, create user and login
      usersController.fetchUser(username, (success, user) => {
        if(success) {
          loginUser(username, user.ID);
        } else {
          usersController.createUser(username, (innerSuccess, data) => {
            if(innerSuccess) {
              loginUser(username, data);
            } else {
              // Current hack to send error message to socket owner
              socket.emit('login error', data);
            }
          });
        }
      });
    });

    // User read list of messages / new messages
    socket.on('update last online', (username) => {
      usersController.updateUser(username, (success, message) => {
        console.log(message);
      });
    });

    // TODO consider error handling for update event handler

    // User disconnect event handler
    socket.on('disconnect', () => {

      // update last online timestamp to handle unread messages on next sign in
      usersController.updateUser(socket.username, (success, error) => {
        if(success) {
          // remove socket and user from server variables
          activeSockets.splice(activeSockets.indexOf(socket), 1);
          users.splice(users.indexOf(socket.username), 1);
          socket.broadcast.emit('update online list', users);

          // handle edge case typing event won't cease because of disconnect
          socket.broadcast.emit('another user stopped typing', socket.username);
        }
      });
    });

    // TODO consider error handling for 'disconnect' event

    // Update online list for users that just logged in
    socket.on('request online list', () => {
      socket.emit('update online list', users);
    });

    // Handle user typing
    socket.on('user is typing', (username) => {
      socket.broadcast.emit('another user is typing', username);
    });

    // Conversely, handle user stopped typing
    socket.on('user is not typing', (username) => {
      socket.broadcast.emit('another user stopped typing', username);
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

    socket.on('request new messages', (username) => {
      messagesController.fetchNewMessages(username, (success, data) =>{
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
