const express = require("express");
const {
	createPost,
	likeAndUnlikePost,
	deletePost,
	getPostOfFollowing,
	updateCaption,
	commentOnPost,
	deleteComment,
	getAllPostsForAdmin,
	deletePostAdmin,
} = require("../controllers/postController");
const { isAuthenticated, authorizedRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);
router
	.route("/post/:id")
	.get(isAuthenticated, likeAndUnlikePost)
	.put(isAuthenticated, updateCaption)
	.delete(isAuthenticated, deletePost);
router.route("/posts").get(isAuthenticated, getPostOfFollowing);
router
	.route("/post/comment/:id")
	.put(isAuthenticated, commentOnPost)
	.delete(isAuthenticated, deleteComment);

// ! Admin -> Get all posts
router
	.route("/admin/posts")
	.get(isAuthenticated, authorizedRoles("admin"), getAllPostsForAdmin);

// ! Admin -> Delete post
router
	.route("/admin/post/:id")
	.delete(isAuthenticated, authorizedRoles("admin"), deletePostAdmin);

module.exports = router;
