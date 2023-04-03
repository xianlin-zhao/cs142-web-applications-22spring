import React from 'react';
import {
  Typography
} from '@material-ui/core';
import { HashRouter, Route, Link } from "react-router-dom";
import './userPhotos.css';


/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: window.cs142models.photoOfUserModel(this.props.match.params.userId),
      user: window.cs142models.userModel(this.props.match.params.userId),
    };
    this.props.callback("userPhotos", this.state.user.first_name + " " + this.state.user.last_name);
  }

  photoComments(nowComments) {
    if (nowComments) {
      return (
        nowComments.map((perComment) => (
          <Typography variant='body1' key={perComment._id}>
            {perComment.comment}<br />
            <Link to={"/users/" + perComment.user._id}>
              {perComment.user.first_name + " " + perComment.user.last_name + "  "}
            </Link>
            <br />
            {perComment.date_time}
            <br /><br/>
          </Typography>
        ))
      );
    }
  }

  render() {
    let allPhotos = [];
    for (let i = 0; i < this.state.photos.length; i++) {
      let nowPhoto = this.state.photos[i];
      let photoFile = "./images/" + nowPhoto.file_name;
      let dateTime = nowPhoto.date_time;
      let nowComments = nowPhoto.comments;
      allPhotos.push(
        <div key={nowPhoto._id}>
          <img className='userImage' src={photoFile}/>
          <br />
          <Typography variant='caption'>
            creation date: {dateTime}
          </Typography>
          <br /><br />
          {this.photoComments(nowComments)}
          <br /><br />
        </div>
      );
    }
    return (
      <div>
        {allPhotos}
      </div>
    );
    // return (
    //   <Typography variant="body1">
    //   This should be the UserPhotos view of the PhotoShare app. Since
    //   it is invoked from React Router the params from the route will be
    //   in property match. So this should show details of user:
    //   {this.props.match.params.userId}. You can fetch the model for the user from
    //   window.cs142models.photoOfUserModel(userId):
    //     <Typography variant="caption">
    //       {JSON.stringify(window.cs142models.photoOfUserModel(this.props.match.params.userId))}
    //     </Typography>
    //   </Typography>

    // );
  }
}

export default UserPhotos;
