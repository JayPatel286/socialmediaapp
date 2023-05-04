import React, { useEffect, useState } from "react";
import "./Login.css";
import {
	Typography,
	Button,
	TextField,
	InputAdornment,
	IconButton,
	Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Actions/User";
import { useAlert } from "react-alert";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

import Logo from "../../assets/logo2.png";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const dispatch = useDispatch();
	const alert = useAlert();

	const { error } = useSelector((state) => state.user);

	const loginHandler = (e) => {
		e.preventDefault();

		dispatch(loginUser(email, password));
	};

	useEffect(() => {
		if (error) {
			alert.error(error);
			dispatch({ type: "clearErrors" });
		}
	}, [dispatch, error, alert]);

	return (
		<div className="login">
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
			{/* <img src={Hero} width={500} alt="Hero" /> */}

			<div className="right">
				<form className="loginForm" onSubmit={loginHandler}>
					{/* <Typography
            variant="h4"
            style={{
              padding: "10px",
              margin: "30px 0",
              fontFamily: "Amiable Forsythia Free",
            }}
          >
            Social Media App
          </Typography> */}
					<img
						src={Logo}
						width={200}
						style={{ marginBottom: "30px" }}
						alt="Logo"
					/>
					<TextField
						// size="small"
						sx={{ width: "360px" }}
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
					</div> */}
					<TextField
						// size="small"
						label="Password"
						type={showPassword ? "text" : "password"}
						value={password}
						sx={{ width: "360px", marginTop: "20px" }}
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
					{/* <div className="input-box">
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
					<Button type="submit" variant="contained">
						Login
					</Button>

					<Link to="/forgot/password">
						<Typography style={{ fontSize: "14px" }}>
							Forgot Password?
						</Typography>
					</Link>

					<Stack direction="row" gap={1} alignItems="center">
						<Typography>Don't have an account?</Typography>
						<Link to="/register" style={{ textDecoration: "none" }}>
							<Typography color="Highlight">Sign up</Typography>
						</Link>
					</Stack>
				</form>
				{/* <div className="gotoRegister">
					Don't have an account?
					<Link to="/register">
						<Typography>Sign up</Typography>
					</Link>
				</div> */}
			</div>
		</div>
	);
};

export default Login;
