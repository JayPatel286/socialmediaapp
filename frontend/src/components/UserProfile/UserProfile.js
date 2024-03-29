import { Cake, Done } from "@mui/icons-material";
import { Avatar, Button, Chip, Dialog, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
	followAndUnfollowUser,
	getUserPosts,
	getUserProfile,
	loadUser,
} from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import "./UserProfile.css";
import moment from "moment";
import { genderIcons } from "../Account/Account";

const UserProfile = () => {
	const dispatch = useDispatch();
	const alert = useAlert();
	const params = useParams();
	const {
		user,
		loading: userLoading,
		error: userError,
	} = useSelector((state) => state.userProfile);
	const { user: me } = useSelector((state) => state.user);
	const { loading, error, posts } = useSelector((state) => state.userPosts);

	const {
		error: followError,
		message,
		loading: followLoading,
	} = useSelector((state) => state.like);

	const [followersToggle, setFollowersToggle] = useState(false);
	const [followingToggle, setFollowingToggle] = useState(false);
	const [following, setFollowing] = useState(false);
	const [myProfile, setMyProfile] = useState(false);

	const followHandler = async () => {
		setFollowing(!following);

		await dispatch(followAndUnfollowUser(user._id));
		dispatch(getUserProfile(params.id));
		dispatch(loadUser());
	};

	useEffect(() => {
		dispatch(getUserPosts(params.id));
		dispatch(getUserProfile(params.id));
	}, [dispatch, params.id]);

	useEffect(() => {
		if (me._id === params.id) {
			setMyProfile(true);
		}

		setFollowing(false);
		if (user) {
			user.followers.forEach((item) => {
				if (me._id === item._id) {
					setFollowing(true);
				}
			});
		}
	}, [user, me._id, params.id]);

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch({ type: "clearErrors" });
		}

		if (followError) {
			alert.error(followError);
			dispatch({ type: "clearErrors" });
		}
		if (userError) {
			alert.error(userError);
			dispatch({ type: "clearErrors" });
		}
		if (message) {
			alert.success(message);
			dispatch({ type: "clearMessage" });
		}
	}, [alert, error, followError, userError, message, dispatch]);

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
							isAccount="userProfile"
							createdAt={post.createdAt}
						/>
					))
				) : (
					<Typography variant="h6">User has not made any posts</Typography>
				)}
			</div>
			<div className="accountRight">
				{user && (
					<>
						<Avatar
							src={user.avatar.url}
							sx={{ height: "8vmax", width: "8vmax" }}
						/>

						<Stack direction="row" alignItems="center" gap={1}>
							<Typography
								variant="subtitle2"
								fontSize={20}
								style={{ margin: "20px 0" }}
							>
								{user.name}
							</Typography>

							{myProfile ? null : (
								// <button
								// 	className="followBtn"
								// 	disabled={followLoading}
								// 	style={{
								// 		backgroundColor: following ? "#fff" : "#2691d9",
								// 		color: following ? "#111" : "#fff",
								// 		border: following ? "" : "none",
								// 		marginTop: "20px",
								// 	}}
								// 	onClick={followHandler}
								// >
								// 	{following ? (
								// 		<>
								// 			<Done className="icon" />
								// 			Following
								// 		</>
								// 	) : (
								// 		"Follow"
								// 	)}
								// </button>
								<Button
									disabled={followLoading}
									variant={following ? "outlined" : "contained"}
									startIcon={following ? <Done /> : null}
									sx={{ textTransform: "capitalize" }}
									onClick={followHandler}
								>
									{following ? "UnFollow" : "Follow"}
								</Button>
							)}
						</Stack>

						<div className="accountDetails">
							<div>
								<Typography className="figure">
									{user.followers.length}
								</Typography>
								<button onClick={() => setFollowersToggle(!followersToggle)}>
									<Typography className="figureKey">Followers</Typography>
								</button>
							</div>
							<div>
								<Typography className="figure">
									{user.following.length}
								</Typography>
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

						<Typography variant="overline" fontSize={12} my={2}>
							Personal Information
						</Typography>

						<Stack
							direction="row"
							gap={1}
							// justifyContent="left"
							pl={5}
							width={"90%"}
							alignItems="center"
						>
							<Typography variant="overline" fontSize={14} my={2}>
								Gender
							</Typography>
							<Chip icon={genderIcons[user.gender]} label={user.gender} />
						</Stack>

						<Stack gap={1} justifyContent="left" width={"90%"} pl={5}>
							<Typography variant="overline" fontSize={14}>
								Hobbies
							</Typography>

							<Stack direction="row" gap={1} flexWrap="wrap">
								{user.hobbies.map((h) => (
									<Chip label={h} />
								))}
							</Stack>
						</Stack>

						<Stack
							gap={1}
							direction="row"
							mt={2}
							alignItems="center"
							width={"90%"}
							pl={5}
						>
							<Cake />

							<Typography variant="overline" fontSize={14}>
								{user.dateOfBirth &&
									moment(user.dateOfBirth).format("Do MMMM YYYY")}
							</Typography>
						</Stack>

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
					</>
				)}
			</div>
		</div>
	);
};

export default UserProfile;
