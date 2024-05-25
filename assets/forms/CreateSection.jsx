import React, { useEffect, useState } from "react";

export default function CreateSection() {
	const [formState, setFormState] = useState({
		Article: "",
		title: "",
		text: "",
		summary: "",
		equipmentSections: [{ equip: "" }],
	});
	const [equipments, setEquipments] = useState([]);

	const [loadingCategory, setLoadingCategory] = useState(true);
	const [equipCat, setEquipCat] = useState(1);
	const [articles, setArticles] = useState([]);

	const handleCatChange = (e) => {
		if (formState.equipmentSections.length == 1) {
			setEquipCat(e.target.value);
		} else {
			alert("Please remove all equipment before changing category");
		}
	};

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const response = await fetch(`/api/article/data`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const data = await response.json();

				if (response.ok) {
					console.log(data);

					setArticles(data.object);
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

	// fetch the equipments to show in the equipment selection option
	// change because i only want to show object from one category
	useEffect(() => {
		setLoadingCategory(true);

		const fetchEquipment = async () => {
			try {
				const response = await fetch(`/api/equipment/data/${equipCat}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const data = await response.json();

				if (response.ok) {
					setEquipments(data.object);
				} else {
					console.error("Error:", data.message);
				}

				console.log(data);

				setLoadingCategory(false);
			} catch (error) {
				console.error("Error:", error);
				setLoadingCategory(false);
			}
		};
		fetchEquipment();
	}, [equipCat]);

	const handleInputChange = (event) => {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	};

	const handleEquipChange = (index, event) => {
		const newEquipmentSections = [...formState.equipmentSections];
		newEquipmentSections[index].equip = event.target.value;
		setFormState({
			...formState,
			equipmentSections: newEquipmentSections,
		});
	};

	const handleAddEquip = () => {
		setFormState({
			...formState,
			equipmentSections: [...formState.equipmentSections, { equip: "" }],
		});
	};

	const handleRemoveEquip = (index) => {
		const newEquipmentSections = [...formState.equipmentSections];
		newEquipmentSections.splice(index, 1);
		setFormState({
			...formState,
			equipmentSections: newEquipmentSections,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(`/api/section/create/${formState.Article}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formState),
			});
			const responseData = await response.json();
			console.log(responseData);

			setFormState({
				title: "",
				text: "",
				summary: "",
				Article: "",
				equipmentSections: [{ equip: "" }],
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form-create">
			<div className="input-group">
				<label htmlFor="Article">Article:</label>
				{articles && (
					<select
						disabled={loadingCategory}
						onChange={handleInputChange}
						name="Article"
						id="Article"
					>
						{articles.map((article) => (
							<option key={article.id} value={article.id}>
								{article.title} | {article.category}
							</option>
						))}
					</select>
				)}
				{/* <input
					id="Article"
					name="Article"
					value={formState.Article}
					onChange={handleInputChange}
					placeholder="Article"
				/> */}
			</div>

			<div className="input-group">
				<label htmlFor="title">Title:</label>
				<input
					id="title"
					name="title"
					value={formState.title}
					onChange={handleInputChange}
					placeholder="Title"
				/>
			</div>

			<div className="input-group">
				<label htmlFor="text">Text:</label>
				<input
					id="text"
					name="text"
					value={formState.text}
					onChange={handleInputChange}
					placeholder="Text"
				/>
			</div>

			<div className="input-group">
				<label htmlFor="summary">Summary:</label>
				<textarea
					id="summary"
					name="summary"
					value={formState.summary}
					onChange={handleInputChange}
					placeholder="Summary"
				/>
			</div>

			<div>
				<label htmlFor="equip-cat">Equipement Category</label>
				<select
					disabled={loadingCategory}
					onChange={handleCatChange}
					name="category"
					id="equip-cat"
				>
					<option value="1">Weapon</option>
					<option value="2">Armour</option>
					<option value="3">Tool</option>
				</select>
			</div>

			{formState.equipmentSections.map((item, index) => (
				<div key={index} className="input-group">
					<label htmlFor={`equip${index}`}>Equipment {index + 1}:</label>
					<select
						id={`equip${index}`}
						name={`equip${index}`}
						value={item.equip}
						onChange={(event) => handleEquipChange(index, event)}
						placeholder="Equip"
					>
						{equipments &&
							equipments.map((equip) => (
								<option key={equip.id} value={equip.id}>
									{equip.name}
								</option>
							))}
					</select>

					<button type="button" onClick={() => handleRemoveEquip(index)}>
						Remove
					</button>
				</div>
			))}

			<button type="button" onClick={handleAddEquip}>
				Add Equipment
			</button>

			<input type="submit" />
		</form>
	);
}
