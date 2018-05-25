import React, { Component } from 'react';

export default class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on('update online list', (users) => {
      this.setState({ users });
    });
    socket.emit('request online list');
  }

  handleClick(e){
    const { socket } = this.props;
    socket.emit('request new messages', socket.username);
  }

  render() {
    const { users } = this.state;

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
