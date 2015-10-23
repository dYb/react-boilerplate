import React from 'react';
import { Link } from 'react-router';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    console.log('profile')
    return (
      <div className="profile">
        <h2>Profile</h2>
        <ul>
            <li><Link to="/">Home</Link></li>
        </ul>
    </div>
    )
  }
}


