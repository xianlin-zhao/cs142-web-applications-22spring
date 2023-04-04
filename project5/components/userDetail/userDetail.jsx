import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { Link } from "react-router-dom";
import './userDetail.css';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
    };

    const promise = fetchModel(`http://localhost:3000/user/${this.props.match.params.userId}`);
    promise.then(
      (response) => {
        this.setState({user: JSON.parse(response.data)});
        this.props.callback("userDetail", this.state.user.first_name + " " + this.state.user.last_name);
      },
      (response) => {
        console.log(response);
      }
    );
  }

  componentDidUpdate(otherProps) {
    if (otherProps.match.params.userId !== this.props.match.params.userId) {
      const promise = fetchModel(`http://localhost:3000/user/${this.props.match.params.userId}`);
      promise.then(
        (response) => {
          const newUser = JSON.parse(response.data);
          this.setState({user: newUser});
          this.props.callback("userDetail", newUser.first_name + " " + newUser.last_name);
        },
        (response) => {
          console.log(response);
        }
      );
    }
  }

  componentDidMount() {
    const promise = fetchModel(`http://localhost:3000/user/${this.props.match.params.userId}`);
    promise.then(
      (response) => {
        const newUser = JSON.parse(response.data);
        this.setState({user: newUser});
        this.props.callback("userDetail", newUser.first_name + " " + newUser.last_name);
      },
      (response) => {
        console.log(response);
      }
    );
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
  }
}

export default UserDetail;
