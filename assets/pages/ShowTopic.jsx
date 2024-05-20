import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAnything } from "../utils/Fetchs";
import TopicTag from "../components/forum/TopicTag";
import { BsThreeDots } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";

export default function ShowTopic() {
	const [topic, setTopic] = useState(null);
	const [responses, setResponses] = useState([]);

	const [commentData, setCommentData] = useState({});
	const [messageData, setMessageData] = useState({});

	const topicId = window.location.pathname.split("/").pop();

	useEffect(() => {
		async function fetchData() {
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
		console.log(e.target.id);
		if (e.target.id === "comment") {
			setCommentData({ ...commentData, [e.target.name]: e.target.value });
		}

		if (e.target.id === "message") {
			setMessageData({ ...messageData, [e.target.name]: e.target.value });
		}

		// console.log('comment: ', commentData, ' - message : ', messageData);
	};

	const handleMessageSubmit = async (e) => {
		e.preventDefault();

		const response = await fetch(`/api/forum/message/create/${topicId}`, {
			method: "POST",
			body: JSON.stringify({ ...messageData }),
		});

		const data = await response.json();

		if (data) {
			setResponses([...responses, data.object]);
		} else {
			console.error("MANUAL ERROR: Invalid data");
		}
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();

		const messageId = e.target.getAttribute("data-id");

		const res = await fetch(`/api/forum/comment/create/${messageId}`, {
			method: "POST",
			body: JSON.stringify({ ...commentData }),
		});

		const dataComment = await res.json();

		if (res.ok) {
			const data = dataComment.object;
			const updatedResponses = responses.map((response) => {
				if (response.id == messageId) {
					return { ...response, comments: [...response.comments, data] };
				}

				return response;
			});

			setResponses(updatedResponses);
		} else {
			console.error("MANUAL ERROR: Invalid data");
		}
	};

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
					<label htmlFor="message">Want to write a message ?</label>
					<textarea
						onChange={handleChange}
						id="message"
						name="text"
						className="form-input-text"
					/>
				</div>

				<button type="submit" className="form-btn-submit">
					Send <IoSendSharp/>
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
										{new Date(response.creationDate).toLocaleString()}
									</span>
								</p>
								<p>{response.text}</p>
								{/* Replace this with your actual form component */}
								<form onSubmit={handleCommentSubmit} data-id={response.id}>
									{/* Form fields go here */}
									<input
										type="text"
										id="comment"
										name="text"
										className="form-input-text"
										onChange={handleChange}
									/>
									<button type="submit" className="form-btn-submit">
										Reply
									</button>
									<BsThreeDots />
									{/* <Link to={`/update_message/${response.id}`}>
										<strong>EDIT</strong>
									</Link>
									<Link
										to={`/delete_message/${response.id}`}
										className="delete-btn"
									>
										<strong>DELETE</strong>
									</Link> */}
								</form>
							</div>
							{response &&
								response.comments &&
								response.comments.length > 0 &&
								response.comments.map((comment) => (
									<div className="details-topic-comment" key={comment.id}>
										<p>
											{comment.author} -{" "}
											<span>
												{new Date(comment.creationDate).toLocaleString()}
											</span>
										</p>
										<p>{comment.text}</p>
										<BsThreeDots />

										{/* <Link to={`/update_comment/${comment.id}`}>
											<strong>EDIT</strong>
										</Link>
										<Link
											to={`/delete_comment/${comment.id}`}
											className="delete-btn"
										>
											<strong>DELETE</strong>
										</Link> */}
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
