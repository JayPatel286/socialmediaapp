import { Container, Paper, Stack } from "@mui/material";
import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import AdminUsers from "./AdminUsers";
import AdminPosts from "./AdminPosts";
import AdminReports from "./AdminReports";

const AdminDashboard = () => {
	const [tab, setTab] = useState("users");

	return (
		<Container sx={{ minHeight: "90vh" }}>
			<Stack direction="row" gap={1} mt={1} height={"100%"}>
				<Sidebar tab={tab} setTab={setTab} />
				<Stack flex={4}>
					<Paper sx={{ minHeight: "90vh", padding: "10px" }}>
						{tab === "users" && <AdminUsers />}
						{tab === "posts" && <AdminPosts />}
						{tab === "reports" && <AdminReports />}
					</Paper>
				</Stack>
			</Stack>
		</Container>
	);
};

export default AdminDashboard;
