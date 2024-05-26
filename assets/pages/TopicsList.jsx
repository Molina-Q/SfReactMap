import React, { useEffect, useState } from "react";
import { BsChatText } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function TopicsList() {
	const [topics, setTopics] = useState([{
		id: "",
		title: "",
		message: "",
		cat: "",
		creationDate: "",
	
	}]);

	const [rangeValue, setRangeValue] = useState(1400);

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

	const handleRange = (e) => {
		setRangeValue(e.target.value);
		// console.log(e.target.value);
	};

	const handleDelete = async (id) => {
		const res = await fetch(`/api/topic/delete/${id}`, {
			method: "DELETE",
		});

		const data = res.json();

		if (res.ok) {
			console.log(data.message);
			setTopics(topics.filter((topic) => topic.id !== id));
		}
	
	}


	return (
		<main>
			<h1>Topics</h1>
			<div className="topics-container">

				<div>
					<form className="form-create">
						<div>

							<input type="text" placeholder="Search" />
							<button type="submit">Search</button>
						</div>

						<div>

							<label htmlFor="country">Country</label>
							<select name="country" id="country">
								<option value="">France</option>
								<option value="">Belgium</option>
							</select>
						</div>

						<div>
							<label htmlFor="">Century</label>
							<input onChange={handleRange} type="range" min="1400" max="1900" step='100' name="" id="" />

							<span>Range value : {rangeValue}</span>
						</div>
					</form>
				</div>

				<div className="table-row table-header">
					<div>
						<select name="" id="">
							<option value="">Recent</option>
							<option value="">Oldest</option>
							<option value="">Most liked</option>
						</select>
					</div>
				</div>

				<div className="table-body">
					{topics &&
						topics.map((topic) => (
							<div className="table-row" key={topic.id}>
								<div className="table-topic-head">
									<p className="table-cat">[ {topic.cat} ]</p>
									<span>|</span>
									<p className="table-date">
										{Math.floor((new Date() - new Date(topic.creationDate)) / (1000 * 60 * 60)) + ' hours ago'}
									</p>
									<span>|</span>
									<Link to={`/topic/edit/${topic.id}`}><small>edit</small></Link>
									<button><small onClick={() => handleDelete(topic.id)}>delete</small></button>
								</div>

								<Link to={`/forum/topic/${topic.id}`} className="table-title">{topic.title}</Link>
								<p className="table-message">{topic.message}</p>

								<div className="table-icons">
									<span className="table-icon-item"><FcLike size={'15px'} /> Like</span>
									<Link  to={`/forum/topic/${topic.id}`}><span className="table-icon-item"><BsChatText /> Comment</span></Link>
								</div>
							</div>
						))}
				</div>
			</div>
		</main>
	);
}
