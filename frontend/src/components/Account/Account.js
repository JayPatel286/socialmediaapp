import { DeleteForever, Edit, LockReset, Logout } from "@mui/icons-material";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteMyProfile, getMyPosts, logoutUser } from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import "./Account.css";

const Account = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { loading, error, posts } = useSelector((state) => state.myPosts);

  const {
    error: likeError,
    message,
    loading: deleteLoading,
  } = useSelector((state) => state.like);

  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);

  const logoutHandler = async () => {
    await dispatch(logoutUser());

    alert.success("Logged out successfully");
  };

  const deleteProfileHandler = async () => {
    await dispatch(deleteMyProfile());
    dispatch(logoutUser());
  };

  useEffect(() => {
    dispatch(getMyPosts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (likeError) {
      alert.error(likeError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, error, likeError, message, dispatch]);

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountLeft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
              isAccount="myProfile"
              isDelete={true}
            />
          ))
        ) : (
          <Typography variant="h6">You have not made any posts</Typography>
        )}
      </div>
      <div className="accountRight">
        <Avatar
          src={user.avatar.url}
          sx={{ height: "8vmax", width: "8vmax" }}
        />
        <div className="name">
          <Typography variant="h5">{user.name}</Typography>
          <Link to="/update/profile">
            <Button startIcon={<Edit />} variant="outlined">
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="accountDetails">
          <div>
            <Typography className="figure">{user.followers.length}</Typography>
            <button onClick={() => setFollowersToggle(!followersToggle)}>
              <Typography className="figureKey">Followers</Typography>
            </button>
          </div>
          <div>
            <Typography className="figure">{user.following.length}</Typography>
            <button onClick={() => setFollowingToggle(!followingToggle)}>
              <Typography className="figureKey">Following</Typography>
            </button>
          </div>
          <div>
            <Typography className="figure">{user.posts.length}</Typography>
            <button>
              <Typography className="figureKey">Posts</Typography>
            </button>
          </div>
        </div>

        <Button
          className="logoutBtn"
          variant="outlined"
          startIcon={<Logout />}
          onClick={logoutHandler}
        >
          Logout
        </Button>

        <Link to="/update/password">
          <Button startIcon={<LockReset />}>Change Password</Button>
        </Link>

        <Button
          onClick={deleteProfileHandler}
          color="error"
          startIcon={<DeleteForever />}
          disabled={deleteLoading}
        >
          Delete My Profile
        </Button>

        <Dialog
          open={followersToggle}
          onClose={() => setFollowersToggle(!followersToggle)}
        >
          <div className="DialogBox">
            <Typography
              variant="h5"
              style={{ textAlign: "center", marginBottom: "15px" }}
            >
              Followers
            </Typography>
            {user && user.followers.length > 0 ? (
              user.followers.map((follower) => (
                <User
                  key={follower._id}
                  userId={follower._id}
                  name={follower.name}
                  avatar={follower.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax 0" }}>
                You have no followers
              </Typography>
            )}
          </div>
        </Dialog>

        <Dialog
          open={followingToggle}
          onClose={() => setFollowingToggle(!followingToggle)}
        >
          <div className="DialogBox">
            <Typography
              variant="h5"
              style={{ textAlign: "center", marginBottom: "15px" }}
            >
              Following
            </Typography>
            {user && user.following.length > 0 ? (
              user.following.map((follow) => (
                <User
                  key={follow._id}
                  userId={follow._id}
                  name={follow.name}
                  avatar={follow.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax 0" }}>
                You do not follow anyone yet
              </Typography>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Account;
