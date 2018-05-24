import React, { Component } from 'react';

export default class MessageIndexItem extends Component {
  render() {
    const { message } = this.props;
    return (
      <li className="message-index-item">
        { message.body }
      </li>
    );
  }
}
