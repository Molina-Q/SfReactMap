import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function CreateEquipment() {
	const [formData, setFormData] = useState({
		name: "",
		text: "",
		sub_category: "",
		image: null,
	});
	const [dataMessage, setDataMessage] = useState(null);
	const [alertType, setAlertType] = useState("failure");
	const [subCategories, setSubCategories] = useState([]);
	const [selectLoading, setSelectLoading] = useState(true);
	console.log(formData);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setDataMessage(null);

		if (
			!formData.name ||
			!formData.text ||
			!formData.sub_category ||
			!formData.image
		) {
			setAlertType("failure");
			setDataMessage("Please fill in all fields");
			return;
		}

		// Create a new FormData object
		let data = new FormData();

		// Append all form data to it
		for (let key in formData) {
			data.append(key, formData[key]);
		}

		try {
			const response = await fetch("/api/equipment/create", {
				method: "POST",
				body: data,
			});

			const responseData = await response.json();

			setAlertType(response.ok ? "success" : "failure");
			setDataMessage(responseData.message);
		} catch (error) {
			setDataMessage(error.message);
		}
	};

	useEffect(() => {
		async function fetchSubCategories() {
			setSelectLoading(true);
			// Fetch sub categories from the server
			try {
				const res = await fetch("/api/forum/getSubCat");
				const data = await res.json();
				setSubCategories(data.subCategories);
				setSelectLoading(false);

				// Process the responseData and set it to state or perform any other actions
			} catch (error) {
				setSelectLoading(false);
				console.error(error);
			}
		}

		fetchSubCategories();
	}, []);

	const handleFileChange = (e) => {
		setFormData({ ...formData, image: e.target.files[0] });
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	return (
		<main className="wrap-login">
			<Helmet>
				<title>Create Equipment</title>
				<meta name="description" content="Create a new piece of equipment" />
			</Helmet>

			<h1>Create a piece of Equipment</h1>

			<form onSubmit={handleSubmit} className="form-create">
				{dataMessage && (
					<div className={`alert ${alertType} `}>{dataMessage}</div>
				)}
				<div>
					<label>Name:</label>
					<input
						type="text"
						id="name"
						onChange={handleChange}
						value={formData.name}
						className="form-input-text"
					/>
				</div>

				<div>
					<label>Description:</label>
					<textarea
						id="text"
						onChange={handleChange}
						value={formData.text}
						rows="2"
						className="form-input-text"
					/>
				</div>

				<div>
					<label>Sub Category:</label>
					<select
						id="sub_category"
						onChange={handleChange}
						disabled={selectLoading}
						value={formData.sub_category}
					>
						{subCategories &&
							subCategories.map((subCategory) => (
								<option key={subCategory.id} value={subCategory.id}>
									{subCategory.label}
								</option>
							))}
					</select>
				</div>

				<div>
					<label>Picture:</label>
					<input type="file" onChange={handleFileChange} />
				</div>

				<button type="submit" className="form-btn-submit">
					Submit
				</button>
			</form>

			{formData.image && (
				<div className="preview-container">
					<h2 className="preview-title">Preview of the uploaded image</h2>
					<img
						className="preview-image"
						src={URL.createObjectURL(formData.image)}
						alt="preview"
					/>
				</div>
			)}
		</main>
	);
}
