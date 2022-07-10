import { Email, LockOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../Actions/User";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, message } = useSelector((state) => state.like);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearError" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message, alert]);

  return (
    <div className="forgotPassword" onSubmit={submitHandler}>
      <form className="forgotPasswordForm">
        <LockOutlined
          style={{
            fontSize: "70px",
            padding: "10px",
            border: "3px solid #000",
            borderRadius: "50%",
            marginTop: "20px",
          }}
        />
        <Typography variant="h5" style={{ margin: "20px 0" }}>
          Trouble Logging In?
        </Typography>
        <Typography
          style={{
            fontSize: "14px",
            textAlign: "center",
            color: "#555",
            marginBottom: "20px",
          }}
        >
          Enter your email and we'll send you
          <br /> a link to get back to your account
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

        <Button disabled={loading} style={{ marginTop: "20px" }} type="submit">
          Send Login Link
        </Button>

        <Typography style={{ margin: "10px 0", color: "#777" }}>Or</Typography>

        <Link to="/register">
          <Typography>Create New Account</Typography>
        </Link>
      </form>
      <div className="backtologin">
        <Link to="/">
          <Typography style={{ fontWeight: "600" }}>Back To Login</Typography>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
