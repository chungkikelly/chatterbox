import React, { Component } from 'react';

export default class SearchChannelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelName: '',
      channels: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on('receive channel suggestions', (channels) => {
      this.setState({ channels });
    });
  }

  handleChange(e) {
    const { socket } = this.props;
    const { channelName } = this.state;

    this.setState({ channelName: e.target.value }, () => {
      socket.emit('search channel', channelName);
    });
  }

  handleClick() {
    const { handleModal, socket } = this.props;
    // Assume target channel is at the top of the channels list
    const targetChannel = this.state.channels[0];

    socket.emit('join channel', targetChannel.ID, targetChannel.title);
    socket.emit('switch channel', targetChannel.ID);
    handleModal();
    this.setState({ channelName: '', channels: [] });
  }

  handleKeyPress(e) {
    const { handleModal, socket } = this.props;
    const targetChannel = this.state.channels[0];

    if (e.key === "Enter" && this.state.channelName.length !== 0) {
      socket.emit('join channel', targetChannel.ID, targetChannel.title);
      socket.emit('switch channel', targetChannel.ID);
      handleModal();
      this.setState({ channelName: '', modal: false });
    }
  }

  modalActive() {
    return 'new-channel-modal ' + (this.props.modal ? 'show' : 'hidden');
  }

  switchChannel(channel) {
    const { handleModal, socket } = this.props;

    socket.emit('join channel', channel.ID, channel.title);
    socket.emit('switch channel', channel.ID);
    handleModal();
    this.setState({ channelName: '', channels: [] });
  }

  render() {
    const { channelName, channels } = this.state;
    const { handleModal } = this.props;

    return (
      <div className={this.modalActive()}>
        <div className="search-modal-container">
          <div className="search-modal-header">Browse channels</div>
          <input className="channel-modal-input"
                 placeholder="Search channels"
                 value={channelName}
                 onChange={this.handleChange}
                 onKeyPress={this.handleKeyPress}/>
           <div className="channel-button-container">

             <button className="cancel-button"
                     onClick={handleModal}>Cancel</button>

             <button className="create-channel-button"
                     onClick={this.handleClick}>Join Channel</button>
           </div>
           <ul className="channel-li-container">
             { channels.map((channel) => {
               return (<li className="channel-li-modal"
                 key={`li-${channel.title}`}
                 onClick={() => this.switchChannel(channel)}>
                 { `# ${channel.title}` }
               </li>);
             })}
           </ul>
        </div>
      </div>
    );
  }
}
