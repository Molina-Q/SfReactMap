import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAnything } from "../utils/Fetchs";
import TopicTag from "../components/forum/TopicTag";

export default function ShowTopic() {
	const [topic, setTopic] = useState(null);
	const [responses, setResponses] = useState([]);

	const [commentData, setCommentData] = useState({});
	const [messageData, setMessageData] = useState({});

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

	const handleChange = (e) => {
		if(e.target.id === 'comment') {
			setCommentData({ ...commentData, [e.target.id]: e.target.value });
		}

		if(e.target.id === 'message') {
			setMessageData({ ...messageData, [e.target.id]: e.target.value });
		}	
	};

	const handleMessageSubmit = async (e) => {
		e.preventDefault();

		const topicId = window.location.pathname.split("/").pop();
		const message = e.target.message.value;

		const data = await fetchAnything(`/api/forum/message/${topicId}/message`, {
			method: "POST",
			body: JSON.stringify({ message }),
		});

		if (data) {
			setResponses([...responses, data]);
		} else {
			console.error("MANUAL ERROR: Invalid data");
		}
	
	}

	const handleCommentSubmit = async (e) => {
		e.preventDefault();

		const responseId = e.target.parentNode.parentNode.id;
		const comment = e.target.comment.value;

		const data = await fetchAnything(`/api/forum/response/${responseId}/comment`, {
			method: "POST",
			body: JSON.stringify({ comment }),
		});

		if (data) {
			const updatedResponses = responses.map((response) => {
				if (response.id === responseId) {
					return { ...response, comments: [...response.comments, data] };
				}

				return response;
			});

			setResponses(updatedResponses);
		} else {
			console.error("MANUAL ERROR: Invalid data");
		}
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
			<form className="form-create" onSubmit={handleMessageSubmit}>
				{/* Form fields go here */}
				<div>
					<label htmlFor="message">
                        Want to write a message ?
                    </label>
					<textarea onChange={handleChange} name="text" id="text" className="form-input-text" />
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
								<form onSubmit={handleCommentSubmit} method="post">
									{/* Form fields go here */}
									<input type="text" id="comment" name="text" className="form-input-text" onChange={handleChange} />
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
											{comment.Author}-{" "}
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
