import axios from "axios";

export const loginUser = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: "loginRequest",
		});

		const { data } = await axios.post(
			"/api/v1/login",
			{ email, password },
			{
				headers: {
					"Content-type": "application/json",
				},
			}
		);

		dispatch({
			type: "loginSuccess",
			payload: data.user,
		});
	} catch (error) {
		dispatch({
			type: "loginFailure",
			payload: error.response.data.message,
		});
	}
};

export const verifyEmail = (token) => async (dispatch) => {
	try {
		const { data } = await axios.put(`/api/v1/verify/email/${token}`);

		return data.success;
	} catch (error) {
		console.error({ error });
		return false;
	}
};

export const loadUser = () => async (dispatch) => {
	try {
		dispatch({
			type: "loadUserRequest",
		});

		const { data } = await axios.get("/api/v1/me");

		dispatch({
			type: "loadUserSuccess",
			payload: data.user,
		});
	} catch (error) {
		dispatch({
			type: "loadUserFailure",
			payload: error.response.data.message,
		});
	}
};

export const getFollowingPosts = () => async (dispatch) => {
	try {
		dispatch({
			type: "postofFollowingRequest",
		});

		const { data } = await axios.get("/api/v1/posts");

		dispatch({
			type: "postofFollowingSuccess",
			payload: data.posts,
		});
	} catch (error) {
		dispatch({
			type: "postofFollowingFailure",
			payload: error.response.data.message,
		});
	}
};

export const getAllUsers =
	(name = "") =>
	async (dispatch) => {
		try {
			dispatch({
				type: "allUsersRequest",
			});

			const { data } = await axios.get(`/api/v1/users?name=${name}`);

			dispatch({
				type: "allUsersSuccess",
				payload: data.users,
			});
		} catch (error) {
			dispatch({
				type: "allUsersFailure",
				payload: error.response.data.message,
			});
		}
	};

export const getMyPosts = () => async (dispatch) => {
	try {
		dispatch({
			type: "myPostsRequest",
		});

		const { data } = await axios.get("/api/v1/my/posts");

		dispatch({
			type: "myPostsSuccess",
			payload: data.posts,
		});
	} catch (error) {
		dispatch({
			type: "myPostsFailure",
			payload: error.response.data.message,
		});
	}
};

export const logoutUser = () => async (dispatch) => {
	try {
		dispatch({
			type: "logoutUserRequest",
		});

		await axios.get("/api/v1/logout");

		dispatch({
			type: "logoutUserSuccess",
		});
	} catch (error) {
		dispatch({
			type: "logoutUserFailure",
			payload: error.response.data.message,
		});
	}
};

export const registerUser =
	(name, email, password, avatar, hobbies, dateOfBirth, gender) =>
	async (dispatch) => {
		try {
			dispatch({
				type: "registerRequest",
			});

			const { data } = await axios.post(
				"/api/v1/register",
				{ name, email, password, avatar, hobbies, dateOfBirth, gender },
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			dispatch({
				type: "registerSuccess",
				payload: data.user,
			});
		} catch (error) {
			dispatch({
				type: "registerFailure",
				payload: error.response.data.message,
			});
		}
	};

export const updateProfile =
	(name, email, avatar, hobbies, dateOfBirth, gender) => async (dispatch) => {
		try {
			dispatch({
				type: "updateProfileRequest",
			});

			const { data } = await axios.put(
				"/api/v1/update/profile",
				{ name, email, avatar, hobbies, gender, dateOfBirth },
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			dispatch({
				type: "updateProfileSuccess",
				payload: data.message,
			});
		} catch (error) {
			dispatch({
				type: "updateProfileFailure",
				payload: error.response.data.message,
			});
		}
	};

export const updatePassword =
	(oldPassword, newPassword) => async (dispatch) => {
		try {
			dispatch({
				type: "updatePasswordRequest",
			});

			const { data } = await axios.put(
				"/api/v1/update/password",
				{ oldPassword, newPassword },
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			dispatch({
				type: "updatePasswordSuccess",
				payload: data.message,
			});
		} catch (error) {
			dispatch({
				type: "updatePasswordFailure",
				payload: error.response.data.message,
			});
		}
	};

export const deleteMyProfile = () => async (dispatch) => {
	try {
		dispatch({
			type: "deleteProfileRequest",
		});

		const { data } = await axios.delete("/api/v1/delete/me");

		dispatch({
			type: "deleteProfileSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "deleteProfileFailure",
			payload: error.response.data.message,
		});
	}
};

export const forgotPassword = (email) => async (dispatch) => {
	try {
		dispatch({
			type: "forgotPasswordRequest",
		});

		const { data } = await axios.post(
			"/api/v1/forgot/password",
			{
				email,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		dispatch({
			type: "forgotPasswordSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "forgotPasswordFailure",
			payload: error.response.data.message,
		});
	}
};

export const resetPassword = (token, password) => async (dispatch) => {
	try {
		dispatch({
			type: "resetPasswordRequest",
		});

		const { data } = await axios.put(
			`/api/v1/password/reset/${token}`,
			{
				password,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		dispatch({
			type: "resetPasswordSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "resetPasswordFailure",
			payload: error.response.data.message,
		});
	}
};

export const getUserPosts = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "userPostsRequest",
		});

		const { data } = await axios.get(`/api/v1/userposts/${id}`);

		dispatch({
			type: "userPostsSuccess",
			payload: data.posts,
		});
	} catch (error) {
		dispatch({
			type: "userPostsFailure",
			payload: error.response.data.message,
		});
	}
};

export const getUserProfile = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "userProfileRequest",
		});

		const { data } = await axios.get(`/api/v1/user/${id}`);

		dispatch({
			type: "userProfileSuccess",
			payload: data.user,
		});
	} catch (error) {
		dispatch({
			type: "userProfileFailure",
			payload: error.response.data.message,
		});
	}
};

export const followAndUnfollowUser = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "followUserRequest",
		});

		const { data } = await axios.get(`/api/v1/follow/${id}`);

		dispatch({
			type: "followUserSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "followUserFailure",
			payload: error.response.data.message,
		});
	}
};
