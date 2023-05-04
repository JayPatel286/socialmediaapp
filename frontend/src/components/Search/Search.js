import { SearchOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../Actions/User";
import User from "../User/User";
import "./Search.css";
import Logo from "../../assets/logo.png";

const Search = () => {
	const [name, setName] = useState("");
	const dispatch = useDispatch();

	const { users, loading } = useSelector((state) => state.allUsers);

	const submitHandler = (searchName) => {
		// e.preventDefault();

		if (searchName === "") {
			dispatch(getAllUsers());
		} else {
			dispatch(getAllUsers(searchName));
		}
	};

	return (
		<div className="search">
			<form className="searchForm" onSubmit={submitHandler}>
				<img
					src={Logo}
					width={200}
					style={{ marginBottom: "20px" }}
					alt="Logo"
				/>

				<div className="input-box">
					<SearchOutlined className="icon" />
					<div className="input-field">
						<input
							type="text"
							// value={name}
							onChange={(e) => {
								// setName(e.target.value);
								submitHandler(e.target.value);
							}}
						/>
						<label>Search by Name</label>
					</div>
				</div>

				{/* <Button disabled={loading} type="submit">
					Search
				</Button> */}
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
