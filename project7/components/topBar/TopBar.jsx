import React from 'react';
import {
  AppBar, Grid, Toolbar, Typography, Button
} from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // version: "",
    };
    this.uploadInput = null;
    console.log("Topbar construct");
    // const promise = axios.get("/test/info");
    // promise.then(
    //   (response) => {
    //     this.setState({version: JSON.parse(response.data)});
    //   }
    // ).catch(
    //   (response) => {
    //     console.log(response);
    //   }
    // );
  }

  handleLogout = () => {
    axios.post('/admin/logout').then(
      (res) => {
        this.props.callback(false, '', '', '');
      },
      (rej) => {
        console.error(rej);
      }
    );
    document.getElementById("bar_right").innerText = "";
  };

  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {

     // Create a DOM form and add the file to it under the name uploadedphoto
     const domForm = new FormData();
     domForm.append('uploadedphoto', this.uploadInput.files[0]);
     axios.post('/photos/new', domForm)
       .then((res) => {
         console.log(res);
         this.props.onPhotoUpload();
       })
       .catch(err => console.log(`POST ERR: ${err}`));
 }
};

  render() {
    const currLoc = this.props.state.currLoc;
    const userName = this.props.state.userName;
    let rightText = "";
    if (userName && userName.length > 0) {
      if (currLoc === "userDetail") {
        rightText = userName;
      } else if (currLoc === "userPhotos") {
        rightText = "Photos of " + userName;
      }
    }

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Grid container spacing={2}>
            <Grid item sm={2}>
              {
                this.props.state.loginFlag ?
                  <p>Hi {this.props.state.firstName}</p>:
                  <p>Please Login</p>
              }
            </Grid>
            <Grid item sm={2}>
              {
                this.props.state.loginFlag ?
                <p className='bar_logout' onClick={this.handleLogout}>Log Out</p>
                :
                <></>
              }
            </Grid>
            <Grid item sm={4}>
              <p id='bar_right'>{rightText}</p>
            </Grid>
            <Grid item sm={4}>
              {
                this.props.state.loginFlag ?
                <div>
                  <label className='custom_file_input'>
                    Choose
                    <input className='myfile' type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
                  </label>                  
                  <p className='bar_upload' onClick={this.handleUploadButtonClicked}>Upload</p>
                </div>
                :
                <></>
              }
            </Grid>
          </Grid>

          {/* <Typography variant="h5" color="inherit" style={{flexGrow: 1}}>
              Xianlin Zhao V{this.state.version.__v}
          </Typography>
          <Typography variant='h5'>{rightText}</Typography> */}
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
