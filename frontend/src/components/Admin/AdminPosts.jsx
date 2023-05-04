import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, getAllPostsForAdmin } from "../../Actions/Admin";
import {
	Alert,
	CircularProgress,
	IconButton,
	Snackbar,
	Stack,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Delete } from "@mui/icons-material";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmationDialogue from "../ConfirmationDialogue";

const AdminPosts = () => {
	const [open, setOpen] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [status, setStatus] = useState("error");
	const [alertMessage, setAlertMessage] = useState("");
	const dispatch = useDispatch();

	const { loading, deleteLoading, error, posts, message } = useSelector(
		(state) => state.admin
	);

	useEffect(() => {
		if (error) {
			setOpen(true);
			setStatus("error");
			setAlertMessage(error);
			dispatch({ type: "clearErrors" });
		}
		if (message) {
			setOpen(true);
			setStatus("success");
			setAlertMessage(message);
			dispatch({ type: "clearMessage" });
		}

		dispatch(getAllPostsForAdmin());
	}, [dispatch, error, message]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const columns = [
		{
			field: "image",
			headerName: "Image",
			flex: 0.4,
			sortable: false,
			renderCell: (params) => {
				return (
					<img
						style={{ width: 80, height: 80, objectFit: "cover" }}
						src={params.value}
						alt={params.row.caption}
					/>
				);
			},
		},
		{
			field: "caption",
			headerName: "Caption",
			flex: 0.8,
		},
		{
			field: "likes",
			headerName: "Likes",
			flex: 0.3,
		},
		{
			field: "comments",
			headerName: "Comments",
			flex: 0.3,
		},
		{
			field: "owner",
			headerName: "Owner ID",
			flex: 0.6,
			sortable: false,
		},
		{
			field: "date",
			headerName: "Created on",
			flex: 0.4,
		},
		{
			flex: 0.3,
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<IconButton
							disabled={deleteLoading}
							color="error"
							onClick={() => {
								setDeleteId(params.row.id);
								setOpenConfirm(true);
							}}
						>
							<Delete />
						</IconButton>
					</>
				);
			},
		},
	];

	const rows = [];
	posts &&
		posts.forEach((post) => {
			rows.push({
				id: post._id,
				image: post.image.url,
				caption: post.caption,
				owner: post.owner,
				likes: post.likes?.length,
				comments: post.comments?.length,
				date: moment(post.createdAt).format("Do MMMM YYYY"),
			});
		});

	const handleDeletePost = () => {
		if (deleteId) dispatch(deletePost(deleteId));

		setDeleteId(null);
	};

	return (
		<div>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
					{alertMessage}
				</Alert>
			</Snackbar>
			<ConfirmationDialogue
				title="Delete Post"
				content="Are you sure you want to delete the post?"
				open={openConfirm}
				setOpen={setOpenConfirm}
				onConfirm={handleDeletePost}
			/>
			<Typography variant="subtitle2" fontSize={22} mb={1}>
				All posts created by users
			</Typography>

			<Typography variant="subtitle2" fontSize={14} my={1} color="gray">
				In the posts section, you can review and manage all posts with their
				details. You can view and delete any post. Access to this area is
				limited. Only admins can reach.
			</Typography>

			{loading ? (
				<Stack
					sx={{ minHeight: "50%" }}
					alignItems="center"
					justifyContent="center"
				>
					<CircularProgress />
				</Stack>
			) : (
				<DataGrid
					sx={{ marginTop: "20px" }}
					rows={rows}
					rowsPerPageOptions={[5]}
					getRowHeight={() => "auto"}
					columns={columns}
					pageSize={5}
					disableSelectionOnClick
					autoHeight
				/>
			)}
		</div>
	);
};

export default AdminPosts;
