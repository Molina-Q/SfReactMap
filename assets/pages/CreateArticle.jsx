import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateArticle() {
	const [formData, setFormData] = useState({
		'title': '',
		'summary': '',
		'century': '',
		'country': '',
	});

	const [centuries, setCenturies] = useState([]);
	const [countries, setCountries] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};
	console.log(formData);
	const handleSubmit = async (e) => {
		e.preventDefault();

		const values = Object.values(formData);
		if (values.every(value => value === '')) {
		  setError('Please fill out all fields.');
		  return;
		}

		try {
			const response = await fetch("/api/article/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.message);
			}
			// Handle successful form submission here
			// For example, you can clear the form
			setFormData({});
			navigate("/section/create");
		} catch (error) {
			setError(error.message);
		}
	};

	useEffect(() => {
		const fetchCenturiesAndCountries = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/article/country-century/data");

				const data = await res.json();

				if (res.ok) {
					setCenturies(data.centuries);
					setCountries(data.countries);

					setLoading(false);
				} else {
					setLoading(false);
					throw new Error(data.message);
				}
			} catch (error) {
				console.log(error.message);
				setLoading(false);
			}
		};

		fetchCenturiesAndCountries();
	}, []);

	return (
		<main className="wrap-login">
			<h1>Write an article</h1>
			<form onSubmit={handleSubmit} className="form-create">
				<div>
					<label>Title</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<label>Summary</label>
					<textarea
						name="summary"
						value={formData.summary}
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<label>Century</label>
					<select
						name="century"
						value={formData.century}
						onChange={handleChange}
						disabled={loading}
						required
					>
						<option value="none">None selected</option>

						{centuries.map((century) => (
							<option key={century.id} value={century.id}>
								{century.year}
							</option>
						))}
					</select>
				</div>

				<div>
					<label>Country</label>
					<select
						name="country"
						value={formData.country}
						onChange={handleChange}
						disabled={loading}
						required
					>
						<option value="none">None selected</option>

						{countries.map((country) => (
							<option key={country.id} value={country.id}>
								{country.name}
							</option>
						))}
					</select>
				</div>

				<button type="submit" disabled={loading} className="form-btn-submit">
					Submit and Create a Section
				</button>
			</form>
			{error && <p className="failure">{error}</p>}
		</main>
	);
}
