import React from 'react';
import './LoginRegister.css';
import Login from './Login';
import Register  from './Register';

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerState: 0,
    };
    console.log("LoginRegister construct");
  }

  handleNew = () => {
    this.setState({registerState: 1});
  };

  handleRegister = () => {
    this.setState({registerState: 2});
  };

  renderDown = () => {
    if (this.state.registerState === 0) {
      return <p className='prompt' onClick={this.handleNew}>No account? Register now!</p>;
    } else if (this.state.registerState === 1) {
      return <Register callback={this.handleRegister} />;
    } else {
      return <p className='prompt'>Welcome!</p>;
    }
  };

  render() {
    return (
      <div>
        <Login callback = {this.props.callback} />
        {this.renderDown()}
      </div>
    );
  }
}

export default LoginRegister;
