import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Loading from "../components/UI/animation/Loading";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

export default function Register() {
	const [userData, setUserData] = useState({
		username: "",
		email: "",
		password: "",
	}); // Initialize user state

	const [dataResponse, setDataResponse] = useState(null); // Initialize dataResponse state

	const handleChange = (e) => {
		setUserData({
			...userData,
			[e.target.name]: e.target.value,
		});
	};

	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	console.log(userData);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setDataResponse(null);

		try {
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (response.ok) {
				setDataResponse(data);
			} else {
				setDataResponse(data);
			}
		} catch (error) {
			setDataResponse(error.message);
		}
	};

	console.log("dataResponse : ", dataResponse);

	return (
		<main className="wrapperMain wrap-login">
			<Helmet>
				<title>Register</title>
				<meta name="description" content="Register form" />
			</Helmet>
			
			<h1>Create an account</h1>
			<form onSubmit={handleSubmit} className="form-create">
				{dataResponse && dataResponse.message && (
					<p className={`alert ${dataResponse.error ? "failure" : "success"}`}>
						{dataResponse.message}
					</p>
				)}

				<div>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						onChange={handleChange}
						value={userData.username}
						className="form-input-text"
					/>
					{dataResponse && dataResponse.fieldErrors["[username]"] && (
						<p className={"alert failure"}>
							{dataResponse.fieldErrors["[username]"]}
						</p>
					)}
				</div>

				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						onChange={handleChange}
						value={userData.email}
						className="form-input-text"
					/>
					{dataResponse && dataResponse.fieldErrors["[email]"] && (
						<p className={"alert failure"}>
							{dataResponse.fieldErrors["[email]"]}
						</p>
					)}
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<div className="form-password">
						<input
							type="password"
							name="password"
							onChange={handleChange}
							value={userData.password}
							className="form-input-text"
						/>

						<button
							type="button"
							onClick={toggleShowPassword}
							className="passwordToggle"
						>
							{showPassword ? <FaRegEyeSlash size={"15px"} /> : <FaRegEye />}
						</button>
					</div>
					{dataResponse && dataResponse.fieldErrors["[password]"] && (
						<p className={"alert failure"}>
							{dataResponse.fieldErrors["[password]"]}
						</p>
					)}
				</div>

				<button className="form-btn-submit" onClick={handleSubmit}>
					Submit
				</button>
			</form>
		</main>
	);
}
