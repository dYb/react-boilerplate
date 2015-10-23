import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <div className="container">
        <h1>Welcome</h1>
        {this.props.children}
      </div>
    )
  }
}
