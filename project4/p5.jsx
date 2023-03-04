import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from "react-router-dom";
import Header from './components/header/Header';

import Example from './components/example/Example';
import States from './components/states/States';

import './p5.css';

class SwitchingRouter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HashRouter>
                <div className='toolbar'>
                    <ul>
                        <li><Link to="/states">Switch to States</Link></li>
                        <li><Link to="/example">Switch to Example</Link></li>
                    </ul>
                </div>
                <Route path="/states" component={States} />
                <Route path="/example" component={Example} />
            </HashRouter>
        );
    }
}

ReactDOM.render(
    <div>
        <Header />
        <SwitchingRouter />
    </div>,
    document.getElementById('reactapp'),
);
