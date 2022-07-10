import { Avatar, Button, Typography } from "@mui/material";
import {
  AddPhotoAlternate,
  ChangeCircle,
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

const Register = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const { loading, error } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    console.log("object");
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

    dispatch(registerUser(name, email, password, avatar));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [dispatch, alert, error]);

  return (
    <div className="register">
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
        <form className="registerForm" onSubmit={submitHandler}>
          <Typography
            variant="h4"
            style={{
              padding: "10px",
              margin: "10px 0",
              fontFamily: "Amiable Forsythia Free",
            }}
          >
            Social Media App
          </Typography>
          <div className="avatarImg">
            <Avatar
              src={avatar}
              alt="user"
              sx={{ height: "9vmax", width: "9vmax" }}
            />

            <input
              type="file"
              id="fileUpload"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="fileUpload" className="fileUpload">
              {avatar ? (
                <ChangeCircle className="icon" />
              ) : (
                <AddPhotoAlternate className="icon" />
              )}
            </label>
          </div>
          <div className="input-box">
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
          </div>
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

          {/* <Link to={"/"}>
            <Typography>Already Signed Up?</Typography>
          </Link> */}
          <Button disabled={loading} type="submit">
            Register
          </Button>
        </form>
        <div className="gotoRegister">
          Have an account?
          <Link to="/">
            <Typography>Log In</Typography>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
