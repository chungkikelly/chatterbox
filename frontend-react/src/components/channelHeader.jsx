import React, { Component } from 'react';

export default class ChannelHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'general',
      online: 1
    };
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on('receive channel info', (title) => {
      this.setState({ title });
    });

    socket.on('user joined channel', (online) => {
      this.setState({ online });
    });

    socket.on('user left channel', (online) => {
      this.setState({ online: this.state.online - 1 });
    });
  }

  render() {
    const { title, online } = this.state;

    return (
      <div className="channel-header-container">
        <div className="channel-title">{ `#${title}` }</div>
        <div className="online-count">{ `${online} online right now`}</div>
      </div>
    );
  }
}
