import React, { useEffect, useState } from "react";
import "./UpdatePassword.css";
import { Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../Actions/User";
import { useAlert } from "react-alert";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, message } = useSelector((state) => state.like);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(updatePassword(oldPassword, newPassword));
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
  }, [dispatch, alert, error, message]);

  return (
    <div className="updatePassword">
      <form className="updatePasswordForm" onSubmit={submitHandler}>
        <Typography variant="h5" style={{ padding: "2vmax" }}>
          Update Password
        </Typography>

        <div className="input-box">
          <Lock className="icon" />
          <div className="input-field">
            <input
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              required
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <label>Old Password</label>
            <div
              className="showPasswordBtn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </div>
          </div>
        </div>

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

        <Button disabled={loading} style={{ marginTop: "20px" }} type="submit">
          Upadate Password
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
