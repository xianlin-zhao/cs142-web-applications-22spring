import React from 'react';
import {
  Divider,
  List,
  ListItem,
}
  from '@material-ui/core';
import { Link } from "react-router-dom";
import './userList.css';
import axios from 'axios';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: "",
    };

    const promise = axios.get("/user/list");
    promise.then(
      (response) => {
        this.setState({users: response.data});
      }
    ).catch(
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
      allUsers.push(
        <div key={nowUser._id}>
          <ListItem>
            <Link to={"/users/" + nowUser._id}>{nowName}</Link>
          </ListItem>
          <Divider />
        </div>
      );
    }
    return (
      <div className='listUsers'>
        <List component="nav">{allUsers}</List>
      </div>
    );
  }
}

export default UserList;
