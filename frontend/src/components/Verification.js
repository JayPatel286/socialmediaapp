import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Verification = () => {
	const [status, setstatus] = useState("loading");
	const params = useParams();

	const verify = async () => {
		try {
			const { data } = await axios.put(`/verification`);
			console.log({ data });

			setstatus("success");
		} catch (error) {
			console.log(error);
			setstatus("failure");
		}
	};

	useEffect(() => {
		verify();
	});

	return (
		<div>
			Verification : {status}
			{status === "success" && <Link to={"/"}>Login Now</Link>}
		</div>
	);
};

export default Verification;
