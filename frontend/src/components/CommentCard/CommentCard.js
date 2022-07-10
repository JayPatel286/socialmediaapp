import { Button, Typography } from "@mui/material";
import React from "react";
import { Link, useParams } from "react-router-dom";
import "./CommentCard.css";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentOnPost } from "../../Actions/Post";
import {
  getFollowingPosts,
  getMyPosts,
  getUserPosts,
} from "../../Actions/User";

const CommentCard = ({
  userId,
  name,
  avatar,
  comment,
  commentId,
  postId,
  isAccount = "home",
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();

  const deleteCommentHandler = async () => {
    await dispatch(deleteCommentOnPost(postId, commentId));

    if (isAccount === "home") {
      dispatch(getFollowingPosts());
    } else if (isAccount === "myProfile") {
      dispatch(getMyPosts());
    } else if (isAccount === "userProfile") {
      dispatch(getUserPosts(params.id));
    }
  };

  return (
    <div className="commentUser">
      <Link to={`/user/${userId}`}>
        <img src={avatar} alt={name} />
        <Typography>{name}</Typography>
      </Link>
      <Typography style={{ marginLeft: "10px" }}>{comment}</Typography>

      {isAccount === "myProfile" ? (
        <Button onClick={deleteCommentHandler}>
          <Delete />
        </Button>
      ) : userId === user._id ? (
        <Button onClick={deleteCommentHandler}>
          <Delete />
        </Button>
      ) : null}
    </div>
  );
};

export default CommentCard;
