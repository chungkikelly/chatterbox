import React, { Component } from 'react';
import io from 'socket.io-client';

class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      users: []
    };


  }

  render(){
    return <ul className="nav-bar">
      {this.props.users }
    </ul>;
  }
}
