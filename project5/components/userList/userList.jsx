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
import fetchModel from '../../lib/fetchModelData';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: "",
    };

    const promise = fetchModel("http://localhost:3000/user/list");
    promise.then(
      (response) => {
        this.setState({users: JSON.parse(response.data)});
      },
      (response) => {
        console.log(response);
      }
    );
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
  }
}

export default UserList;
