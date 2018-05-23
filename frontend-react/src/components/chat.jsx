import React, { Component } from 'react';
import NavBar from './navBar';
import MessageIndex from './messageIndex';

class Chat extends Component {
  render() {
    const { socket } = this.props;
    return (
      <div>
        <NavBar socket={socket}/>
        <MessageIndex socket={socket}/>
      </div>
    );
  }
}

export default Chat;
