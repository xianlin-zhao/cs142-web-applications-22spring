import React from 'react';
import {
  AppBar, Toolbar, Typography
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
      version: "",
    };
    const promise = axios.get("/test/info");
    promise.then(
      (response) => {
        this.setState({version: JSON.parse(response.data)});
      }
    ).catch(
      (response) => {
        console.log(response);
      }
    );
  }

  render() {
    const currLoc = this.props.state.currLoc;
    const userName = this.props.state.userName;
    let rightText = "";
    if (userName) {
      if (currLoc === "userDetail") {
        rightText = userName;
      } else if (currLoc === "userPhotos") {
        rightText = "Photos of " + userName;
      }
    }

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit" style={{flexGrow: 1}}>
              Xianlin Zhao V{this.state.version.__v}
          </Typography>
          <Typography variant='h5'>{rightText}</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
