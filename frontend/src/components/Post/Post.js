import { Avatar, Button, Dialog, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
  Edit,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentOnPost,
  deletePost,
  likePost,
  updatePost,
} from "../../Actions/Post";
import {
  getFollowingPosts,
  getMyPosts,
  getUserPosts,
  loadUser,
} from "../../Actions/User";
import User from "../User/User";
import CommentCard from "../CommentCard/CommentCard";

const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = "home",
}) => {
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentToggle, setCommentToggle] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [captionToggle, setCaptionToggle] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption);

  const dispatch = useDispatch();
  const params = useParams();
  const { user } = useSelector((state) => state.user);

  const handleLike = async () => {
    setLiked(!liked);

    await dispatch(likePost(postId));

    if (isAccount === "myProfile") {
      dispatch(getMyPosts());
    } else if (isAccount === "home") {
      dispatch(getFollowingPosts());
    } else if (isAccount === "userProfile") {
      dispatch(getUserPosts(params.id));
    }
  };

  const addCommentHandler = async (e) => {
    e.preventDefault();

    await dispatch(addCommentOnPost(postId, commentValue));

    if (isAccount === "myProfile") {
      dispatch(getMyPosts());
    } else if (isAccount === "home") {
      dispatch(getFollowingPosts());
    } else if (isAccount === "userProfile") {
      dispatch(getUserPosts(params.id));
    }
    setCommentValue("");
  };

  useEffect(() => {
    likes.forEach((item) => {
      if (item._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);

  const updateCaptionHandler = async (e) => {
    e.preventDefault();

    await dispatch(updatePost(captionValue, postId));
    dispatch(getMyPosts());
  };

  const deletePostHandler = async () => {
    await dispatch(deletePost(postId));
    dispatch(getMyPosts());
    dispatch(loadUser());
  };

  return (
    <div className="post">
      <div className="postHeader">
        <div className="postOwner">
          <Avatar
            src={ownerImage}
            alt="User"
            sx={{
              height: "3vmax",
              width: "3vmax",
            }}
          />

          <Link to={`/user/${ownerId}`}>
            <Typography fontWeight={700}>{ownerName}</Typography>
          </Link>
        </div>
        {isAccount === "myProfile" && (
          <IconButton onClick={() => setCaptionToggle(!captionToggle)}>
            <MoreVert />
          </IconButton>
        )}
        <Dialog
          open={captionToggle}
          onClose={() => setCaptionToggle(!captionToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h5" style={{ textAlign: "center" }}>
              Update Caption
            </Typography>
            <form className="captionForm" onSubmit={updateCaptionHandler}>
              <div className="input-box">
                <Edit className="icon" />
                <div className="input-field">
                  <input
                    type="text"
                    value={captionValue}
                    required
                    onChange={(e) => setCaptionValue(e.target.value)}
                  />
                  <label>Caption</label>
                </div>
              </div>

              <Button type="submit" variant="contained">
                Update
              </Button>
            </form>
          </div>
        </Dialog>
      </div>

      <img src={postImage} alt="Post" />
      <div className="postFooter">
        <button onClick={handleLike}>
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </button>
        <button onClick={() => setCommentToggle(!commentToggle)}>
          <ChatBubbleOutline />
        </button>
        {isDelete && (
          <button onClick={deletePostHandler}>
            <DeleteOutline />
          </button>
        )}
      </div>
      <button
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "10px",
        }}
        onClick={() => setLikesUser(!likesUser)}
        disabled={likes.length === 0 ? true : false}
      >
        <Typography style={{ fontSize: "14px" }}>
          {likes.length} Likes
        </Typography>
      </button>

      <div className="postDetails">
        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>

        <Typography
          fontWeight={400}
          color="rgba(0,0,0,0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>
      <div className="addComment">
        <Avatar
          src={user.avatar.url}
          alt="User"
          sx={{
            height: "3vmax",
            width: "3vmax",
          }}
        />
        <form className="commentForm" onSubmit={addCommentHandler}>
          <div className="input-box">
            <div className="input-field">
              <input
                type="text"
                value={commentValue}
                required
                onChange={(e) => setCommentValue(e.target.value)}
              />
              <label>Add a Comment...</label>
            </div>
          </div>
        </form>
      </div>

      <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className="DialogBox">
          <Typography
            variant="h5"
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Liked By
          </Typography>
          {likes.map((like) => (
            <User
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar.url}
            />
          ))}
        </div>
      </Dialog>

      <Dialog
        open={commentToggle}
        onClose={() => setCommentToggle(!commentToggle)}
      >
        <div className="DialogBox">
          <Typography
            variant="h5"
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Comments
          </Typography>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard
                key={comment._id}
                userId={comment.user._id}
                name={comment.user.name}
                avatar={comment.user.avatar.url}
                comment={comment.comment}
                postId={postId}
                commentId={comment._id}
                isAccount={isAccount}
              />
            ))
          ) : (
            <Typography style={{ margin: "20px 0 0 20px" }}>
              No Comments yet
            </Typography>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default Post;
