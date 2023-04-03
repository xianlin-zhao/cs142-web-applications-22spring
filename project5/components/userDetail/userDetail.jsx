import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { HashRouter, Route, Link } from "react-router-dom";
import './userDetail.css';


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: window.cs142models.userModel(this.props.match.params.userId),
    };
    this.props.callback("userDetail", this.state.user.first_name + " " + this.state.user.last_name);
  }

  componentDidUpdate(otherProps) {
    if (otherProps.match.params.userId !== this.props.match.params.userId) {
      const newUser = window.cs142models.userModel(this.props.match.params.userId);
      this.setState({user: newUser});
      this.props.callback("userDetail", newUser.first_name + " " + newUser.last_name);
    }
  }

  componentDidMount() {
    this.setState({user: window.cs142models.userModel(this.props.match.params.userId)});
    this.props.callback("userDetail", this.state.user.first_name + " " + this.state.user.last_name);
  }

  render() {
    return (
      <div className='detailUser'>
        <List component="nav">
          <ListItem>
            <ListItemText primary={"id:  " + this.state.user._id} />
          </ListItem>
          <ListItem>
            <ListItemText primary={"name:  " + this.state.user.first_name + " " + this.state.user.last_name} />
          </ListItem>
          <ListItem>
            <ListItemText primary={"location:  " + this.state.user.location} />
          </ListItem>
          <ListItem>
            <ListItemText primary={"description:  " + this.state.user.description} />
          </ListItem>
          <ListItem>
            <ListItemText primary={"occupation:  " + this.state.user.occupation} />
          </ListItem>
        </List>
        <br />
        <Typography variant='body1'>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to={"/photos/" + this.props.match.params.userId}>Photos shared by the user</Link>
        </Typography>
      </div>
    );

    // return (
    //   <Typography variant="body1">
    //     This should be the UserDetail view of the PhotoShare app. Since
    //     it is invoked from React Router the params from the route will be
    //     in property match. So this should show details of user:
    //     {this.props.match.params.userId}. You can fetch the model for the
    //     user from window.cs142models.userModel(userId).
    //   </Typography>
    // );
  }
}

export default UserDetail;
