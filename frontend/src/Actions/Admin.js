import axios from "axios";

export const getAllUsersForAdmin = () => async (dispatch) => {
	try {
		dispatch({
			type: "adminUsersRequest",
		});

		const { data } = await axios.get("/api/v1/admin/users");

		dispatch({
			type: "adminUsersSuccess",
			payload: data.users,
		});
	} catch (error) {
		dispatch({
			type: "adminUsersFailure",
			payload: error.response.data.message,
		});
	}
};

export const blockOrUnblockUser = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "adminBlockUserRequest",
		});

		const { data } = await axios.put(`/api/v1/admin/user/${id}`);

		dispatch({
			type: "adminBlockUserSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "adminBlockUserFailure",
			payload: error.response.data.message,
		});
	}
};

export const deleteUser = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "adminDeleteUserRequest",
		});

		const { data } = await axios.delete(`/api/v1/admin/user/${id}`);

		dispatch({
			type: "adminDeleteUserSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "adminDeleteUserFailure",
			payload: error.response.data.message,
		});
	}
};

export const getAllPostsForAdmin = () => async (dispatch) => {
	try {
		dispatch({
			type: "adminPostsRequest",
		});

		const { data } = await axios.get("/api/v1/admin/posts");

		dispatch({
			type: "adminPostsSuccess",
			payload: data.posts,
		});
	} catch (error) {
		dispatch({
			type: "adminPostsFailure",
			payload: error.response.data.message,
		});
	}
};

export const deletePost = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "adminDeletePostRequest",
		});

		const { data } = await axios.delete(`/api/v1/admin/post/${id}`);

		dispatch({
			type: "adminDeletePostSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "adminDeletePostFailure",
			payload: error.response.data.message,
		});
	}
};

export const getAllReportsForAdmin = () => async (dispatch) => {
	try {
		dispatch({
			type: "adminReportsRequest",
		});

		const { data } = await axios.get("/api/v1/admin/reports");

		dispatch({
			type: "adminReportsSuccess",
			payload: data.reports,
		});
	} catch (error) {
		dispatch({
			type: "adminReportsFailure",
			payload: error.response.data.message,
		});
	}
};

export const deleteReport = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "adminDeleteReportRequest",
		});

		const { data } = await axios.delete(`/api/v1/admin/report/${id}`);

		dispatch({
			type: "adminDeleteReportSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "adminDeleteReportFailure",
			payload: error.response.data.message,
		});
	}
};

export const processReport = (id, status) => async (dispatch) => {
	try {
		dispatch({
			type: "adminProcessReportRequest",
		});

		const { data } = await axios.put(
			`/api/v1/admin/report/${id}`,
			{ status },
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		dispatch({
			type: "adminProcessReportSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "adminProcessReportFailure",
			payload: error.response.data.message,
		});
	}
};
