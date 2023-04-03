import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
}
  from '@material-ui/core';
import { HashRouter, Route, Link } from "react-router-dom";
import './userList.css';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: window.cs142models.userListModel(),
    };
  }

  render() {
    const allUsers = [];
    for (let i = 0; i < this.state.users.length; i++) {
      let nowUser = this.state.users[i];
      let nowName = nowUser.first_name + " " + nowUser.last_name;
      allUsers.push(<div key={nowUser._id}>
        <ListItem>
          <Link to={"/users/" + nowUser._id}>{nowName}</Link>
        </ListItem>
        <Divider />
      </div>)
    }
    return (
      <div className='listUsers'>
        <List component="nav">{allUsers}</List>
      </div>
    );
    // return (
    //   <div>
    //     <Typography variant="body1">
    //       This is the user list, which takes up 3/12 of the window.
    //       You might choose to use <a href="https://mui.com/components/lists/">Lists</a> and <a href="https://mui.com/components/dividers/">Dividers</a> to
    //       display your users like so:
    //     </Typography>
    //     <List component="nav">
    //       <ListItem>
    //         <ListItemText primary="Item #1" />
    //       </ListItem>
    //       <Divider />
    //       <ListItem>
    //         <ListItemText primary="Item #2" />
    //       </ListItem>
    //       <Divider />
    //       <ListItem>
    //         <ListItemText primary="Item #3" />
    //       </ListItem>
    //       <Divider />
    //     </List>
    //     <Typography variant="body1">
    //       The model comes in from window.cs142models.userListModel()
    //     </Typography>
    //   </div>
    // );
  }
}

export default UserList;
