import {
	Autocomplete,
	Avatar,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import {
	AddPhotoAlternate,
	ChangeCircle,
	Delete,
	Email,
	Lock,
	Person,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../../Actions/User";
import "./Register.css";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import Logo from "../../assets/logo2.png";

const Register = () => {
	const dispatch = useDispatch();
	const alert = useAlert();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [hobbies, setHobbies] = useState([]);
	const [dateOfBirth, setDateOfBirth] = useState(null);
	const [gender, setGender] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [avatar, setAvatar] = useState(null);

	const { loading, error } = useSelector((state) => state.user);

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		const Reader = new FileReader();
		Reader.readAsDataURL(file);

		Reader.onload = () => {
			if (Reader.readyState === 2) {
				setAvatar(Reader.result);
			}
		};
	};

	const submitHandler = (e) => {
		e.preventDefault();
		// console.log(name, email, password, avatar, hobbies, dateOfBirth, gender);

		dispatch(
			registerUser(name, email, password, avatar, hobbies, dateOfBirth, gender)
		);
	};

	const clearInputs = () => {
		setName("");
		setEmail("");
		setAvatar(null);
		setPassword("");
		setHobbies([]);
		setGender("");
		setDateOfBirth(null);
	};

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch({ type: "clearErrors" });
		}
	}, [dispatch, alert, error]);

	return (
		<div className="register">
			{/* <div className="iphones">
				<div className="imgBox front">
					<img src="assets/iphoneX.png" className="frame" alt="" />
					<img src="assets/insta_page.png" className="page" alt="" />
				</div>
				<div className="imgBox back">
					<img src="assets/iphoneX.png" className="frame" alt="" />
					<img src="assets/page2.png" className="page" alt="" />
				</div>
			</div> */}
			<form className="registerForm">
				<img
					src={Logo}
					width={200}
					style={{ marginBottom: "20px" }}
					alt="Logo"
				/>

				<div className="avatarImg">
					<Avatar
						src={avatar}
						alt="user"
						sx={{ height: "4vmax", width: "4vmax" }}
					/>

					<input
						type="file"
						id="fileUpload"
						accept="image/*"
						onChange={handleImageChange}
					/>
					<label htmlFor="fileUpload">
						<Button
							startIcon={avatar ? <ChangeCircle /> : <AddPhotoAlternate />}
							component="span"
							variant="contained"
						>
							{avatar ? "Change Profile" : "Upload Profile"}
						</Button>
					</label>
					{avatar && (
						<Button
							startIcon={<Delete />}
							component="span"
							variant="contained"
							color="error"
							onClick={() => setAvatar(null)}
						>
							Delete Profile
						</Button>
					)}
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

						<TextField
							// size="small"
							label="Password"
							type={showPassword ? "text" : "password"}
							value={password}
							sx={{ width: "360px" }}
							// fullWidth
							onChange={(e) => setPassword(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Lock />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Stack>
					{/* <div className="input-box">
						<Person className="icon" />
						<div className="input-field">
							<input
								type="text"
								value={name}
								required
								onChange={(e) => setName(e.target.value)}
								/>
								<label>Name</label>
								</div>
							</div> */}
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
								disableFuture
								sx={{ width: "360px" }}
								value={dateOfBirth}
								format="DD-MM-YYYY"
								onChange={(newValue) => {
									setDateOfBirth(newValue);
								}}
							/>
						</LocalizationProvider>

						<Autocomplete
							sx={{ width: "360px" }}
							multiple
							freeSolo
							// size="small"
							variant="standard"
							value={hobbies}
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
							renderInput={(params) => (
								<TextField {...params} label="Hobbies" />
							)}
						/>
					</Stack>
					{/* <div className="input-box">
							<Email className="icon" />
							<div className="input-field">
								<input
									type="text"
									value={email}
									required
									onChange={(e) => setEmail(e.target.value)}
								/>
								<label>Email</label>
							</div>
						</div>
						<div className="input-box">
							<Lock className="icon" />
							<div className="input-field">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									required
									onChange={(e) => setPassword(e.target.value)}
								/>
								<label>Password</label>
								<div
									className="showPasswordBtn"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</div>
							</div>
						</div> */}
				</Stack>

				{/* <Link to={"/"}>
            <Typography>Already Signed Up?</Typography>
          </Link> */}
				<Button
					sx={{ marginTop: 5 }}
					disabled={loading}
					variant="contained"
					onClick={submitHandler}
				>
					Register
				</Button>

				<Stack direction="row" gap={1} alignItems="center" mt={2}>
					<Typography>Have an account?</Typography>
					<Link to="/" style={{ textDecoration: "none" }}>
						<Typography color="Highlight">Log In</Typography>
					</Link>
				</Stack>
			</form>
			{/* <div className="gotoLogin">
				Have an account?
				<Link to="/">
					<Typography>Log In</Typography>
				</Link>
			</div> */}
		</div>
	);
};

export default Register;
