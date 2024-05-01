import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Loading from "../components/UI/animation/Loading";

export default function SignUp() {
	const [formData, setFormData] = useState({});
	const navigate = useNavigate();
	// const dispatch = useDispatch();
	// const { loading, error: errorMessage } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value.trim(),
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			// return dispatch(signInFailure("Please fill out all fields!"));
		}
		try {
			dispatch(signInStart());
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				// dispatch(signInFailure(data.message));
			}
			if (res.ok) {
				// dispatch(signInSuccess(data));
				navigate("/");
			}
		} catch (error) {
			// dispatch(signInFailure(error));
		}
	};

	return (
		<div className="min-h-screen mt-20">
			<div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
				{/* right side */}
				<div className="flex-1">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<label htmlFor="email" value="Your email" />
							<input
								type="email"
								placeholder="name@company.com"
								id="email"
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="password" value="Your password" />
							<input
								type="password"
								placeholder="Password"
								id="password"
								onChange={handleChange}
							/>
						</div>
						<button
							gradientDuoTone="purpleToPink"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<Loading />
									<span className="pl-2">Loading...</span>
								</>
							) : (
								"Sign In"
							)}
						</button>
						{/* <OAuth /> */}
					</form>
					<div className="flex gap-2 text-sm mt-5">
						<span>Dont have an account ?</span>
						<Link to="/register" className="text-blue-500">
							Sign Up
						</Link>
					</div>
					{errorMessage && (
						<Alert className="" color="failure">
							{errorMessage}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
}
