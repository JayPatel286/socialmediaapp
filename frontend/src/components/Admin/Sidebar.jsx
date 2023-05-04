import { Collections, PeopleAlt, Report } from "@mui/icons-material";
import {
	List,
	ListItemButton,
	ListItemIcon,
	Paper,
	Stack,
	Typography,
} from "@mui/material";

const Sidebar = ({ tab, setTab }) => {
	return (
		<Stack flex={1}>
			<Paper sx={{ minHeight: "90vh", padding: "10px" }}>
				<List
					orientation="vertical"
					component="nav"
					sx={{
						marginTop: "10px",
						"&& .Mui-selected, && .Mui-selected:hover": {
							bgcolor: "#EDF4FB",
							"&, & .MuiListItemIcon-root": {
								// color: '#9b27b0d9',
								color: "#003171",
							},
						},
						"&& .MuiListItemButton-root:hover": {
							bgcolor: "#edf4fbb7",
						},
						"& .MuiListItemButton-root": {
							color: "#000",
						},
					}}
				>
					<ListItemButton
						sx={{
							borderRadius: "5px",
							marginBottom: "5px",
						}}
						selected={tab === "users"}
						onClick={() => setTab("users")}
					>
						<ListItemIcon>
							<PeopleAlt />
						</ListItemIcon>
						<Typography variant={tab === "users" ? "subtitle2" : "body2"}>
							Users
						</Typography>
					</ListItemButton>

					<ListItemButton
						sx={{
							borderRadius: "5px",
							marginBottom: "5px",
						}}
						selected={tab === "posts"}
						onClick={() => setTab("posts")}
					>
						<ListItemIcon>
							<Collections />
						</ListItemIcon>
						<Typography variant={tab === "posts" ? "subtitle2" : "body2"}>
							Posts
						</Typography>
					</ListItemButton>

					<ListItemButton
						sx={{
							borderRadius: "5px",
							marginBottom: "5px",
						}}
						selected={tab === "reports"}
						onClick={() => setTab("reports")}
					>
						<ListItemIcon>
							<Report />
						</ListItemIcon>
						<Typography variant={tab === "reports" ? "subtitle2" : "body2"}>
							Reports
						</Typography>
					</ListItemButton>
				</List>
			</Paper>
		</Stack>
	);
};

export default Sidebar;
