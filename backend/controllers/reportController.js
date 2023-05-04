const Report = require("../models/Report");

exports.newReport = async (req, res) => {
	try {
		const { message, postId } = req.body;

		const report = await Report.create({
			message,
			user: req.user._id,
			post: postId,
		});

		res.status(201).json({
			success: true,
			report,
			message: "Report created successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// ! Admin -> get all reports
exports.getAllReports = async (req, res) => {
	try {
		const reports = await Report.find({}).populate("user post");

		res.status(201).json({
			success: true,
			reports,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// ! Admin -> Delete report
exports.statusUpdate = async (req, res) => {
	try {
		const report = await Report.findById(req.params.id);

		if (!report) {
			return res.status(404).json({
				success: false,
				message: "Report not found",
			});
		}

		const { status } = req.body;

		report.status = status;

		await report.save();

		res.status(201).json({
			success: true,
			message: "Status updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// ! Admin -> Delete report
exports.deleteReport = async (req, res) => {
	try {
		const report = await Report.findById(req.params.id);

		if (!report) {
			return res.status(404).json({
				success: false,
				message: "Report not found",
			});
		}

		await report.remove();

		res.status(201).json({
			success: true,
			message: "Report removed successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
