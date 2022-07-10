import React, { useEffect, useState } from "react";
import "./Login.css";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Actions/User";
import { useAlert } from "react-alert";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

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
      <div className="iphones">
        <div className="imgBox front">
          <img src="assets/iphoneX.png" className="frame" alt="" />
          <img src="assets/insta_page.png" className="page" alt="" />
        </div>
        <div className="imgBox back">
          <img src="assets/iphoneX.png" className="frame" alt="" />
          <img src="assets/page2.png" className="page" alt="" />
        </div>
      </div>
      <div className="right">
        <form className="loginForm" onSubmit={loginHandler}>
          <Typography
            variant="h4"
            style={{
              padding: "10px",
              margin: "30px 0",
              fontFamily: "Amiable Forsythia Free",
            }}
          >
            Social Media App
          </Typography>
          <div className="input-box">
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
          </div>
          <Button type="submit">Login</Button>
          <Link to="/forgot/password">
            <Typography style={{ fontSize: "14px" }}>
              Forgot Password?
            </Typography>
          </Link>
        </form>
        <div className="gotoRegister">
          Don't have an account?
          <Link to="/register">
            <Typography>Sign up</Typography>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
