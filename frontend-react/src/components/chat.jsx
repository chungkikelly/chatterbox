import React, { Component } from 'react';
import NavBar from './navBar';
import MessageContainer from './messageContainer';

export default class Chat extends Component {
  render() {
    const { socket } = this.props;
    return (
      <div className="chat-container">
        <NavBar socket={socket}/>
        <MessageContainer socket={socket}/>
      </div>
    );
  }
}
