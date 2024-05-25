import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileUser from "../components/profileTabs/ProfileUser";
import ProfileArticles from "../components/profileTabs/ProfileArticles";
import { useNavigate } from "react-router-dom";
import ProfileEquipments from "../components/profileTabs/ProfileEquipments";

export default function Profile() {
	const { currentUser } = useSelector((state) => state.user);
	const [tab, setTab] = useState("");
	const location = useLocation();
	const navigate = useNavigate();

	const tabsArray = [
		{ label: "user", element: <ProfileUser /> },
		{ label: "articles", element: <ProfileArticles /> },
		{ label: "equipments", element: <ProfileEquipments /> },
	];

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get("tab");
		if (tabFromUrl) {
			setTab(tabFromUrl);
		} else {
			const urlParams = new URLSearchParams();
			urlParams.set("tab", "user");

			const searchQuery = urlParams.toString();
			// setTab('user');
			navigate(`/profile?${searchQuery}`);
		}
	}, [location.search]);

	return (
		<main className="wrapperMain wrap-equip wrap-profile">
			<div className="sidebar-container">
				<Sidebar />
			</div>
			{tabsArray.map((singleTab) => 
				tab === singleTab.label && singleTab.element
			)}
		</main>
	);
}
