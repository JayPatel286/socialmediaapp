const { sendEmail } = require("../middlewares/sendEmail");
const Post = require("../models/Post");
const User = require("../models/User");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

exports.register = async (req, res) => {
	try {
		const { name, email, password, avatar, hobbies, gender, dateOfBirth } =
			req.body;

		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				success: false,
				message: "User Already exists",
			});
		}

		const myCloud = await cloudinary.v2.uploader.upload(avatar, {
			folder: "avatars",
		});

		user = await User.create({
			name,
			email,
			password,
			hobbies,
			gender,
			dateOfBirth,
			avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
		});

		const token = await user.generateToken();
		const tokenExpire = Date.now() + 7 * 24 * 60 * 60 * 1000;

		user.verificationToken = token;
		user.verificationTokenExpire = tokenExpire;

		await user.save();

		const options = {
			expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
			httpOnly: true,
		};

		const verificationUrl = `${req.protocol}://${req.get(
			"host"
		)}/verify/email/${token}`;

		const message = `Verify your email by clicking on the link below: \n\n ${verificationUrl}`;

		// try {
		// await sendEmail({
		// 	email: user.email,
		// 	subject: "Email Verification",
		// 	message,
		// });

		// res.status(200).json({
		// 	success: true,
		// 	message: `Email sent to ${user.email}`,
		// });
		// 	res.status(201).json({
		// 		success: true,
		// 		message: `Email sent to ${user.email}`,
		// 	});
		// } catch (error) {
		// 	res.status(500).json({
		// 		success: false,
		// 		message: error.message,
		// 	});
		// }
		res.status(200).cookie("token", token, options).json({
			success: true,
			user,
			token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.verifyEmail = async (req, res) => {
	try {
		console.log("Here");
		const token = req.params.token;

		let user = await User.findById({
			verificationToken: token,
			verificationTokenExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User does not exist",
			});
		}

		user.isVerified = true;

		await user.save();

		res.status(200).json({
			success: true,
			message: "Email Verified successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email })
			.select("+password")
			.populate("posts followers following");

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User does not exist",
			});
		}

		if (user.isBlocked) {
			return res.status(401).json({
				success: false,
				message: "You are blocked by admin",
			});
		}

		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return res.status(400).json({
				success: false,
				message: "Incorrect password!!",
			});
		}

		const token = await user.generateToken();

		const options = {
			expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
			httpOnly: true,
		};

		res.status(200).cookie("token", token, options).json({
			success: true,
			user,
			token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.logout = async (req, res) => {
	try {
		res
			.status(200)
			.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
			.json({
				success: true,
				message: "Logged Out",
			});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.followUser = async (req, res) => {
	try {
		const userToFollow = await User.findById(req.params.id);
		const loggedUser = await User.findById(req.user._id);

		if (!userToFollow) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// If already following then unfollow
		if (loggedUser.following.includes(userToFollow._id)) {
			const indexFollowing = loggedUser.following.indexOf(userToFollow._id);
			loggedUser.following.splice(indexFollowing, 1);

			const indexFollowers = userToFollow.followers.indexOf(loggedUser._id);
			userToFollow.followers.splice(indexFollowers, 1);

			await loggedUser.save();
			await userToFollow.save();

			res.status(200).json({
				success: true,
				message: "User Unfollowed",
			});
		} else {
			loggedUser.following.push(userToFollow._id);
			userToFollow.followers.push(loggedUser._id);

			await loggedUser.save();
			await userToFollow.save();

			res.status(200).json({
				success: true,
				message: "User followed",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updatePassword = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("+password");

		const { oldPassword, newPassword } = req.body;

		if (!oldPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Provide old and new password",
			});
		}

		const isMatch = await user.matchPassword(oldPassword);

		if (!isMatch) {
			return res.status(400).json({
				success: false,
				message: "Incorrect old password",
			});
		}

		user.password = newPassword;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Password updated",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		const { name, email, avatar, dateOfBirth, hobbies, gender } = req.body;
		if (name) user.name = name;
		if (email) user.email = email;
		if (hobbies) user.hobbies = hobbies;
		if (gender) user.gender = gender;
		if (dateOfBirth) user.dateOfBirth = dateOfBirth;
		if (avatar) {
			await cloudinary.v2.uploader.destroy(user.avatar.public_id);

			const myCloud = await cloudinary.v2.uploader.upload(avatar, {
				folder: "avatars",
			});

			user.avatar.public_id = myCloud.public_id;
			user.avatar.url = myCloud.secure_url;
		}

		await user.save();

		res.status(200).json({
			success: true,
			message: "Profile updated",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.deleteMyProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		const posts = user.posts;
		const followers = user.followers;
		const followings = user.following;
		const userId = user._id;

		// Removing avatars
		await cloudinary.v2.uploader.destroy(user.avatar.public_id);

		await user.remove();

		// Logout user
		res.cookie("token", null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		});

		// Deleting all posts of user
		for (let i = 0; i < posts.length; i++) {
			const post = await Post.findById(posts[i]);
			// Removing post images
			await cloudinary.v2.uploader.destroy(post.image.public_id);
			await post.remove();
		}

		// Removing user from following list of all his followers
		for (let i = 0; i < followers.length; i++) {
			const follower = await User.findById(followers[i]);

			const index = follower.following.indexOf(userId);
			follower.following.splice(index, 1);

			await follower.save();
		}

		// Removing User from follower list of all his followings
		for (let i = 0; i < followings.length; i++) {
			const following = await User.findById(followings[i]);

			const index = following.followers.indexOf(userId);
			following.followers.splice(index, 1);

			await following.save();
		}

		// Removing all comments of user
		const allPosts = await Post.find();
		for (let i = 0; i < allPosts.length; i++) {
			const post = await Post.findById(allPosts[i]._id);

			for (let j = 0; j < post.comments.length; j++) {
				if (post.comments[j].user === userId) {
					post.comments.splice(j, 1);
				}
			}
			await post.save();
		}

		// Removing all likes of user
		for (let i = 0; i < allPosts.length; i++) {
			const post = await Post.findById(allPosts[i]._id);

			for (let j = 0; j < post.likes.length; j++) {
				if (post.likes[j] === userId) {
					post.likes.splice(j, 1);
				}
			}
			await post.save();
		}

		res.status(200).json({
			success: true,
			message: "Profile deleted",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.myProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate(
			"posts followers following"
		);

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate(
			"posts followers following"
		);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find({
			name: { $regex: req.query.name, $options: "i" },
			isBlocked: false,
		});

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.forgotPassword = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const resetPasswordToken = user.getResetPasswordToken();
		await user.save();

		const resetUrl = `${req.protocol}://${req.get(
			"host"
		)}/password/reset/${resetPasswordToken}`;

		const message = `Reset your password bt clicking on the link below: \n\n ${resetUrl}`;

		try {
			await sendEmail({
				email: user.email,
				subject: "Reset Password",
				message,
			});

			res.status(200).json({
				success: true,
				message: `Email sent to ${user.email}`,
			});
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await user.save();

			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const resetPasswordToken = crypto
			.createHash("sha256")
			.update(req.params.token)
			.digest("hex");

		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Token is invalid or expired",
			});
		}

		user.password = req.body.password;

		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		res.status(200).json({
			success: true,
			message: "Password updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getMyPosts = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		const posts = [];

		for (let i = 0; i < user.posts.length; i++) {
			const post = await Post.findById(user.posts[i]).populate(
				"likes comments.user owner"
			);
			posts.push(post);
		}

		res.status(200).json({
			success: true,
			posts,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getUserPosts = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		const posts = [];

		for (let i = 0; i < user.posts.length; i++) {
			const post = await Post.findById(user.posts[i]).populate(
				"likes comments.user owner"
			);
			posts.push(post);
		}

		res.status(200).json({
			success: true,
			posts,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// ! Admin -> Get all users
exports.getAllUsersForAdmin = async (req, res) => {
	try {
		const users = await User.find({});

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// ! Admin -> Get user details
exports.getUserDetails = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: `User does not exist with id: ${req.params.id}`,
			});
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// ! Admin -> Block user
exports.blockOrUnblockUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: `User does not exist with id: ${req.params.id}`,
			});
		}

		let message = "";

		if (user.isBlocked) {
			user.isBlocked = false;
			message = "User unblocked successfully";
		} else {
			user.isBlocked = true;
			message = "User blocked successfully";
		}

		await user.save();

		res.status(200).json({
			success: true,
			message,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// ! Admin -> Delete user
exports.deleteUserForAdmin = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: `User does not exist with id: ${req.params.id}`,
			});
		}

		const imageId = user.avatar.public_id;
		await cloudinary.v2.uploader.destroy(imageId);

		await user.remove();

		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
