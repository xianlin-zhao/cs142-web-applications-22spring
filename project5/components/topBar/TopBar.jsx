import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
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
              Xianlin Zhao
          </Typography>
          <Typography variant='h5'>{rightText}</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
