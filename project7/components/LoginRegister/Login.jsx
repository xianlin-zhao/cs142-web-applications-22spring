import React from 'react';
import './LoginRegister.css';
import axios from 'axios';
import { Redirect } from "react-router";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: '',
      password: '',
      userId: '',
      isLogin: false,
      errorMsg: '',
    };
    console.log("Login construct");
  }

  handleLoginName = (event) => {
    this.setState({loginName: event.target.value});
  };

  handlePassword = (event) => {
    this.setState({password: event.target.value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/admin/login', {
        login_name: this.state.loginName,
        password: this.state.password,
    }).then(
        (res) => {
            this.props.callback(true, this.state.loginName, res.data.first_name, res.data._id);
            this.setState({userId: res.data._id, isLogin: true});
        },
        (rej) => {
            this.setState({errorMsg: rej.response.data});
        }
    );
  };

  render() {
    if (this.state.isLogin) {
        return (<Redirect path="/" to={"/users/" + this.state.userId} />);
    }
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
            <label className='option_label'>Login Name:</label>
            <input className='login_input' required type='text' value={this.state.loginName} onChange={this.handleLoginName} /><br />
            <label className='option_label'>Password:</label>
            <input className='login_input' required type='password' value={this.state.password} onChange={this.handlePassword} /><br />
            <input className='login_submit' type='submit' value='Submit' />
        </form>
        <p className='error_prompt'>{this.state.errorMsg}</p>
      </div>
    );
  }
}

export default Login;
