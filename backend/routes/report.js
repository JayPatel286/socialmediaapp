const express = require("express");
const { isAuthenticated, authorizedRoles } = require("../middlewares/auth");
const {
	newReport,
	getAllReports,
	deleteReport,
	statusUpdate,
} = require("../controllers/reportController");

const router = express.Router();

router.route("/report/new").post(isAuthenticated, newReport);

// ! Admin -> Get all reports
router
	.route("/admin/reports")
	.get(isAuthenticated, authorizedRoles("admin"), getAllReports);

// ! Admin -> Change status of report
router
	.route("/admin/report/:id")
	.put(isAuthenticated, authorizedRoles("admin"), statusUpdate);

// ! Admin -> delete a report
router
	.route("/admin/report/:id")
	.delete(isAuthenticated, authorizedRoles("admin"), deleteReport);

module.exports = router;
