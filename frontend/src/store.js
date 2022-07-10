import { configureStore } from "@reduxjs/toolkit";
import { likeReducer, myPostsReducer, userPostsReducer } from "./Reducers/Post";
import {
  allUsersReducer,
  postOfFollowingReducer,
  userProfileReducer,
  userReducer,
} from "./Reducers/User";

const store = configureStore({
  reducer: {
    user: userReducer,
    postOfFollowing: postOfFollowingReducer,
    allUsers: allUsersReducer,
    like: likeReducer,
    myPosts: myPostsReducer,
    userPosts: userPostsReducer,
    userProfile: userProfileReducer,
  },
});

export default store;
