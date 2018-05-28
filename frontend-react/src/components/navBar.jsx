import React, { Component } from 'react';

export default class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: [],
      channels: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on('update online list', (users) => {
      this.setState({ users });
    });
    socket.on('receive channels list', (channels) => {
      this.setState({ channels });
    });
    socket.emit('request online list');
    socket.emit('request user channels', socket.username);
  }

  handleClick(e){
    const { socket } = this.props;
    socket.emit('request new messages', socket.username);
  }

  render() {
    const { users, channels } = this.state;
    console.log(channels);

    return (
      <ul className="nav-bar">
        <div className="nav-bar-logo">
          Chatterbox
        </div>
        <div className="new-notifs" onClick={this.handleClick}>
          View New Messages
        </div>
        <div className="nav-bar-online">
          Online
        </div>
        { users.map((user) =>
          <li className="online-li" key={`li-${user}`}>
            { user }
          </li>
        )}
      </ul>
    );
  }
}

// TODO Make sure to decide whether or not to include current user
