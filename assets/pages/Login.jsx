import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Loading from "../components/UI/animation/Loading";
import { fetchAnything } from "../utils/Fetchs";
import { useDispatch } from "react-redux";
import { loginSuccess, loginError, loginStart } from "../redux/user/userSlice";
import { jwtDecode } from "jwt-decode";

export default function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { loading, error: errorMessage } = useSelector((state) => state.user);
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setLoginData({
			...loginData,
			[e.target.id]: e.target.value.trim(),
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(loginStart());
		
		if (!loginData.email || !loginData.password) {
			return dispatch(loginError("Please fill out all fields!"));
		}

		try {
			console.log(JSON.stringify({ ...loginData }));
			const res = await fetch("/api/login_check", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...loginData }),
			});

			const data = await res.json();

			if (res.ok) { 
				console.log("Login success", data);

				const user = jwtDecode(data.token);

				dispatch(loginSuccess(user));

				navigate("/home");
			}
		} catch (error) {
			console.log("Login error", error);
			return dispatch(loginError(error.message));
		}
	};

	return (
		<main className="wrapperMain wrap-login">
			<h1>Connect to your account</h1>

			<form method="post" className="form-create">
				{errorMessage && (
					<div className="alert alert-danger">{errorMessage}</div>
				)}
				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						value={loginData.email}
						name="email"
						id="email"
						className="form-input-text"
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						value={loginData.password}
						name="password"
						id="password"
						className="form-input-text"
						onChange={handleChange}
						required
					/>
				</div>

				<button
					className="form-btn-submit"
					type="submit"
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Submit'}
				</button>
			</form>
			<button type="button" className="google">
				Google Auth
			</button>
		</main>
	); 
}
