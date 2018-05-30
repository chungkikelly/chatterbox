import React, { Component } from 'react';
import AddChannelModal from './addChannelModal';
import SearchChannelModal from './searchChannelModal';

export default class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: [],
      channels: [],
      currentChannelID: null,
      addModal: false,
      searchModal: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.switchChannel = this.switchChannel.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on('receive channels list', (channels) => {
      this.setState({ channels });
    });
    socket.on('receive channel', (channelID, title) => {
      this.setState({ modal: false, channels: [...this.state.channels, { ID: channelID, title }]});
    });
    socket.emit('request user channels');
  }

  handleClick() {
    const { socket } = this.props;
    socket.emit('request new messages');
  }

  handleModal(key) {
    this.setState({ [key]: !this.state[key] });
  }

  switchChannel(channelID) {
    const { socket } = this.props;

    if (this.state.currentChannelID !== channelID) {
      this.setState({ currentChannelID: channelID });
      socket.emit('switch channel', channelID);
    }
  }

  render() {
    const { channels, addModal, searchModal } = this.state;
    const { socket } = this.props;

    return (
      <ul className="nav-bar">
        <div className="nav-bar-logo">
          Chatterbox
        </div>
        <div className="new-notifs" onClick={this.handleClick}>
          New Messages
        </div>
        <div className="channels-label-container">
          <div className="channels-label" onClick={() => this.handleModal('searchModal')}>
            Channels
          </div>
          <div className="add-button" onClick={() => this.handleModal('addModal')}>
            +
          </div>
        </div>
        <AddChannelModal socket={socket}
                         handleModal={() => this.handleModal('addModal')}
                         modal={addModal}/>
        <SearchChannelModal socket={socket}
                            handleModal={() => this.handleModal('searchModal')}
                            modal={searchModal}/>
        { channels.map((channel) =>
          <li className="channel-li"
              key={`li-${channel.title}`}
              onClick={() => this.switchChannel(channel.ID, channel.title)}>
            { `# ${channel.title}` }
          </li>
        )}
      </ul>
    );
  }
}
