import React from 'react';
import { Link } from 'react-router';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    console.log('home')
    let names = ['world', 'react']
    const symbol = Symbol("key")
    console.log(symbol)
    return (
      <div className="home">
        <h2>Home</h2>
        <ul>
          {
            names.map((name)=> <li key={name}><Link to={`/hello/${name}`}>Hello {name}</Link></li>) 
          }
          <li><Link to="/profile">profile</Link></li>
        </ul>
      </div>
    )
  }
}


