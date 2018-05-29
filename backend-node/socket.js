const usersController = require('./controllers/usersController');
const messagesController = require('./controllers/messagesController');
const channelsController = require('./controllers/channelsController');
const membershipsController = require('./controllers/membershipsController');

const generateSocketEventHandlers = (io) => {
  // server variables to quickly list who's online
  const activeSockets = [];
  const users = [];

  io.on('connection', (socket) => {
    activeSockets.push(socket);

    // refactored login code
    const loginUser = (username, id) => {
      users.push(username);

      // Bind user ID, username, and initial channel to socket for easy access
      socket.userID = id;
      socket.username = username;
      socket.channel = 'general';
      // The general channel will always be the first row of the database
      socket.channelID = 1;
      socket.join('general', () => {
        socket.emit('login', username);
        socket.broadcast.emit('update online list', users);
      });
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

              // All new users should join the general chat
              membershipsController.joinChannel(data, 1);
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
          io.sockets.in(socket.channel).emit('another user stopped typing', socket.username);
        }
      });
    });

    // TODO consider error handling for 'disconnect' event

    // Update online list for users that just logged in
    socket.on('request online list', () => {
      socket.emit('update online list', users);
    });

    // socket.on('join channel', (title, channelID) => {
    //   socket.join(title);
    //   console.log(socket);
    //   socket.channel = title;
    //   socket.channelID = channelID;
    // });

    // Handle user typing
    socket.on('user is typing', (username) => {
      io.sockets.in(socket.channel).emit('another user is typing', username);
    });

    // Conversely, handle user stopped typing
    socket.on('user is not typing', (username) => {
      io.sockets.in(socket.channel).emit('another user stopped typing', username);
    });

    // New message event handler
    socket.on('new message', (body) => {
      messagesController.createMessage(body, socket.userID, socket.channelID, (success, data) => {
        if(success) {
          messagesController.fetchMessage(data, (innerSuccess, innerData) => {
            io.sockets.in(socket.channel).emit('incoming message', innerData);
          });
        } else {
          socket.emit('messages-error', data);
        }
      });
    });

    socket.on('request messages', (username) => {
      messagesController.fetchMessages(socket.channelID, (success, data) => {
        if(success) {
          socket.emit('receive messages', data);
        } else {
          socket.emit('messages-error', data);
        }
      });
    });

    socket.on('request new messages', (username) => {
      messagesController.fetchNewMessages(username, (success, data) => {
        if(success) {
          socket.emit('receive messages', data);
        } else {
          socket.emit('messages-error', data);
        }
      });
    });

    socket.on('request user channels', (username) => {
      channelsController.fetchUserChannels(username, (success, data) => {
        if(success) {
          socket.emit('receive channels list', data);
        } else {
          socket.emit('channels-error', data);
        }
      });
    });

    socket.on('new channel', (title) => {
      channelsController.createChannel(title, (success, data) => {
        if(success) {
          socket.join(title);
          membershipsController.joinChannel(socket.userID, data);
          socket.emit('receive channel', data, title);
        } else {
          socket.emit('channels-error', data);
        }
      });
    });
  });
};

module.exports = generateSocketEventHandlers;

// TODO handle channel errors
