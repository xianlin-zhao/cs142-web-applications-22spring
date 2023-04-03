import React from 'react';
import {
  Typography
} from '@material-ui/core';
import { HashRouter, Route, Link } from "react-router-dom";
import './userPhotos.css';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: "",
      user: "",
    };

    const promise0 = fetchModel(`http://localhost:3000/photosOfUser/${this.props.match.params.userId}`);
    promise0.then(
      (response) => {
        this.setState({photos: JSON.parse(response.data)});
      },
      (response) => {
        console.log(response);
      }
    );

    const promise1 = fetchModel(`http://localhost:3000/user/${this.props.match.params.userId}`);
    promise1.then(
      (response) => {
        this.setState({user: JSON.parse(response.data)});
        this.props.callback("userPhotos", this.state.user.first_name + " " + this.state.user.last_name);
      },
      (response) => {
        console.log(response);
      }
    );
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
  }
}

export default UserPhotos;
