import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Loading from "../components/UI/animation/Loading";

export default function SignIn() {

    const [formData, setFormData] = useState({ props });
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

		
			<div className="login">
				<h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
	
				<form method="post" className="form-create">
					{props.error && (
						<div className="alert alert-danger">{props.error.messageKey}</div>
					)}
	
					{props.user && (
						<div className="mb-3">
							You are logged in as {props.user.userIdentifier}, <a href={props.logoutPath}>Logout</a>
						</div>
					)}
	
					<label htmlFor="inputEmail">Email</label>
					<input type="email" value={props.lastUsername} name="email" id="inputEmail" className="form-control" autoComplete="email" required />
					<label htmlFor="inputPassword">Password</label>
					<input type="password" name="password" id="inputPassword" className="form-control" autoComplete="current-password" required />
	
					<input type="hidden" name="_csrf_token" value={props.csrfToken} />
	
					<button className="form-btn-submit" type="submit">
						Sign in
					</button>
				</form>
			</div>
		
		// <div className="min-h-screen mt-20">
		// 	<div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
		// 		{/* right side */}
		// 		<div className="flex-1">
		// 			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
		// 				<div>
		// 					<label htmlFor="email" value="Your email" />
		// 					<input
		// 						type="email"
		// 						placeholder="name@company.com"
		// 						id="email"
		// 						onChange={handleChange}
		// 					/>
		// 				</div>
		// 				<div>
		// 					<label htmlFor="password" value="Your password" />
		// 					<input
		// 						type="password"
		// 						placeholder="Password"
		// 						id="password"
		// 						onChange={handleChange}
		// 					/>
		// 				</div>
		// 				<button
		// 					gradientDuoTone="purpleToPink"
		// 					type="submit"
		// 					disabled={loading}
		// 				>
		// 					{loading ? (
		// 						<>
		// 							<Loading />
		// 							<span className="pl-2">Loading...</span>
		// 						</>
		// 					) : (
		// 						"Sign In"
		// 					)}
		// 				</button>
		// 				{/* <OAuth /> */}
		// 			</form>
		// 			<div className="flex gap-2 text-sm mt-5">
		// 				<span>Dont have an account ?</span>
		// 				<Link to="/register" className="text-blue-500">
		// 					Sign Up
		// 				</Link>
		// 			</div>
		// 			{errorMessage && (
		// 				<Alert className="" color="failure">
		// 					{errorMessage}
		// 				</Alert>
		// 			)}
		// 		</div>
		// 	</div>
		// </div>
	);
  
}

