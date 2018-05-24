import React, { Component } from 'react';
import MessageIndex from './messageIndex';

export default class MessageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      typing: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(e){
    this.setState({ body: e.target.value });
  }

  // TODO consider merging this into handleKeyPress

  handleKeyPress(e) {
    const { body, typing } = this.state;
    const { socket } = this.props;
    console.log(e.target.value);
    // Conditions to manage message submission and typing events
    if (e.key === "Enter") {
      socket.emit('new message', this.state.body);
      this.setState({ body: '' });
      socket.emit('user is not typing', socket.username);
    } else if (!typing && body.length !== 0) {
      this.setState({ typing: true });
      socket.emit('user is typing', socket.username);
    } else if (typing && body.length === 0) {
      this.setState({ typing: false });
      socket.emit('user is not typing', socket.username);
    }
  }

// TODO add typing listeners on server

  render() {
    const { body } = this.state;
    const { socket } = this.props;
    return (
      <div className="message-container">
        <MessageIndex socket={socket}/>
        <input className="message-input"
               type="text"
               value={body}
               onChange={this.handleChange}
               onKeyPress={this.handleKeyPress}
        />
      </div>
    );
  }
}
