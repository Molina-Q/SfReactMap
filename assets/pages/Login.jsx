import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Loading from "../components/UI/animation/Loading";
import { fetchAnything } from "../utils/Fetchs";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/userSlice";
import { getUserSession } from "../utils/getUserSession";

export default function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	// const { loading, error: errorMessage } = useSelector((state) => state.user);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
		_csrf_token: "",
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
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...loginData }),
			});

			// console.log("Before data");
			// console.log(await res.json())

			// const data = await res.json();

			// console.log("data = ", data);

			if (res.ok) {
				const session = await getUserSession();

				console.log("Session:", session);

				dispatch(setUser(session));

				console.log("dispatch");

				navigate("/home");
			}
		} catch (error) {
			console.log("Login error", error);
			return setErrorMessage(error.message);
			// dispatch(signInFailure(error));
		}
	};

	useEffect(() => {
		async function fetchLogin() {
			// setLoading(true);

			console.log("-- Fetch - called --");

			const data = await fetchAnything("/api/login/show");

			console.log("-- Fetch - received --");

			// if the given data were valid
			if (data) {
				// set the content of data
				setLoginData({ ...loginData, _csrf_token: data._csrf_token });
			} else {
				// there was a mistake and the data is null
				// setLoading(false); // loading is set to false to avoid infinite loading
				console.error("MANUAL ERRROR: Invalid data or Empty");
				return;
			}
		}

		fetchLogin();
	}, []);

	return (
		<main className="wrapperMain wrap-login">
			<h1>Connect to your account</h1>

			<form method="post" className="form-create">
				{errorMessage && (
					<div className="alert alert-danger">{errorMessage}</div>
				)}
				<div>
					<label htmlFor="inputEmail">Email</label>
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
					<label htmlFor="inputPassword">Password</label>
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

				<input type="hidden" name="_csrf_token" value={loginData._csrf_token} />

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
