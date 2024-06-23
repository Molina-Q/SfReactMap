import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetch from "../cutomHooks/UseFetch";
import { Helmet } from "react-helmet-async";
import { FaTrash } from "react-icons/fa";
import { FaPen } from "react-icons/fa";

export default function ProfileTopics() {
	const { currentUser } = useSelector((state) => state.user);

	const { fetchData, error } = useFetch();

	const dialogRef = useRef(null);
	const [entityToDelete, setEntityToDelete] = useState(null);
	const [fetchedData, setFetchedData] = useState([
		{
			id: "",
			title: "",
			summary: "",
			creation_date: "",
			country: "",
			century: "",
		},
	]);

	useEffect(() => {
		async function fetchCreatedEntity() {
			const data = await fetchData("/api/forum/topics/category");

			if (data) {
				setFetchedData(data.object);
			}
		}
		fetchCreatedEntity();
	}, []);

	const openDialog = (entityId) => {
		setEntityToDelete(entityId);
		dialogRef.current.showModal();
	};

	const closeDialog = () => {
		dialogRef.current.close();
	};

	const handleDeleteTopics = () => {
		// Here you can call your API to delete the entity
		const fetchDeleteEntity = async () => {
			try {
				const res = await fetch(`/api/article/delete/${entityToDelete}`, {
					method: "DELETE",
				});
				const data = await res.json();

				if (res.ok) {
					console.log(data);
				}
			} catch (error) {
				console.log("Error deleting entity : ", error.message);
			}
		};

		fetchDeleteEntity();

		closeDialog();
	};

	return (
		<div className="wrap-login">
			<Helmet>
				<title>Profile Topics</title>
				<meta name="description" content="User Topics" />
			</Helmet>

			<h2>Topics</h2>

			<section className="profile-table-container">
				{fetchedData.map((topic) => (
					<div key={topic.id} className="profile-items-table">
						<div className="profile-left-table">
							<p>[{topic.cat}]</p>
							<p>|</p>
							<Link to={`/forum/topic/${topic.id}`}>
								<p>{topic.title}</p>
							</Link>
						</div>

						<div className="profile-right-table">
							<Link to={`/topics/edit/${topic.id}`}>
								<button>
									<FaPen />
								</button>
							</Link>
							<button
								className="delete-btn"
								onClick={() => openDialog(topic.id)}
							>
								<FaTrash className="delete-icon" />
							</button>
						</div>
					</div>
				))}
			</section>

			<dialog ref={dialogRef}>
				<h2>Confirm Deletion</h2>
				<p>Are you sure you want to delete this entity {entityToDelete} ?</p>
				<button onClick={handleDeleteTopics}>Yes, delete it</button>
				<button onClick={closeDialog}>No, cancel</button>
			</dialog>
		</div>
	);
}
