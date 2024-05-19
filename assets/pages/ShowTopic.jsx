import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAnything } from "../utils/Fetchs";
import TopicTag from "../components/forum/TopicTag";

export default function ShowTopic() {
	const [topic, setTopic] = useState(null);
	const [responses, setResponses] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const topicId = window.location.pathname.split("/").pop();
			const topicData = await fetchAnything(`/api/forum/topic/${topicId}`);

			if (topicData) {
				setTopic(topicData.topic);
				setResponses(topicData.responses);
			} else {
				console.error("MANUAL ERROR: Invalid data");
			}
		}

		fetchData();
	}, []);

	if (!topic) {
		return <div>Loading...</div>;
	}

	return (
		<main id="wrapperMain" className="wrap-forum">
			<article id="details-topic-header">
				<div className="topic-header-wrapper">
					<div className="param-btn-container">
						<div className="details-topic-info">
							{/* Replace TopicTag with your actual React component */}
							<TopicTag category={topic.cat} author={topic.author} />
						</div>

						<button>EDIT</button>

						<button className="delete-btn">DELETE</button>
					</div>

					<div className="details-topic-content">
						<h1>{topic.title}</h1>
						<p>{topic.message}</p>
					</div>
				</div>
			</article>

			{/* Replace this with your actual form component */}
			<form className="form-create">
				{/* Form fields go here */}
				<div>
					<label htmlFor="message">
                        Want to write a comment ?
                    </label>
					<textarea type="text" name="message" id="message" className="form-input-text" />
				</div>

				<button type="submit" className="form-btn-submit">
					Send
				</button>
			</form>

			<section id="details-topic-reponses">
				{responses && responses.length > 0 ? (
					responses.map((response) => (
						<div className="details-topic-tree" key={response.id}>
							<div className="details-topic-msg">
								<p>
									{response.author} -{" "}
									<span>
										{response.creationDate}
									</span>
								</p>
								<p>{response.text}</p>
								{/* Replace this with your actual form component */}
								<form action="/forum/topic/comment" method="post">
									{/* Form fields go here */}
									<input type="text" name="text" className="form-input-text" />
									<button type="submit" className="form-btn-submit">
										Reply
									</button>
									<Link to={`/update_message/${response.id}`}>
										<strong>EDIT</strong>
									</Link>
									<Link
										to={`/delete_message/${response.id}`}
										className="delete-btn"
									>
										<strong>DELETE</strong>
									</Link>
								</form>
							</div>
							{response &&
								response.comments &&
								response.comments.length > 0 &&
								response.comments.map((comment) => (
									<div className="details-topic-comment" key={comment.id}>
										<p>
											{comment.Author} -{" "}
											<span>
												{new Date(comment.creationDate).toLocaleString()}
											</span>
										</p>
										<p>{comment.text}</p>
										<Link to={`/update_comment/${comment.id}`}>
											<strong>EDIT</strong>
										</Link>
										<Link
											to={`/delete_comment/${comment.id}`}
											className="delete-btn"
										>
											<strong>DELETE</strong>
										</Link>
									</div>
								))}
						</div>
					))
				) : (
					<div className="details-topic-tree">
						<div className="details-topic-msg">
							<p>This topic doesn't have any messages</p>
						</div>
					</div>
				)}
			</section>
		</main>
	);
}
