import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header/Header';

import Example from './components/example/Example';
import States from './components/states/States';

class Switching extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toView: "Switch to Example",
        };
    }

    handleChange() {
        if (this.state.toView === "Switch to Example") {
            this.setState({ toView: "Switch to States" });
        } else {
            this.setState({ toView: "Switch to Example"});
        }
    }

    myDisplay() {
        if (this.state.toView === "Switch to Example") {
            return <States />;
        } else {
            return <Example />;
        }
    }

    render() {
        return (
            <div>
                <button onClick={() => this.handleChange()}>
                    {this.state.toView}
                </button>
                <br></br>
                {this.myDisplay()}
            </div>
        );
    }
}

ReactDOM.render(
    <div>
        <Header />
        <Switching />
    </div>,
    document.getElementById('reactapp'),
);
