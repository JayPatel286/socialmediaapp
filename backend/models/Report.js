const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
	},
	status: {
		type: String,
		default: "active",
	},
	message: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Report", reportSchema);
