import React from 'react';
import './userPhotos.css';
import axios from 'axios';
import {
    Dialog, Button, DialogContent, DialogContentText, TextField, DialogActions, Chip
} from "@material-ui/core";

class CommentDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      comment: "",
    };
  }

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClickClose = () => {
    this.setState({open: false});
  };

  handleCommentChange = (event) => {
    this.setState({comment: event.target.value});
  };

  handleCommentSubmit = () => {
    let now_comment = this.state.comment;
    this.setState({comment: ""});
    this.setState({open: false});

    axios.post(`/commentsOfPhoto/${this.props.photoId}`, {
        comment: now_comment
    }).then(
        (res) => {
            this.props.onCommentSubmit();
        },
        (rej) => {
            console.log('Doing /commentsOfPhoto/:photo_id error:', rej);
        }
    );
  };

  render() {
    return (
      <div className="comment-dialog">
          <Chip label="Reply" onClick={this.handleClickOpen}/>
          {/* onClose: when mouse click outside of the dialog box, then close the dialog */}
          <Dialog open={this.state.open} onClose={this.handleClickClose} >
            <DialogContent>
              <DialogContentText>Add a comment...</DialogContentText>
              <TextField value={this.state.comment} onChange={this.handleCommentChange} autoFocus multiline 
                margin="dense" fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClickClose}>Cancel</Button>
              <Button onClick={this.handleCommentSubmit}>Submit</Button>
            </DialogActions>
          </Dialog>
      </div>
    );
  }
}

export default CommentDialog;
