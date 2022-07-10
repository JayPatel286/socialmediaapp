import { Button, Typography } from "@mui/material";
import { AddPhotoAlternate, ChangeCircle } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost } from "../../Actions/Post";
import { loadUser } from "../../Actions/User";
import "./NewPost.css";

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, message } = useSelector((state) => state.like);

  const handleImageChange = (e) => {
    console.log("object");
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (image === null || caption === "") {
      alert.error("Please fill all fields");
      return;
    }

    await dispatch(createNewPost(caption, image));
    dispatch(loadUser());

    setCaption("");
    setImage(null);
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
    <div className="newPost">
      <form className="newPostForm" onSubmit={submitHandler}>
        <Typography variant="h4" style={{ margin: "10px 0" }}>
          New Post
        </Typography>

        {image && <img src={image} alt="post" />}
        <input
          type="file"
          id="postUpload"
          accept="image/*"
          onChange={handleImageChange}
        />
        <label htmlFor="postUpload" className="postUpload">
          {image ? (
            <>
              <ChangeCircle className="icon" />
              Change Image
            </>
          ) : (
            <>
              <AddPhotoAlternate className="icon" />
              Add a photo
            </>
          )}
        </label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add Caption here..."
        />
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;
