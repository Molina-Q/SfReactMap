import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTopic() {
	const [formData, setFormData] = useState({
		title: "",
		Equipment: "",
		Article: "",
		Message: "",
	});

	const [articles, setArticles] = useState([
		{
			id: "",
			label: "",
		},
	]);

	const [equipments, setEquipments] = useState([
		{
			id: "",
			label: "",
		},
	]);

	const [loading, setLoading] = useState(true);
	const [loadingCategory, setLoadingCategory] = useState(true);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	function handleChange(e) {
		const { name, value } = e.target;
		const labels = ["Equipment", "Article"]

		// if the value of e.target.name appear even once inside labels then it is true 
		if (labels.some((label) => label === name)) {

			setFormData(() => ({
				...formData,
				Equipment: name === "Equipment" ? value : "",
				Article: name === "Article" ? value : "",
			}));

		} else {

			setFormData(() => ({
				...formData,
				[e.target.name]: e.target.value,
			}));
		}
	}

	console.log(formData);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const values = Object.values(formData);
		if (values.every((value) => value === "")) {
			setError("Please fill out all fields.");
			return;
		}

		try {
			const response = await fetch("/api/forum/topic/create", {
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
			navigate("/forum/topics");
		} catch (error) {
			setError(error.message);
		}
	};

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const response = await fetch(`/api/articles/equipments/data`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const data = await response.json();

				if (response.ok) {
					console.log(data);
					setEquipments(data.equipments);
					setArticles(data.articles);
				} else {
					console.error("Error:", data.message);
				}

				setLoadingCategory(false);
			} catch (error) {
				console.error("Error:", error);
				setLoadingCategory(false);
			}
		};
		fetchArticles();
	}, []);

	return (
		<main className="wrapperMain wrap-login">
			<h1>Write a Topic</h1>
			<form onSubmit={handleSubmit} className="form-create">
				<div>
					<label>Title</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						className="form-input-text"
					/>
				</div>

				<div>
					<label>Equipment</label>
					<select
						name="Equipment"
						value={formData.Equipment}
						onChange={handleChange}
						className="form-input-select"
						disabled={loadingCategory}
					>
						<option value="">None</option>
						{equipments.map((equipment) => (
							<option key={equipment.id} value={equipment.id}>
								{equipment.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label>Article</label>
					<select
						name="Article"
						value={formData.Article}
						onChange={handleChange}
						className="form-input-select"
						disabled={loadingCategory}
					>
						<option value="">None</option>
						{articles.map((article) => (
							<option key={article.id} value={article.id}>
								{article.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label>Message Author</label>
					<textarea
						name="Message"
						value={formData.msgAuthor}
						onChange={handleChange}
						className="form-input-text"
					/>
				</div>

				<button className="form-btn-submit">Submit</button>
			</form>
		</main>
	);
}
