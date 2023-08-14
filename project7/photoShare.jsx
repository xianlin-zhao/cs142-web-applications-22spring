import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import LoginRegister from './components/LoginRegister/LoginRegister';
import UserPhotos from './components/userPhotos/userPhotos';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currLoc: '',
      userName: '',
      loginFlag: false,
      loginName: '',
      firstName: '',
      userId: '',
      photoFlag: false,
    };
  }

  updateState = (loc, name) => {
    this.setState({
      currLoc: loc,
      userName: name
    });
    console.log(this.state);
  };

  updateLogin = (login_flag, login_name, first_name, user_id) => {
    this.setState({
      loginFlag: login_flag,
      loginName: login_name,
      firstName: first_name,
      userId: user_id
    });
    console.log(this.state);
  };

  handlePhotoUpload = () => {
    this.setState({photoFlag: true});
    this.setState({photoFlag: false});
  };

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar state={this.state} callback={this.updateLogin} onPhotoUpload={this.handlePhotoUpload} />
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="cs142-main-grid-item">
            {
              this.state.loginFlag ?
              <UserList />
              :
              <Redirect path="/users/:userId" to="/login-register" />
            }
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item">
            <Switch>
              {
                this.state.loginFlag ?
                <Route path="/users/:userId"
                  render={ props => <UserDetail {...props} callback={this.updateState} /> }
                /> :
                <Redirect path="/users/:userId" to="/login-register" />
              }
              {
                this.state.loginFlag ?
                <Route path="/photos/:userId"
                  render ={ props => <UserPhotos {...props} callback={this.updateState} 
                    photoIsUploaded={this.state.photoFlag} user_id={this.state.userId} /> }
                /> :
                <Redirect path="/users/:userId" to="/login-register" />
              }
              <Route path="/login-register"
                render={ props => <LoginRegister {...props} callback={this.updateLogin} /> }
              />
              <LoginRegister callback={this.updateLogin} />
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
