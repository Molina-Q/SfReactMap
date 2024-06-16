import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSection() {
	const navigate = useNavigate();
	const params = useParams();
	const [formData, setFormData] = useState({
		id: "",
		title: "",
		text: "",
		summary: "",
		Article: { id: "", title: "" },
		equipmentSections: [{ equip: "" }],
	});

	console.log(formData);

	const [equipments, setEquipments] = useState([]);

	const [loadingCategory, setLoadingCategory] = useState(true);
	const [equipCat, setEquipCat] = useState(null);

	const handleCatChange = (e) => {
		if (formData.equipmentSections.length == 1) {
			setEquipCat(e.target.value);
		}
	};

	useEffect(() => {
		const fetchSections = async () => {
			try {
				const response = await fetch(`/api/section/${params.sectionId}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const data = await response.json();

				if (response.ok) {
					console.log(data.section);

					const { id, title, summary, text, category, Article, Equipments } =
						data.section;
					console.log(id, title, summary, text, Article, Equipments);

					setEquipCat(category);

					setFormData({
						id,
						title,
						text,
						summary,
						Article: { id: Article.id, title: Article.title },
						equipmentSections: Equipments.map((equip) => ({ equip: equip.id })),
					});
				} else {
					console.error("Error:", data.message);
				}

				setLoadingCategory(false);
			} catch (error) {
				console.error("Error:", error);
				setLoadingCategory(false);
			}
		};

		fetchSections();
	}, []);

	// fetch the equipments to show in the equipment selection option
	// change because i only want to show object from one category
	useEffect(() => {
		if (!equipCat) return;

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
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleEquipChange = (index, event) => {
		const newEquipmentSections = [...formData.equipmentSections];
		newEquipmentSections[index].equip = event.target.value;
		setFormData({
			...formData,
			equipmentSections: newEquipmentSections,
		});
	};

	const handleAddEquip = () => {
		setFormData({
			...formData,
			equipmentSections: [...formData.equipmentSections, { equip: "" }],
		});
	};

	const handleRemoveEquip = (index) => {
		const newEquipmentSections = [...formData.equipmentSections];
		newEquipmentSections.splice(index, 1);
		setFormData({
			...formData,
			equipmentSections: newEquipmentSections,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`/api/section/edit/${params.sectionId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			console.log(data);
			if (response.ok) {
				console.log(data.message);
				navigate("/profile?tab=articles");
			} else {
				console.error(data.message);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form-create">
			<Helmet>
				<title>Edit Section</title>
				<meta name="description" content="Edit a section" />
			</Helmet>
			<h2>Edit - {formData.Article.title}</h2>
			<div className="input-group">
				<label htmlFor="title">Title:</label>
				<input
					id="title"
					name="title"
					value={formData.title}
					onChange={handleInputChange}
					placeholder="Title"
				/>
			</div>

			<div className="input-group">
				<label htmlFor="text">Text:</label>
				<input
					id="text"
					name="text"
					value={formData.text}
					onChange={handleInputChange}
					placeholder="Text"
				/>
			</div>

			<div className="input-group">
				<label htmlFor="summary">Summary:</label>
				<textarea
					id="summary"
					name="summary"
					value={formData.summary}
					onChange={handleInputChange}
					placeholder="Summary"
				/>
			</div>

			<div>
				<label htmlFor="equip-cat">Equipement Category</label>
				<select
					value={equipCat}
					disabled={loadingCategory || !equipCat}
					onChange={handleCatChange}
					name="category"
					id="equip-cat"
				>
					<option value="1">Weapon</option>
					<option value="2">Armour</option>
					<option value="3">Tool</option>
				</select>
			</div>

			{!equipCat ||
				formData.equipmentSections.map((item, index) => (
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
