import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Helmet } from "react-helmet-async";


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
			<Helmet>
				<title>Profile</title>
				<meta name="description" content="User profile" />
			</Helmet>

			<h2>Hello, {currentUser.username} </h2>
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

				<div >
					<label htmlFor="password">Password</label>

					<div className="form-password">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							id="password"
							value={user.password}
							onChange={handleChange}
						/>

						<button type="button" onClick={toggleShowPassword} className="passwordToggle">
							{showPassword ? <FaRegEyeSlash size={"15px"} /> : <FaRegEye />}
						</button>
					</div>
				</div>

				<button className="form-btn-submit">Update</button>
			</form>
		</div>
	);
}
