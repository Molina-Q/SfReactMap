import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Loading from "../components/UI/animation/Loading";

export default function Register() {
	const [user, setUser] = useState({}); // Initialize user state
	const [dataMessage, setDataMessage] = useState(null); // Initialize dataMessage state
	const handleChange = (e) => {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		setDataMessage(null);

		fetch("/api/register", {
			// Replace with your Symfony endpoint
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		})
			.then((response) => response.json())
			.then((data) => {
				// Handle response data...
				setDataMessage(data);
			})
			.catch((error) => {
				setDataMessage(error);
			});
	};

	return (
		<main className="wrapperMain wrap-login">
			<h1>Create an account</h1>
			<form onSubmit={handleSubmit} className="form-create">
				{/* Form fields here, e.g.: */}
				<div>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						onChange={handleChange}
						className="form-input-text"
					/>
				</div>

				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						onChange={handleChange}
						className="form-input-text"
					/>
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						onChange={handleChange}
						className="form-input-text"
					/>
				</div>
				{/* Add other fields as necessary */}
				<button className="form-btn-submit" onClick={handleSubmit}>
					Register
				</button>
			</form>
			{dataMessage && <p>{dataMessage}</p>}
		</main>
	);
}
