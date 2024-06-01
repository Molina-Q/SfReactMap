import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function useFetch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

	const [error, setError] = useState(null);

	const fetchData = async (url, options) => {
		try {
			const response = await fetch(url, options);
			const data = await response.json();

			if (response.status === 401) {
				dispatch(clearUser());
                navigate("/login");
				return null;
			}

            // if promise is rejected
			if (!response.ok) {
				setError(data.message);
				return null;
			}

            // if server response is an error
			if (data.error === "true") {
				setError(data.message);
				return null;
			}

            // if all is fine, return the entire data
			return data;
		} catch (error) {
			setError(error.message);
			return null;
		}
	};

	return { fetchData, error };
}
