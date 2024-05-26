import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ProfileUser() {
	const { currentUser } = useSelector((state) => state.user);
	const [user, setUser] = useState({
		id: "",
		username: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("/api/user/self");
				const data = await res.json();
				if (res.ok || data.error === "false") {
					console.log(data);
					const { id, username, email } = data;
					setUser({
						...user,
						id,
						username,
						email,
					});
				}

				if (data.error === "true") {
					setError(data.message);
					setUser(null);
				}
				console.log("Response data : ", data);
				console.log("user : ", user);
			} catch (error) {
				console.log("Error fetching user : ", error.message);
				setUser(null);
			}
		}

		fetchUser();
	}, []);

	const handleChange = (e) => {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const updatedUser = {
				username: user.username,
				email: user.email,
				password: user.password,
			};

			const res = await fetch("/api/user/edit/self", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedUser),
			});

			const data = await res.json();
			if (res.ok || data.error === "false") {
				console.log("User updated successfully");
			} else {
				setError(data.message);
			}
		} catch (error) {
			console.log("Error updating user: ", error.message);
		}
	};

	return (
		<div>
			<p>Hello, {currentUser.username} </p>
			{error && <p>{error}</p>}
			<form onSubmit={handleSubmit} className="form-create">
				<div>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						id="username"
						value={user.username}
						onChange={handleChange}
					/>
				</div>

				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						id="email"
						value={user.email}
						onChange={handleChange}
					/>
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						id="password"
						value={user.password}
						onChange={handleChange}
					/>
					<button type="button" onClick={toggleShowPassword}>
						{showPassword ? "Hide" : "Show"} password
					</button>
				</div>

				<button className="form-btn-submit">Update</button>
			</form>
		</div>
	);
}
