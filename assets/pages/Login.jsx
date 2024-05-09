import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Loading from "../components/UI/animation/Loading";
import { fetchAnything } from "../utils/Fetchs";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/user/userSlice";
import { jwtDecode } from "jwt-decode";

export default function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	// const { loading, error: errorMessage } = useSelector((state) => state.user);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
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

		if (!loginData.email || !loginData.password) {
			return setErrorMessage("Please fill out all fields!");
		}

		try {
			// dispatch(signInStart());
			console.log(JSON.stringify({ ...loginData }));
			const res = await fetch("/api/login_check", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...loginData }),
			});

			const data = await res.json();

			if (res.ok) { 
				console.log("Login success", data);

				setErrorMessage(null);

				const user = jwtDecode(data.token);

				// dispatch(signInSuccess(data));

				dispatch(loginSuccess(user));

				navigate("/home");
			}
		} catch (error) {
			console.log("Login error", error);
			return setErrorMessage(error.message);
			// dispatch(signInFailure(error));
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
				>
					Submit
				</button>
			</form>
			<button type="button" className="google">
				Google Auth
			</button>
		</main>
	); 
}
