import React, { useState } from "react";

export default function CreateTopic() {
	const [formData, setformData] = useState({});

	const handleChange = (e) => {
		setFormState({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		// Handle form submission here
	};

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
						name="equipment"
						value={formData.equipment}
						onChange={handleChange}
						className="form-input-select"
					>
						{/* Map over your equipment options here */}
					</select>
				</div>

				<div>
					<label>Article</label>
					<select
						name="article"
						value={formData.article}
						onChange={handleChange}
						className="form-input-select"
					>
						{/* Map over your article options here */}
					</select>
				</div>

				<div>
					<label>Message Author</label>
					<textarea
						name="msgAuthor"
						value={formData.msgAuthor}
						onChange={handleChange}
						className="form-input-text"
					/>
				</div>

				<button type="submit" className="form-btn-submit">
					Submit
				</button>
			</form>
		</main>
	);
}
