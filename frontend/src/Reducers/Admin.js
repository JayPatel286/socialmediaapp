import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const adminReducer = createReducer(initialState, {
	adminUsersRequest: (state) => {
		state.loading = true;
	},
	adminUsersSuccess: (state, action) => {
		state.loading = false;
		state.users = action.payload;
	},
	adminUsersFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	adminBlockUserRequest: (state, action) => {
		state.blockLoading = true;
	},
	adminBlockUserSuccess: (state, action) => {
		state.blockLoading = false;
		state.message = action.payload;
	},
	adminBlockUserFailure: (state, action) => {
		state.blockLoading = false;
		state.error = action.payload;
	},
	adminDeleteUserRequest: (state, action) => {
		state.deleteLoading = true;
	},
	adminDeleteUserSuccess: (state, action) => {
		state.deleteLoading = false;
		state.message = action.payload;
	},
	adminDeleteUserFailure: (state, action) => {
		state.deleteLoading = false;
		state.error = action.payload;
	},

	adminPostsRequest: (state) => {
		state.loading = true;
	},
	adminPostsSuccess: (state, action) => {
		state.loading = false;
		state.posts = action.payload;
	},
	adminPostsFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	adminDeletePostRequest: (state, action) => {
		state.deleteLoading = true;
	},
	adminDeletePostSuccess: (state, action) => {
		state.deleteLoading = false;
		state.message = action.payload;
	},
	adminDeletePostFailure: (state, action) => {
		state.deleteLoading = false;
		state.error = action.payload;
	},

	adminReportsRequest: (state) => {
		state.loading = true;
	},
	adminReportsSuccess: (state, action) => {
		state.loading = false;
		state.reports = action.payload;
	},
	adminReportsFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	adminDeleteReportRequest: (state, action) => {
		state.deleteLoading = true;
	},
	adminDeleteReportSuccess: (state, action) => {
		state.deleteLoading = false;
		state.message = action.payload;
	},
	adminDeleteReportFailure: (state, action) => {
		state.deleteLoading = false;
		state.error = action.payload;
	},
	adminProcessReportRequest: (state, action) => {
		state.processLoading = true;
	},
	adminProcessReportSuccess: (state, action) => {
		state.processLoading = false;
		state.message = action.payload;
	},
	adminProcessReportFailure: (state, action) => {
		state.processLoading = false;
		state.error = action.payload;
	},

	clearErrors: (state) => {
		state.error = null;
	},
	clearMessage: (state) => {
		state.message = null;
	},
});
