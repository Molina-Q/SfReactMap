import React, { useEffect, useState } from "react";

export default function TopicsList() {
	const [topics, setTopics] = useState(null);

	useEffect(() => {
		async function fetchData() {
			console.log("-- Fetch - called --");

			const res = await fetch("/api/forum/topics/category");

			const data = await res.json();
			console.log("data :", data.object);
			console.log("-- Fetch - received --");

			if (!res.ok) {
				console.error("MANUAL ERROR: Invalid response");
				return;
			}

			if (data) {
				setTopics(data.object);
			} else {
				console.error("MANUAL ERRROR: Invalid data");
			}
		}

		fetchData();
	}, []);

	return (
		<main>
			<h1>Topics</h1>
			<div className="topics-container">
				<div className="table-row table-header">hrell</div>

				<div className="table-body">
					{topics &&
						topics.map((topic) => (
							<div className="table-row" key={topic.id}>
								<p className="topics-items">{topic.cat}</p>
								<p className="topics-items">{topic.title}</p>
								<p className="topics-items">
									by <b>{topic.author}</b>
								</p>
								<p className="topics-items">
									{new Date(topic.creationDate).toLocaleString()}
								</p>
							</div>
						))}
				</div>
        
			</div>
		</main>
	);
}
