const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter a name"],
	},
	avatar: {
		public_id: String,
		url: String,
	},
	role: {
		type: String,
		default: "user",
	},
	email: {
		type: String,
		required: [true, "Please enter an email"],
		unique: [true, "Email already Exists"],
	},
	password: {
		type: String,
		required: [true, "Please enter a password"],
		minlength: [6, "Password must be atleast 6 characters"],
		select: false,
	},
	hobbies: {
		type: [String],
		required: [true, "Please enter hobbies"],
		default: [],
	},
	dateOfBirth: {
		type: Date,
		required: [true, "Please enter date of birth"],
		default: null,
	},
	gender: {
		type: String,
		required: [true, "Please specify gender"],
		default: "",
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	],
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	following: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	isBlocked: {
		type: Boolean,
		default: false,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationToken: String,
	verificationTokenExpire: Date,
	resetPasswordToken: String,
	resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}

	next();
});

userSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
	return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

userSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");
	console.log(resetToken);

	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken.toString();
};

module.exports = mongoose.model("User", userSchema);
