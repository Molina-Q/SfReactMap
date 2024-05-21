import React, { useEffect, useState } from "react";
import TopicTag from "../components/forum/TopicTag";
import { Link } from "react-router-dom";
import { fetchAnything } from "../utils/Fetchs";
import Loading from "../components/UI/animation/Loading";
import { useSelector } from "react-redux";

export default function Forum() {
	const [topics, setTopics] = useState([]);
	const [loading, setLoading] = useState(true);
	const { currentUser } = useSelector((state) => state.user);

	const [topicCategories, setTopicCategories] = useState([
		{
			title: "Century",
			nbTopic: 30,
			lastTopic: "01-01-2000",
		},
		{
			title: "Country",
			nbTopic: 25,
			lastTopic: "01-01-2000",
		},
		{
			title: "Weapon",
			nbTopic: 60,
			lastTopic: "01-01-2000",
		},
		{
			title: "Armour",
			nbTopic: 15,
			lastTopic: "01-01-2000",
		},
		{
			title: "Tool",
			nbTopic: 1,
			lastTopic: "01-01-2000",
		},
	]);

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
		<main id="wrapperMain" className="wrap-forum">
			<h2 className="primary-title">Forum</h2>

			<Link to="/topic/create">
				<button>New topic</button>
			</Link>
			<section className="forum-content">
				<section className="topic-categories">
					{topicCategories.map((cat) => (
						<Link
							to={`/api/forum/topics/category?show=${cat.title.toLowerCase()}`}
							key={cat.title}
							className="topic-categories-link"
						>
							<div className="topic-categories-bloc">
								<h2 className="topic-categories-title">
									Topics by {cat.title}
								</h2>

								<section className="topic-categories-section">
									<div className="topic-categories-attribut">
										<p>{cat.nbTopic}</p>
										<p>{cat.nbTopic <= 1 ? "topic" : "topics"}</p>
									</div>

									<div className="topic-categories-attribut">
										<p>{cat.lastTopic}</p>
										<p>Last topic</p>
									</div>
								</section>
							</div>
						</Link>
					))}
				</section>

				<section className="table-popular">
					<div className="table-header table-row">
						<h3>Popular topics</h3>
					</div>

					<div className="table-body">
						{loading ? (
							<Loading />
						) : (
							topics.map((topic) => (
								<div className="table-row" key={topic.id}>
									<div>
										<div className="details-topic-info">
											{/* <TopicTag /> */}
										</div>

										<p>
											<Link to={`/forum/topic/${topic.id}`}>{topic.title}</Link>
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</section>
			</section>
		</main>
	);
}
