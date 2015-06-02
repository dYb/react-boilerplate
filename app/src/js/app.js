var React = require('react');
var Router = require('react-router');
'use strict'
var { Route } = Router;

var App = require('./components/App');
var Home = require('./components/Home');
var Hello = require('./components/Hello');

var routes = (
    <Route handler={App}>
        <Route name="home" path="/" handler={Home} />
        <Route name="hello" path="/hello/:name" handler={Hello} />
    </Route>
);

Router.run(routes, function(Handler) {
    React.render(<Handler />, document.body);
});
