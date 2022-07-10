import { Edit, Email, Person } from "@mui/icons-material";
import { Avatar, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, updateProfile } from "../../Actions/User";
import Loader from "../Loader/Loader";
import "./UpdateProfile.css";

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

    await dispatch(updateProfile(name, email, avatar));
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
        <Typography variant="h5" style={{ margin: "30px 0" }}>
          Edit Profile
        </Typography>

        <div className="avatarImg">
          <Avatar
            src={avatarPrev}
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
            <Edit className="icon" />
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

        <Button
          disabled={updateLoading}
          style={{ marginTop: "20px" }}
          type="submit"
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
