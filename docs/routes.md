## API Endpoints

`users`
  + `GET /api/users/:id` - fetch information about a specific user
  + `POST /api/users/` - create a new user
  + `GET /api/users/search` - search database for all users that match the information provided

`channels`
  + `GET /api/channels/:id` - fetch information about a specific channel
  + `POST /api/channels` - create a new channel
  + `GET /api/channels/search` - search database for all channels that match the information provided

`memberships`
  + `POST /api/memberships` - create a new membership
  + `GET /api/users/:id/channels` - fetch all channels a user is participating in
  + `GET /api/channels/:id/members` - fetch all users participating in a specific channel

`messages`
  + `GET /api/channels/:channel_id/messages` - fetch all messages from a specific channel
  + `POST /api/messages` - create a new message
  + `PATCH /api/messages/:id` - edit an existing message
  + `DELETE /api/messages/:id` - delete an existing message
