import React, { Component } from 'react';
import MessageIndex from './messageIndex';

export default class MessageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      typing: false,
      typingUsers: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    const { typingUsers } = this.state;
    const { socket } = this.props;

    // Handle typing events
    socket.on('another user is typing', (username) => {
      if (username !== socket.username) {
        this.setState({ typingUsers: [...typingUsers, username] });
      }
    });
    socket.on('another user stopped typing', (username) => {
      if (username !== socket.username) {
        typingUsers.splice(typingUsers.indexOf(username), 1);
        this.setState({ typingUsers });
      }
    });
  }

  handleChange(e){

    // Handle change and typing events (typing emission must happen after change happens)
    this.setState({ body: e.target.value }, () => {
      const { body, typing } = this.state;
      const { socket } = this.props;

      if (!typing && body.length !== 0) {
        this.setState({ typing: true });
        socket.emit('user is typing', socket.username);
        console.log('user is typing');
      } else if (typing && body.length ===0) {
        this.setState({ typing: false });
        socket.emit('user is not typing', socket.username);
        console.log('user is not typing');
      }
    });
  }

  handleKeyPress(e) {
    const { socket } = this.props;

    // Condition to manage message submission
    if (e.key === "Enter" && this.state.body.length !== 0) {
      socket.emit('new message', this.state.body);
      this.setState({ body: '', typing: false });
      socket.emit('user is not typing', socket.username);
    }
  }

  render() {
    const { body, typingUsers } = this.state;
    const { socket } = this.props;

    const typingIndicator =
      (
        <div className="typing-indicator">
          { typingUsers.length === 1 ?
            `${typingUsers[0]} is typing...` :
            `${typingUsers.length} users are typing...` }
        </div>
      );

    return (
      <div className="message-container">
        <MessageIndex socket={socket}/>
        <input className="message-input"
               type="text"
               value={body}
               onChange={this.handleChange}
               onKeyDown={this.handleKeyPress}
        />
        { typingUsers.length === 0 ?
          <div className="typingIndicator"></div> :
          typingIndicator }
      </div>
    );
  }
}
