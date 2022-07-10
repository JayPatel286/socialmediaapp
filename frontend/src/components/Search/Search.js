import { SearchOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../Actions/User";
import User from "../User/User";
import "./Search.css";

const Search = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const { users, loading } = useSelector((state) => state.allUsers);

  const submitHandler = (e) => {
    e.preventDefault();

    if (name === "") {
      dispatch(getAllUsers());
    } else {
      dispatch(getAllUsers(name));
    }
  };

  return (
    <div className="search">
      <form className="searchForm" onSubmit={submitHandler}>
        <Typography
          variant="h4"
          style={{
            padding: "10px",
            marginBottom: "20px",
            fontFamily: "Amiable Forsythia Free",
          }}
        >
          Social Media App
        </Typography>

        <div className="input-box">
          <SearchOutlined className="icon" />
          <div className="input-field">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Search by Name</label>
          </div>
        </div>

        <Button disabled={loading} type="submit">
          Search
        </Button>
        <div className="searchResults">
          {users &&
            users.map((user) => (
              <User
                key={user._id}
                userId={user._id}
                name={user.name}
                avatar={user.avatar.url}
              />
            ))}
        </div>
      </form>
    </div>
  );
};

export default Search;
