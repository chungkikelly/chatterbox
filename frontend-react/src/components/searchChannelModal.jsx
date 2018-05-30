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
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on('receive channel suggestions', (channels) => {
      this.setState({ channels });
    });
  }

  handleChange(e) {
    const { socket } = this.props;

    this.setState({ channelName: e.target.value }, () => {
      socket.emit('search channel', this.state.channelName);
    });
  }

  handleClick() {

  }

  modalActive() {
    return 'new-channel-modal ' + (this.props.modal ? 'show' : 'hidden');
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
                 onChange={this.handleChange}/>
           <div className="channel-button-container">

             <button className="cancel-button"
                     onClick={handleModal}>Cancel</button>

             <button className="create-channel-button"
                     onClick={this.handleClick}>Join Channel</button>
           </div>
           <ul className="channel-li-container">
             { channels.map((channel) => {
               return (<li className="channel-li-modal"
                 key={`li-${channel.title}`}>
                 { `# ${channel.title}` }
               </li>);
             })}
           </ul>
        </div>
      </div>
    );
  }
}
