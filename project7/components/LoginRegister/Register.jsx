import React from 'react';
import './LoginRegister.css';
import axios from 'axios';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: '',
      password: '',
      password2: '',
      firstName: '',
      lastName: '',
      location: '',
      description: '',
      occupation: '',
      errorMsg: '',
    };
    console.log("Register construct");
  }

  handleLoginName = (event) => {
    this.setState({loginName: event.target.value});
  };

  handlePassword = (event) => {
    this.setState({password: event.target.value});
  };

  handlePassword2 = (event) => {
    this.setState({password2: event.target.value});
  };

  handleFirstName = (event) => {
    this.setState({firstName: event.target.value});
  };

  handleLastName = (event) => {
    this.setState({lastName: event.target.value});
  };

  handleLocation = (event) => {
    this.setState({location: event.target.value});
  };

  handleDescription = (event) => {
    this.setState({description: event.target.value});
  };

  handleOccupation = (event) => {
    this.setState({occupation: event.target.value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.password !== this.state.password2) {
        this.setState({errorMsg: 'Two passwords are not consistent!'});
        return;
    }
    axios.post('/user', {
        login_name: this.state.loginName,
        password: this.state.password,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        location: this.state.location,
        description: this.state.description,
        occupation: this.state.occupation,
    }).then(
        (res) => {
            this.props.callback();
        },
        (rej) => {
            this.setState({errorMsg: rej.response.data});
        }
    );
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
            <label className='option_label'>Login Name:</label>
            <input className='login_input' type='text' required onChange={this.handleLoginName} /><br />
            <label className='option_label'>Password:</label>
            <input className='login_input' type='password' required onChange={this.handlePassword} /><br />
            <label className='option_label'>Confirm Password:</label>
            <input className='login_input' type='password' required onChange={this.handlePassword2} /><br />
            <label className='option_label'>First Name:</label>
            <input className='login_input' type='text' required onChange={this.handleFirstName} /><br />
            <label className='option_label'>Last Name:</label>
            <input className='login_input' type='text' required onChange={this.handleLastName} /><br />
            <label className='option_label'>Location:</label>
            <input className='login_input' type='text' onChange={this.handleLocation} /><br />
            <label className='option_label'>Description:</label>
            <input className='login_input' type='text' onChange={this.handleDescription} /><br />
            <label className='option_label'>Occupation:</label>
            <input className='login_input' type='text' onChange={this.handleOccupation} /><br />
            <input className='login_submit' type='submit' value='Register' />
        </form>
        <p className='error_prompt'>{this.state.errorMsg}</p>
      </div>
    );
  }
}

export default Register;
