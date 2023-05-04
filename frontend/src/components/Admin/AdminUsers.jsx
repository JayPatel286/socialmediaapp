import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	blockOrUnblockUser,
	deleteUser,
	getAllUsersForAdmin,
} from "../../Actions/Admin";
import {
	Alert,
	Avatar,
	Chip,
	CircularProgress,
	IconButton,
	Snackbar,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Block, Delete, LockOpen } from "@mui/icons-material";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmationDialogue from "../ConfirmationDialogue";

const AdminUsers = () => {
	const [open, setOpen] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [status, setStatus] = useState("error");
	const [alertMessage, setAlertMessage] = useState("");
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.user);
	const { loading, deleteLoading, blockLoading, error, users, message } =
		useSelector((state) => state.admin);

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

		dispatch(getAllUsersForAdmin());
	}, [dispatch, error, message]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const handleBlock = (id) => {
		dispatch(blockOrUnblockUser(id));
	};

	const columns = [
		{
			field: "avatar",
			headerName: "Avatar",
			flex: 0.2,
			sortable: false,
			renderCell: (params) => {
				return <Avatar src={params.value} alt={params.row.name} />;
			},
		},
		{
			field: "name",
			headerName: "Name",
			flex: 0.4,
			renderCell: (params) => {
				return (
					<Typography
						variant="subtitle2"
						color={params.row.isBlocked ? "red" : ""}
					>
						{params.value}
					</Typography>
				);
			},
		},
		{
			field: "email",
			headerName: "Email ID",
			flex: 0.6,
		},
		{
			field: "gender",
			headerName: "Gender",
			flex: 0.2,
		},
		{
			field: "hobbies",
			headerName: "Hobbies",
			flex: 0.8,
			sortable: false,
			renderCell: (params) => {
				return (
					<Stack direction="row" overflow="hidden">
						{params.value.map((h) => (
							<Chip size="small" label={h} />
						))}
					</Stack>
				);
			},
		},
		{
			field: "date",
			headerName: "Date of Birth",
			flex: 0.5,
		},
		{
			flex: 0.3,
			sortable: false,
			renderCell: (params) => {
				return (
					params.row.id !== user._id && (
						<>
							<IconButton
								disabled={blockLoading}
								color={params.row.isBlocked ? "primary" : "error"}
								onClick={() => handleBlock(params.row.id)}
							>
								{params.row.isBlocked ? (
									<Tooltip title="Unblock">
										<LockOpen />
									</Tooltip>
								) : (
									<Tooltip title="Block">
										<Block />
									</Tooltip>
								)}
							</IconButton>
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
					)
				);
			},
		},
	];

	const rows = [];
	users &&
		users.forEach((user) => {
			rows.push({
				id: user._id,
				avatar: user.avatar.url,
				name: user.name,
				email: user.email,
				gender: user.gender,
				isBlocked: user.isBlocked,
				hobbies: user.hobbies,
				date: moment(user.dateOfBirth).format("Do MMMM YYYY"),
			});
		});

	const handleDeleteUser = () => {
		if (deleteId) dispatch(deleteUser(deleteId));

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
				title="Delete User"
				content="Are you sure you want to delete the user?"
				open={openConfirm}
				setOpen={setOpenConfirm}
				onConfirm={handleDeleteUser}
			/>
			<Typography variant="subtitle2" fontSize={22} mb={1}>
				All Registered Users
			</Typography>

			<Typography variant="subtitle2" fontSize={14} my={1} color="gray">
				In the users section, you can review and manage all users with their
				details. You can view, block/unblock and delete any user. Access to this
				area is limited. Only admins can reach.
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
					// getRowHeight={() => 'auto'}
					columns={columns}
					pageSize={5}
					disableSelectionOnClick
					autoHeight
				/>
			)}
		</div>
	);
};

export default AdminUsers;
