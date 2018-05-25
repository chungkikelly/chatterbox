import React, { Component } from 'react';

export default class MessageIndexItem extends Component {

  splitTimestamp(timestamp) {
    const time = timestamp.split(/[- : T]/);
    const date = new Date(Date.UTC(time[0], time[1]-1, time[2], time[3],
                                   time[4]));
    return date.toLocaleTimeString('en-US');
  }

  render() {
    const { message } = this.props;

    // Cut off irrelevant parts of the time string
    const time = this.splitTimestamp(message.created_at).split("");
    time.splice(4, 3);

    return (
      <li className="message-index-item">
        <div className="message-title">
          <div className="username"> { message.username } </div>
          <div className="datetime"> { time } </div>
        </div>
        <div className="message-body">
          { message.body }
        </div>
      </li>
    );
  }
}
