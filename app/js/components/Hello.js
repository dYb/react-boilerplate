import React from 'react';
import { Link } from 'react-router';

export default class Hello extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const name = this.props.params.name
    return (
      <div className="hello">
        <h2>Hello {name}</h2>
        <ul>
            <li><Link to="/">Go Home</Link></li>
        </ul>
      </div>
    )
  }
}

