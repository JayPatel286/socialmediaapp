import { configureStore } from "@reduxjs/toolkit";
import { likeReducer, myPostsReducer, userPostsReducer } from "./Reducers/Post";
import {
	allUsersReducer,
	postOfFollowingReducer,
	userProfileReducer,
	userReducer,
} from "./Reducers/User";
import { adminReducer } from "./Reducers/Admin";

const store = configureStore({
	reducer: {
		user: userReducer,
		postOfFollowing: postOfFollowingReducer,
		allUsers: allUsersReducer,
		like: likeReducer,
		myPosts: myPostsReducer,
		userPosts: userPostsReducer,
		userProfile: userProfileReducer,
		admin: adminReducer,
	},
});

export default store;
