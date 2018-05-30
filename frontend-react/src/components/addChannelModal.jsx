import React, { Component } from 'react';

export default class AddChannelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelName: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(e) {
    this.setState({ channelName: e.target.value });
  }

  handleCreate() {
    const { socket } = this.props;
    const { channelName } = this.state;

    if (channelName.length !== 0) {
      socket.emit('new channel', channelName);
      this.setState({ channelName: '' });
    }
  }

  handleKeyPress(e) {
    const { socket } = this.props;
    const { channelName } = this.state;

    if (e.key === "Enter" && channelName.length !== 0) {
      socket.emit('new channel', channelName);
      this.setState({ channelName: '', modal: false });
    }
  }

  modalActive() {
    return 'new-channel-modal ' + (this.props.modal ? 'show' : 'hidden');
  }

  render() {
    const { channelName } = this.state;
    const { handleModal } = this.props;

    return (
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
                    onClick={handleModal}>Cancel</button>

            <button className="create-channel-button"
                    onClick={this.handleCreate}>Create Channel</button>
          </div>
        </div>
      </div>
    );
  }
}
