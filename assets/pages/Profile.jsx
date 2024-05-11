import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Profile() {
	const {currentUser} = useSelector(state => state.user);
	const [tab, setTab] = useState("");
	const location = useLocation();


	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get("tab");
		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			<div className="md:w-56">
				{/* Sidebar */}
				<Sidebar />
			</div>

			{/* Profile */}
			{tab === "profile" && <DashProfile />}

			{/* Posts */}
			{tab === "posts" && <DashPosts />}

			{/* Users */}
			{tab === "users" && <DashUsers />}
		</div>
	);

}
