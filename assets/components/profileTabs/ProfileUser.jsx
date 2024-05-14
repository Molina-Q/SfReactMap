import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ProfileUser() {
	const { currentUser } = useSelector((state) => state.user);
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("/api/user/getuser");
				const data = await res.json();
				if (res.ok || data.error === 'false') {
					console.log(data);
					setUser(data);
				}

				if(data.error === true) {
					setError(data.message);
					setUser(null);
				}
				console.log("Response data : ", data);
				console.log('user : ', user);
			} catch (error) {
				console.log("Error fetching user : ", error.message);
				setUser(false);
			}
		}

		fetchUser();
	}, []);

	return (
		<div>
			ProfileUser
			<p>Hello, {currentUser.username} </p>
			{error && <p>{error}</p>}
			{user && (
				<div>
					<ul>
						<li>{user.username}</li>
						<li>{user.id}</li>
						{/* <li>{user.roles.toString()}</li> */}
					</ul>
				</div>
			)}
		</div>
	);
}
