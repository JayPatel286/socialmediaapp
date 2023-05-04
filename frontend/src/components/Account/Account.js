import {
	Cake,
	Dashboard,
	DeleteForever,
	Edit,
	Female,
	LockReset,
	Logout,
	Male,
	Transgender,
} from "@mui/icons-material";
import {
	Avatar,
	Button,
	Chip,
	Dialog,
	IconButton,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteMyProfile, getMyPosts, logoutUser } from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import moment from "moment";

import "./Account.css";

// Icons for gender
export const genderIcons = {
	Male: <Male />,
	Female: <Female />,
	Other: <Transgender />,
};

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
							createdAt={post.createdAt}
						/>
					))
				) : (
					<Typography variant="h6" color={"white"}>
						You have not made any posts
					</Typography>
				)}
			</div>
			<div className="accountRight">
				<Avatar
					src={user.avatar.url}
					sx={{ height: "8vmax", width: "8vmax" }}
				/>
				<div className="name">
					<Typography variant="body2" fontSize={20}>
						{user.name}
					</Typography>
					<Link to="/update/profile">
						<Tooltip title="Edit Profile">
							<IconButton color="primary">
								<Edit />
							</IconButton>
						</Tooltip>
					</Link>
				</div>

				{user && user.role === "admin" && (
					<Link to="/admin/dashboard">
						<Button
							sx={{ marginBottom: 2 }}
							startIcon={<Dashboard />}
							color="primary"
						>
							Open Dashboard
						</Button>
					</Link>
				)}

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

				<Button
					className="logoutBtn"
					variant="outlined"
					startIcon={<Logout />}
					onClick={logoutHandler}
					sx={{ marginBottom: 5 }}
				>
					Logout
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
