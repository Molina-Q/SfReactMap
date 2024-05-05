import React, { useEffect, useState } from "react";
import TopicTag from "../components/forum/TopicTag";
import { Link } from "react-router-dom";
import { fetchAnything } from "../utils/Fetchs";

export default function Forum() {
	const [topics, setTopics] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// async function that fetch articles data for the country during the selected century from the MapController
		// await for data at the given URI (Uniform Resource Identifier)
		async function fetchData() {
			setLoading(true);

			console.log("-- Fetch - called --");

			// const data = await fetchAnything(`/dataCountry/${clickedCountry}/${checkedYear}`);
			const data = await fetchAnything("/api/forum/popularposts");

			console.log("-- Fetch - received --");

			if (data) {
				setTopics(data.topics);
				setLoading(false);
			} else {

				setLoading(false); // loading is set to false to avoid infinite loading

				console.error("MANUAL ERRROR: Invalid data");
			}
		}

		fetchData();
	}, []);

	return (
		<main id="wrapperMain">
			<h2 className="primary-title">Welcome app.user!</h2>

			<a href="{{ path('create_topic')}}">
				<button>New topic</button>
			</a>

			<div className="topics-category">
				{/* {% for category in equipCateg %} */}

				<a href="{{ path('list_topic', {id:category.id, sortBy:'equip'}) }}">
					<button>Topics by category.label</button>
				</a>

				{/* {% endfor %} */}

				<a href="{{ path('list_topic', {sortBy:'article'}) }}">
					<button>Topics by Article</button>
				</a>
			</div>

			<section className="table-popular">
				<div className="table-header table-row">
					<h3>Popular topics</h3>
				</div>

				<div className="table-body">
					{topics &&
						topics.map((topic) => (
							<div className="table-row">
								<div>
									<div className="details-topic-info">
										{/* <TopicTag /> */}
									</div>

									<p>
										<Link to={`/forum/topic/${topic.id}`}>{topic.title}</Link>
									</p>
								</div>
							</div>
						))}
				</div>
			</section>
		</main>
	);
}
