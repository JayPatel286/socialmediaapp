import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	deletePost,
	deleteReport,
	getAllReportsForAdmin,
	processReport,
} from "../../Actions/Admin";
import {
	Alert,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { ChangeCircle, Delete, HideImage } from "@mui/icons-material";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmationDialogue from "../ConfirmationDialogue";

const AdminReports = () => {
	const [open, setOpen] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [status, setStatus] = useState("error");
	const [alertMessage, setAlertMessage] = useState("");
	const [statusModal, setStatusModal] = useState(false);
	const [statusValue, setStatusValue] = useState("");
	const dispatch = useDispatch();

	const { loading, deleteLoading, processLoading, error, reports, message } =
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

		dispatch(getAllReportsForAdmin());
	}, [dispatch, error, message]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const handlePostDelete = (postId, reportId) => {
		dispatch(deletePost(postId));
		dispatch(deleteReport(reportId));
	};

	const columns = [
		{
			field: "post",
			headerName: "Post",
			flex: 0.3,
			sortable: false,
			renderCell: (params) => {
				return (
					<img
						style={{ width: 80, height: 80, objectFit: "cover" }}
						src={params.value?.image.url}
						alt={params.value?.caption}
					/>
				);
			},
		},
		{
			field: "user",
			headerName: "User",
			flex: 0.4,
			renderCell: (params) => {
				return <Typography variant="subtitle2">{params.value.name}</Typography>;
			},
		},
		{
			field: "message",
			headerName: "Message",
			flex: 0.4,
		},
		{
			field: "status",
			headerName: "Status",
			flex: 0.3,
			renderCell: (params) => {
				return (
					<Chip
						variant="outlined"
						color={params.value === "closed" ? "success" : "warning"}
						label={params.value}
					/>
				);
			},
		},
		{
			field: "date",
			headerName: "Created on",
			flex: 0.4,
		},
		{
			flex: 0.4,
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Tooltip title="Delete post">
							<IconButton
								disabled={processLoading}
								color="error"
								onClick={() =>
									handlePostDelete(params.row.post._id, params.row.id)
								}
							>
								<HideImage />
							</IconButton>
						</Tooltip>
						<Tooltip title="Update Status">
							<IconButton
								disabled={processLoading}
								color="primary"
								onClick={() => {
									setDeleteId(params.row.id);
									setStatusModal(true);
								}}
							>
								<ChangeCircle />
							</IconButton>
						</Tooltip>
						<Tooltip title="Delete Report">
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
						</Tooltip>
					</>
				);
			},
		},
	];

	const rows = [];
	reports &&
		reports.forEach((report) => {
			rows.push({
				id: report._id,
				post: report.post,
				user: report.user,
				status: report.status,
				message: report.message,
				date: moment(report.createdAt).format("Do MMMM YYYY"),
			});
		});

	const handleDeleteReport = () => {
		if (deleteId) dispatch(deleteReport(deleteId));

		setDeleteId(null);
	};

	const handleStatus = () => {
		if (deleteId && statusValue) dispatch(processReport(deleteId, statusValue));

		setDeleteId(null);
		setStatusModal(false);
	};

	return (
		<div>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
					{alertMessage}
				</Alert>
			</Snackbar>
			<ConfirmationDialogue
				title="Delete Report"
				content="Are you sure you want to delete the report?"
				open={openConfirm}
				setOpen={setOpenConfirm}
				onConfirm={handleDeleteReport}
			/>

			<Dialog open={statusModal} onClose={() => setStatusModal(false)}>
				<DialogTitle>Status</DialogTitle>
				<DialogContent sx={{ padding: 5 }}>
					<DialogContentText sx={{ marginBottom: 3 }}>
						Change the status of the report
					</DialogContentText>
					<FormControl fullWidth>
						<InputLabel>Status</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={statusValue}
							label="Status"
							onChange={(e) => setStatusValue(e.target.value)}
						>
							<MenuItem value={"active"}>Active</MenuItem>
							<MenuItem value={"reviewed"}>Reviewed</MenuItem>
							<MenuItem value={"closed"}>Closed</MenuItem>
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						onClick={() => setStatusModal(false)}
						color="primary"
					>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleStatus} color="error">
						Report
					</Button>
				</DialogActions>
			</Dialog>

			<Typography variant="subtitle2" fontSize={22} mb={1}>
				All reports
			</Typography>

			<Typography variant="subtitle2" fontSize={14} my={1} color="gray">
				In the reports section, you can review and manage all reports with their
				details. You can view, delete and change status of the report. Access to
				this area is limited. Only admins can reach.
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

export default AdminReports;
