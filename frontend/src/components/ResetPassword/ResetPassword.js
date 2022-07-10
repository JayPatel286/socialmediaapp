import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../../Actions/User";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const alert = useAlert();
  const params = useParams();

  const { loading, error, message } = useSelector((state) => state.like);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(resetPassword(params.token, newPassword));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message, alert]);

  return (
    <div className="resetPassword">
      <form className="resetPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h5" style={{ padding: "2vmax" }}>
          Reset Password
        </Typography>

        <div className="input-box">
          <Lock className="icon" />
          <div className="input-field">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>New Password</label>
            <div
              className="showPasswordBtn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </div>
          </div>
        </div>

        <Link to={"/"}>
          <Typography>Login</Typography>
        </Link>
        <Typography style={{ alignSelf: "flex-end", marginRight: "2vmax" }}>
          Or
        </Typography>
        <Link to={"/forgot/password"}>
          <Typography>Request new token</Typography>
        </Link>

        <Button disabled={loading} type="submit">
          Upadate Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
