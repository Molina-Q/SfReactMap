import React, { useEffect, useState } from "react";
import { BsChatText } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
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
								<div className="table-topic-head">
									<p className="table-cat">[ {topic.cat} ]</p>
									<span>|</span>
									<p className="table-date">
										{  Math.floor((new Date() - new Date(topic.creationDate)) / (1000 * 60 * 60)) + ' hours ago'}
									</p>
								</div>
	
								<p className="table-title">{topic.title}</p>
								<p className="table-message">{topic.message}</p>

								<div className="table-icons">
									<span className="table-icon-item"><FcLike size={'15px'}/> Like</span>
									<span className="table-icon-item"><BsChatText /> Comment</span>
								</div>
							</div>
						))}
				</div>
			</div>
		</main>
	);
}
