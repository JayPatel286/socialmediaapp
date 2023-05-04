import { Close } from "@mui/icons-material";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
} from "@mui/material";
import React from "react";

const ConfirmationDialogue = ({
	title,
	content,
	cancelText = "Cancel",
	agreeText = "Yes",
	open,
	setOpen,
	onConfirm,
}) => {
	return (
		<Dialog open={open} maxWidth="sm" fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<Box position="absolute" top={0} right={0}>
				<IconButton onClick={() => setOpen(false)}>
					<Close />
				</IconButton>
			</Box>
			<DialogContent>
				<Typography>{content}</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					color="error"
					variant="contained"
					onClick={() => setOpen(false)}
				>
					{cancelText}
				</Button>
				<Button
					color="primary"
					variant="contained"
					onClick={() => {
						setOpen(false);
						onConfirm();
					}}
				>
					{agreeText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationDialogue;
