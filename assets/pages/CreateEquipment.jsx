import React, { useState } from "react";

export default function CreateEquipment() {
	const [formData, setFormData] = useState({});
	const [dataMessage, setDataMessage] = useState(null);
	const [alertType, setAlertType] = useState("failure");

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
			const response = await fetch("/api/equipment/create-entity", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: data,
			});

			const responseData = await response.json();

			setAlertType(response.ok ? "success" : "failure");
			setDataMessage(responseData.status);
		} catch (error) {
			setDataMessage(error.message);
		}
	};

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
			<h1>Create a piece of Equipment</h1>

			<form onSubmit={handleSubmit} className="form-create">
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
					<select id="sub_category" onChange={handleChange}>
						{/* You would typically fetch these options from your server */}
						<option value="">Select a sub category...</option>
						<option value="1">Sword</option>
						<option value="subCategory2">Sub Category 2</option>
						{/* ... */}
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
			{dataMessage && (
				<div className={`alert ${alertType} `}>{dataMessage}</div>
			)}
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
