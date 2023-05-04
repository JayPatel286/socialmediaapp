import { Edit, Email, Person } from "@mui/icons-material";
import {
	Autocomplete,
	Avatar,
	Button,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, updateProfile } from "../../Actions/User";
import Loader from "../Loader/Loader";
import "./UpdateProfile.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import dayjs from "dayjs";

const UpdateProfile = () => {
	const dispatch = useDispatch();
	const alert = useAlert();

	const { user, loading, error } = useSelector((state) => state.user);
	const {
		loading: updateLoading,
		error: updateError,
		message,
	} = useSelector((state) => state.like);

	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [avatar, setAvatar] = useState(null);
	const [hobbies, setHobbies] = useState(user.hobbies);
	const [dateOfBirth, setDateOfBirth] = useState(
		dayjs(moment(user.dateOfBirth).format("YYYY-MM-DD"))
	);
	const [gender, setGender] = useState(user.gender);
	const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);

	const handleImageChange = (e) => {
		console.log("object");
		const file = e.target.files[0];

		const Reader = new FileReader();
		Reader.readAsDataURL(file);

		Reader.onload = () => {
			if (Reader.readyState === 2) {
				setAvatar(Reader.result);
				setAvatarPrev(Reader.result);
			}
		};
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		await dispatch(
			updateProfile(name, email, avatar, hobbies, dateOfBirth, gender)
		);
		dispatch(loadUser());
	};

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch({ type: "clearErrors" });
		}
		if (updateError) {
			alert.error(error);
			dispatch({ type: "clearErrors" });
		}
		if (message) {
			alert.success(message);
			dispatch({ type: "clearMessage" });
		}
	}, [dispatch, alert, error, updateError, message]);

	return loading ? (
		<Loader />
	) : (
		<div className="updateProfile">
			<form className="updateProfileForm" onSubmit={submitHandler}>
				<Typography variant="h5" style={{ margin: "20px 0" }}>
					Edit Profile
				</Typography>

				<div className="avatarImg">
					<Avatar
						src={avatarPrev}
						alt="user"
						sx={{ height: "4vmax", width: "4vmax" }}
					/>

					<input
						type="file"
						id="fileUpload"
						accept="image/*"
						onChange={handleImageChange}
					/>
					{/* <label htmlFor="fileUpload" className="fileUpload">
						<Edit className="icon" />
					</label> */}
					<Button startIcon={<Edit />} component="span" variant="contained">
						Change Profile
					</Button>
				</div>

				<Stack gap={1} direction="row" width={"100%"}>
					<Stack gap={2} alignItems="center" flex={1}>
						<TextField
							// size="small"
							label="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Person />
									</InputAdornment>
								),
							}}
						/>
						<TextField
							// size="small"
							label="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Email />
									</InputAdornment>
								),
							}}
						/>
					</Stack>

					<Stack gap={2} alignItems="center" flex={1}>
						<FormControl sx={{ width: "360px" }}>
							<InputLabel>Gender</InputLabel>
							<Select
								fullWidth
								// size="small"
								value={gender}
								label="Gender"
								onChange={(e) => setGender(e.target.value)}
							>
								<MenuItem value={"Male"}>Male</MenuItem>
								<MenuItem value={"Female"}>Female</MenuItem>
								<MenuItem value={"Other"}>Other</MenuItem>
							</Select>
						</FormControl>

						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="Date of Birth"
								size="small"
								// disableFuture
								sx={{ width: "360px" }}
								value={dateOfBirth}
								format="DD-MM-YYYY"
								onChange={(newValue) => {
									setDateOfBirth(newValue);
								}}
							/>
						</LocalizationProvider>
					</Stack>
				</Stack>

				<Autocomplete
					sx={{ width: "745px", marginTop: 2 }}
					multiple
					freeSolo
					value={hobbies}
					// size="small"
					variant="standard"
					onChange={(event, newValue) => {
						setHobbies(newValue);
					}}
					disableCloseOnSelect
					options={[
						"Dancing",
						"Singing",
						"Running",
						"Coding",
						"Fitness",
						"Sports",
					]}
					renderInput={(params) => <TextField {...params} label="Hobbies" />}
				/>

				<Button
					disabled={updateLoading}
					style={{ margin: "20px 0" }}
					type="submit"
				>
					Update
				</Button>
			</form>
		</div>
	);
};

export default UpdateProfile;
