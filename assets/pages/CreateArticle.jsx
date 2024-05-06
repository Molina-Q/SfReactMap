import { useState } from "react";

export default function CreateArticle() {
	const [formData, setFormData] = useState({
		title: "",
		summary: "",
		century: "",
		country: "",
		sections: [],
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSectionChange = (index, event) => {
		const newSections = [...formData.sections];
		newSections[index] = event.target.value;
		setFormData({
			...formData,
			sections: newSections,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		// Handle form submission here
	};

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
					/>
				</div>

				<div>
					<label>Summary</label>
					<textarea
						name="summary"
						value={formData.summary}
						onChange={handleChange}
					/>
				</div>

				<div>
					<label>Century</label>
					<select
						name="century"
						value={formData.century}
						onChange={handleChange}
						disabled
					>
						{/* Map over your century options here */}
					</select>
				</div>

				<div>
					<label>Country</label>
					<select
						name="country"
						value={formData.country}
						onChange={handleChange}
					>
						{/* Map over your country options here */}
					</select>
				</div>

				{formData.sections.map((section, index) => (
					<div key={index}>
						<label>Section {index + 1}</label>
						<input
							type="text"
							name={`section${index}`}
							value={section}
							onChange={(event) => handleSectionChange(index, event)}
						/>
					</div>
				))}

				<button type="submit" className="form-btn-submit">Submit</button>
			</form>
		</main>
	);
}
