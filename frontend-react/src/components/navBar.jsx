import React, { Component } from 'react';

export default class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on('update online list', (users) => {
      this.setState({ users });
    });
    socket.emit('request online list');
  }

  render() {
    const { users } = this.state;

    return (
      <ul className="nav-bar">
        <div className="nav-bar-logo">
          Chatterbox
        </div>
        <div className="new-notifs">
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
