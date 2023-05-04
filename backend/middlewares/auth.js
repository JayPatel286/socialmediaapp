const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
	try {
		const { token } = req.cookies;

		if (!token) {
			return res.status(401).json({
				message: "Please Login first",
			});
		}

		const decoded = await jwt.verify(token, process.env.JWT_SECRET);

		req.user = await User.findById(decoded._id);

		next();
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

exports.authorizedRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(401).json({
				message: "You are not allowed to access this route",
			});
		}

		next();
	};
};
