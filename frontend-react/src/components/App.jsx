import React, { Component } from 'react';
import io from 'socket.io-client';
import LoginForm from './loginForm';
// import Chat from './chat';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      user: null
    };
    this.initializeSocket = this.initializeSocket.bind(this);
  }

  componentWillMount() {
    this.initializeSocket();
  }

  initializeSocket() {
    const socket = io();
    this.setState({ socket });
    socket.on('login', (username) =>{
      this.setState({ user: username});
    });
  }

  render() {
    const { socket, user } = this.state;
    return (
      <div className="outermost-container">
        {
          !user ? <LoginForm socket={socket}/> : <div>SUCCESS</div>
        }
      </div>
    );
  }
}

export default App;