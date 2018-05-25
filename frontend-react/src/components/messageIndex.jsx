import React, { Component } from 'react';
import MessageIndexItem from './messageIndexItem';

export default class MessageIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      error: null
    };
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on('receive messages', (messages) => {
      this.setState({ messages });
    });
    socket.on('incoming message', (message) => {
      this.setState({ messages: [...this.state.messages, message] });
    });
    socket.on('messages-error', (error) => {
      this.setState({ error });
    });
    socket.emit('request messages', socket.username);
  }

// TODO need to change setState for messages (infinite scrolling)

  render() {
    const { messages, error } = this.state;
    return (
      <div className="message-index">
        <div className="message-errors">
          { error }
        </div>
        <ul className="message-list">
          { messages.map((message) =>
            <MessageIndexItem message={message} key={`${message.ID}-li`}/>
          )}
        </ul>
      </div>
    );
  }
}
