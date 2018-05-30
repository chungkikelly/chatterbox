const usersController = require('./controllers/usersController');
const messagesController = require('./controllers/messagesController');
const channelsController = require('./controllers/channelsController');
const membershipsController = require('./controllers/membershipsController');

const generateSocketEventHandlers = (io) => {

  io.on('connection', (socket) => {

    // refactored login code
    const loginUser = (username, id) => {

      // Bind user ID, username, and initial channel to socket for easy access
      socket.userID = id;
      socket.username = username;
      socket.channel = 'general';
      // The general channel will always be the first row of the database
      socket.channelID = 1;
      socket.join('general', () => {
        socket.emit('login', username);

        // Count the numbre of clients currently in the channel
        const clients = io.sockets.adapter.rooms[socket.channel].sockets;
        const numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;

        io.sockets.in(socket.channel).emit('user joined channel', numClients);
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

    // // User read list of messages / new messages
    // socket.on('update last online', (username) => {
    //   usersController.updateUser(username, (success, message) => {
    //   });
    // });

    // User disconnect event handler
    socket.on('disconnect', () => {

      // update last online timestamp to handle unread messages on next sign in
      usersController.updateUser(socket.userID, (success, error) => {
        if(success) {
          io.sockets.in(socket.channel).emit('user left channel');

          // handle edge case typing event won't cease because of disconnect
          io.sockets.in(socket.channel).emit('another user stopped typing', socket.username);
        }
      });
    });

    // TODO consider error handling for 'disconnect' event

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

    socket.on('request messages', () => {
      messagesController.fetchMessages(socket.channelID, (success, data) => {
        if(success) {
          socket.emit('receive messages', data);
        } else {
          socket.emit('messages-error', data);
        }
      });
    });

    socket.on('request new messages', () => {
      messagesController.fetchNewMessages(socket.userID, (success, data) => {
        if(success) {
          usersController.updateUser(socket.userID, () => {
          });
          socket.emit('receive messages', data);
        } else {
          socket.emit('messages-error', data);
        }
      });
    });

    socket.on('request user channels', () => {
      channelsController.fetchUserChannels(socket.userID, (success, data) => {
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

    socket.on('join channel', (channelID, title) => {
      membershipsController.joinChannel(socket.userID, channelID);
      socket.emit('receive channel', channelID, title);
    });

    socket.on('switch channel', (channelID) => {
      channelsController.fetchChannel(channelID, (success, data) => {
        if(success) {

          // Properly update number of current users in room when leaving
          socket.leave(socket.channel);
          io.sockets.in(socket.channel).emit('user left channel');

          socket.channel = data.title;
          socket.channelID = data.ID;
          messagesController.fetchMessages(socket.channelID, (innerSuccess, innerData) => {
            if(innerSuccess) {
              socket.emit('receive channel info', socket.channel);
              socket.emit('receive messages', innerData);
              socket.join(socket.channel, () => {

                // Count the number of clients currently in the room
                const clients = io.sockets.adapter.rooms[socket.channel].sockets;
                const numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;

                io.sockets.in(socket.channel).emit('user joined channel', numClients);
              });
            } else {
              socket.emit('messages-error', innerData);
            }
          });
        } else {
          socket.emit('channels-error', data);
        }
      });
    });

    socket.on('search channel', (title) => {
      channelsController.searchChannel(title, (success, data) => {
        if(success) {
          socket.emit('receive channel suggestions', data);
        } else {
          socket.emit('channels-error', data);
        }
      });
    });
  });
};

module.exports = generateSocketEventHandlers;

// TODO handle channel errors
