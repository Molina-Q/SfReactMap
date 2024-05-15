import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Loading from "../components/UI/animation/Loading";

export default function Register() {
	const [userData, setUserData] = useState({}); // Initialize user state
	const [dataMessage, setDataMessage] = useState(null); // Initialize dataMessage state
	const handleChange = (e) => {
		setUserData({
			...userData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setDataMessage(null);

		try {
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});
			const data = await response.json();

			setDataMessage(data.message);
		} catch (error) {
			setDataMessage(error.message);
		}
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
					Submit
				</button>
			</form>
			{dataMessage && <p>{dataMessage}</p>}
		</main>
	);
}
