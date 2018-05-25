import React, { Component } from 'react';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      error: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on('login error', (error) => {
      this.setState({ error });
    });
  }

  handleChange(e) {
    this.setState({ username: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username } = this.state;
    const { socket } = this.props;
    socket.emit("new user", username);
  }

  render() {
    const { username, error } = this.state;
    return (
      <div className="login-container">
        <form onSubmit={this.handleSubmit} className="login-form">
          <div className="login-error">
            { error }
          </div>
          <label>
            What's your username?
            <input className="login-input"
                   type="text"
                   value={username}
                   onChange={this.handleChange}/>
          </label>
        </form>
      </div>
    );
  }
}
