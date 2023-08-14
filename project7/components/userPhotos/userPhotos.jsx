import React from 'react';
import {
  Grid, 
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  List,
  Typography,
} from '@material-ui/core';
import { Link } from "react-router-dom";
import './userPhotos.css';
import axios from 'axios';
import CommentDialog from './commentDialog';

function photoComments(nowComments) {
  if (nowComments) {
    return (
      nowComments.map((perComment) => (
        <List key={perComment._id}>
          <Typography variant='subtitle2'>
            <Link to={"/users/" + perComment.user._id}>
              {perComment.user.first_name + " " + perComment.user.last_name + "  "}
            </Link>
          </Typography>
          <Typography variant='caption' color='textSecondary' gutterBottom>
            {perComment.date_time}
          </Typography>
          <Typography variant='body1'>
            {perComment.comment}
          </Typography>
        </List>
      ))
    );
  }
  return "";
}

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

    this.axiosGetPhotosUser();
  }

  axiosGetPhotosUser = () => {
    const promise0 = axios.get(`/photosOfUser/${this.props.match.params.userId}`);
    promise0.then(
      (response) => {
        this.setState({photos: response.data});
      }
    ).catch(
      (response) => {
        console.log(response);
      }
    );

    const promise1 = axios.get(`/user/${this.props.match.params.userId}`);
    promise1.then(
      (response) => {
        this.setState({user: response.data});
        this.props.callback("userPhotos", this.state.user.first_name + " " + this.state.user.last_name);
      }
    ).catch(
      (response) => {
        console.log(response);
      }
    );
  };

  componentDidUpdate(otherProps) {
    if (otherProps.photoIsUploaded !== this.props.photoIsUploaded && this.props.photoIsUploaded) {
      console.log('photo uploaded');
      this.axiosGetPhotosUser();
    }
  }

  handleUpload = () => {
    console.log('comment submit');
    this.axiosGetPhotosUser();
  };

  render() {
    let allPhotos = [];
    for (let i = 0; i < this.state.photos.length; i++) {
      let nowPhoto = this.state.photos[i];
      let photoFile = "./images/" + nowPhoto.file_name;
      let dateTime = nowPhoto.date_time;
      let nowComments = nowPhoto.comments;
      allPhotos.push(
        <Grid item xs={6} key={nowPhoto._id}>
          <Card variant="outlined">
            <CardHeader 
              subheader={dateTime}
            />
            <CardMedia
              component="img"
              image={photoFile}
              alt='Author Post'
            />
            <CardContent>
              {photoComments(nowComments)}
              <CommentDialog onCommentSubmit={this.handleUpload} photoId={nowPhoto._id} />
            </CardContent>
          </Card>
        </Grid>
      );
    }

    return (
      <Grid justifyContent='center' container spacing={1}>
        {allPhotos}
      </Grid>
    );
  }
}

export default UserPhotos;
