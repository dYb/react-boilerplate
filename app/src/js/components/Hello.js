'use strict'
var React = require('react');
var Router = require('react-router');
var { Link } = Router;

var Hello = React.createClass({
    mixins: [ Router.State ],
    hello: '111',
    render() {
        var name = this.getParams().name;
        console.log(this.hello)
        return (
            <div className="hello">
                <h2>Hello {name}</h2>
                <ul>
                    <li><Link to="home">Go Home</Link></li>
                </ul>
            </div>
        );
    }
});
{
    let a = '123'
}

module.exports = Hello;
