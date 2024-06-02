import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetch from "../cutomHooks/UseFetch";

export default function ProfileArticles() {
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
			const data = await fetchData(`/api/user/owner/articles-sections/${currentUser.userId}`);

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

	const handleDeleteSection = () => {
		// Here you can call your API to delete the entity
		const fetchDeleteEntity = async () => {
			try {
				const res = await fetch(`/api/section/delete/${entityToDelete}`, {
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

	const handleDeleteArticle = () => {
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
		<div>
			<h2>ARTICLE</h2>
			<Link to="/article/create">
				<button>Create an Article</button>
			</Link>
			<section>
				{fetchedData.map((article) => (
					<div key={article.id}>
						<h2>{article.category}</h2>
						<h3>{article.title}</h3>
						<p>{article.summary}</p>
						<Link to={`/article/edit/${article.id}`}>
							<button>Edit</button>
						</Link>
						<button
							className="delete-btn"
							onClick={() => openDialog(article.id)}
						>
							Delete
						</button>
					</div>
				))}
			</section>
			{/* <Link to='#'> */}
			{/* </Link> */}
			<h2>SECTION</h2>
			<Link to="/section/create">
				<button>Create a Section</button>
			</Link>
			<Link to="/section/edit/1">
				<button>Edit a Section</button>
			</Link>
			{/* <Link to='#'> */}
			<button name="" className="delete-btn" onClick={() => openDialog(8)}>
				Delete a Section
			</button>
			{/* </Link> */}
			<dialog ref={dialogRef}>
				<h2>Confirm Deletion</h2>
				<p>Are you sure you want to delete this entity {entityToDelete} ?</p>
				<button onClick={handleDeleteArticle}>Yes, delete it</button>
				<button onClick={closeDialog}>No, cancel</button>
			</dialog>
		</div>
	);
}
