import React, { useEffect } from "react";
import Post from "../Post/Post";
import User from "../User/User";
import Loader from "../Loader/Loader";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getFollowingPosts } from "../../Actions/User";
import { Typography } from "@mui/material";
import { useAlert } from "react-alert";

const Home = () => {
	const dispatch = useDispatch();
	const alert = useAlert();

	// Redux states
	const { loading, posts, error } = useSelector(
		(state) => state.postOfFollowing
	);

	console.log({ posts });
	const { users, loading: usersLoading } = useSelector(
		(state) => state.allUsers
	);
	const { error: likeError, message } = useSelector((state) => state.like);

	useEffect(() => {
		dispatch(getAllUsers());
		dispatch(getFollowingPosts());
	}, [dispatch]);

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch({ type: "clearErrors" });
		}

		if (likeError) {
			alert.error(error);
			dispatch({ type: "clearErrors" });
		}
		if (message) {
			alert.success(message);
			dispatch({ type: "clearMessage" });
		}
	}, [alert, error, likeError, message, dispatch]);

	return loading === true || usersLoading === true ? (
		<Loader />
	) : (
		<div className="home">
			<div className="homeLeft">
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
							createdAt={post.createdAt}
						/>
					))
				) : (
					<Typography variant="h6" color="white">
						No Posts Yet
					</Typography>
				)}
			</div>
			<div className="homeRight">
				<Typography variant="h5" style={{ margin: "0 0 20px 20px" }}>
					All Users
				</Typography>
				{users && users.length > 0 ? (
					users.map((user) => (
						<User
							key={user._id}
							userId={user._id}
							name={user.name}
							avatar={user.avatar.url}
						/>
					))
				) : (
					<Typography>No users yet</Typography>
				)}
			</div>
		</div>
	);
};

export default Home;
