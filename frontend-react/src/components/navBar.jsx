import React, { Component } from 'react';

export default class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: [],
      channels: [],
      modal: false,
      channelName: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.switchChannel = this.switchChannel.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on('update online list', (users) => {
      this.setState({ users });
    });
    socket.on('receive channels list', (channels) => {
      this.setState({ channels });
    });
    socket.on('receive channel', (channelID, title) => {
      this.setState({ modal: false, channels: [...this.state.channels, { ID: channelID, title }]});
    });
    socket.emit('request online list');
    socket.emit('request user channels', socket.username);
  }

  handleChange(e) {
    this.setState({ channelName: e.target.value });
  }

  handleClick() {
    const { socket } = this.props;
    socket.emit('request new messages', socket.username);
  }

  handleCreate() {
    const { socket } = this.props;
    const { channelName } = this.state;

    socket.emit('new channel', channelName);
    this.setState({ channelName: '' });
  }

  handleKeyPress(e) {
    const { socket } = this.props;
    const { channelName } = this.state;

    if (e.key === "Enter" && channelName.length !== 0) {
      socket.emit('new channel', channelName);
      this.setState({ channelName: '', modal: false });
    }
  }

  handleModal() {
    this.setState({ modal: !this.state.modal });
  }

  modalActive() {
    return 'new-channel-modal ' + (this.state.modal ? 'show' : 'hidden');
  }

  switchChannel(channelID) {
    const { socket } = this.props;

    socket.emit('switch channel', channelID);
  }

  render() {
    const { channels, channelName } = this.state;

    return (
      <ul className="nav-bar">
        <div className="nav-bar-logo">
          Chatterbox
        </div>
        <div className="new-notifs" onClick={this.handleClick}>
          New Messages
        </div>
        <div className="channels-label-container">
          <div className="channels-label">
            Channels
          </div>
          <div className="add-button" onClick={this.handleModal}>
            +
          </div>
        </div>
        <div className={this.modalActive()}>
          <div className="modal-container">
            <h1 className="channel-modal-header">
              Create a channel
            </h1>
            <p className="channel-modal-message">
              Channels are where your members communicate. They’re best
              when organized around a topic — #club-penguin, for example.
            </p>
            <div className="channel-modal-label">
              Name
            </div>
            <input className="channel-modal-input"
                   placeholder="e.g. club-penguin"
                   value={channelName}
                   onChange={this.handleChange}
                   onKeyPress={this.handleKeyPress}/>

            <div className="channel-button-container">

              <button className="cancel-button"
                      onClick={this.handleModal}>Cancel</button>

              <button className="create-channel-button"
                      onClick={this.handleCreate}>Create Channel</button>
            </div>
          </div>
        </div>
        { channels.map((channel) =>
          <li className="channel-li"
              key={`li-${channel.title}`}
              onClick={() => this.switchChannel(channel.ID)}>
            { `# ${channel.title}` }
          </li>
        )}
      </ul>
    );
  }
}

// TODO Make sure to decide whether or not to include current user
