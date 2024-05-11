import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
	const location = useLocation();
	const [tab, setTab] = useState("");
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get("tab");
		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	const handleSignout = async () => {
		try {
			const res = await fetch("/api/user/signout", {
				method: "POST",
			});

			const data = await res.json();

			if (!res.ok) {
				console.log(data.message);
			} else {
				// dispatch(signoutSuccess());
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div>
			<ul className="sidebar-items-list">
				<Link to="/profile?tab=user">
					<li
						className={`sidebar-item ${tab === "user" ? "selected" : ""}`}
						// label={currentUser.roles ? "Admin" : "User"}
					>
						User
					</li>
				</Link>

                <Link to="/profile?tab=articles">
					<li
						className={`sidebar-item ${tab === "articles" ? "selected" : ""}`}
						// label={currentUser.roles ? "Admin" : "User"}
					>
						Articles
					</li>
				</Link>
				{!currentUser && (
					<>
						<Link to="/profile?tab=posts">
							<li
								className={`sidebar-item ${tab === "posts" ? "selected" : ""}`}
							>
								Posts
							</li>
						</Link>

						<Link to="/profile?tab=users">
							<li
								className={`sidebar-item ${tab === "users" ? "selected" : ""}`}
							>
								Users
							</li>
						</Link>
					</>
				)}

				<li onClick={handleSignout} className='sidebar-item'>
					Sign Out
				</li>
			</ul>
		</div>
	);
}
