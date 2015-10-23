import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import Hello from './components/Hello';
import Profile from './components/Profile';

let routes = (
  <Route component={App}>
    <Route path="/" component={Home} />
    <Route path="profile" component={Profile} />
    <Route path="hello/:name" component={Hello} />
  </Route>
);

ReactDOM.render(<Router>{routes}</Router>,  document.getElementById('react-dom'))
