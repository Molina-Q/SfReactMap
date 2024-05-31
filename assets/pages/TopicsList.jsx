import React, { useEffect, useState } from "react";
import { BsChatText } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import { Link } from "react-router-dom";
import TopicsSkeleton from "../components/skeletons/TopicsSkeleton";

const orderParams = [
	{
		label: "Newest",
		value: "new",
	},
	{
		label: "Oldest",
		value: "old",
	},
	{
		label: "Most liked",
		value: "liked",
	},
	{
		label: "Most commented",
		value: "commented",
	},
];

export default function TopicsList() {
	const [topics, setTopics] = useState([
		{
			creationDate: "",
			id: "",
			title: "",
			message: "",
			cat: "",
			interval: "",
			countReplies: "",
		},
	]);

	const [filterParams, setFilterParams] = useState({
		/*
			category: "all",
		
		*/
	});

	const [rangeValue, setRangeValue] = useState(1400);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			console.log("-- Fetch - called --");

			const res = await fetch("/api/forum/topics/category");

			const data = await res.json();
			console.log("data :", data.object);
			console.log("-- Fetch - received --");

			if (!res.ok) {
				console.error("MANUAL ERROR: Invalid response");
				setLoading(false);
				return;
			}

			if (data) {
				setTopics(data.object);
				setLoading(false);
			} else {
				console.error("MANUAL ERRROR: Invalid data");
				setLoading(false);
			}
			setLoading(false);
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
	};

	const handleSortChange = (e) => {
		const sortedTopics = [...topics];

		switch (e.target.value) {
			case "new":
				sortedTopics.sort(
					(a, b) => new Date(b.creationDate) - new Date(a.creationDate)
				);
				break;

			case "old":
				sortedTopics.sort(
					(a, b) => new Date(a.creationDate) - new Date(b.creationDate)
				);
				break;

			case "liked":
				break;

			case "commented":
				sortedTopics.sort((a, b) => b.countReplies - a.countReplies);
				break;

			default:
				sortedTopics.reverse();
				break;
		}
		setTopics(sortedTopics);
	};

	return (
		<main id="wrapperMain" className="wrap-forum">
			<div className="filter-container">
				<form className="form-create">
					<div>
						<input type="search" placeholder="Search" />
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
						<input
							onChange={handleRange}
							type="range"
							min="1400"
							max="1900"
							step="100"
							name=""
							id=""
						/>

						<span>Range value : {rangeValue}</span>
					</div>
				</form>
			</div>

			<div className="topics-container">
				<div className="table-row table-header">
					<div>
						<select onChange={handleSortChange} name="sortTopics">
							{orderParams.map((param) => (
								<option value={param.value} key={param.value}>
									{param.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="table-body">
					{loading ? <TopicsSkeleton count={6} /> :
						topics.map((topic) => (
							<div className="table-row" key={topic.id}>
								<div className="table-topic-head">
									<p className="table-cat">[ {topic.cat} ]</p>
									<span>|</span>
									<p className="table-date">{topic.interval}</p>
									<span>|</span>
									<Link to={`/topic/edit/${topic.id}`}>
										<small>edit</small>
									</Link>
									<button>
										<small onClick={() => handleDelete(topic.id)}>delete</small>
									</button>
								</div>

								<Link to={`/forum/topic/${topic.id}`} className="table-title">
									{topic.title}
								</Link>
								<p className="table-message">{topic.message}</p>

								<div className="table-icons">
									<span className="table-icon-item">
										<FcLike size={"15px"} /> Like
									</span>
									<Link to={`/forum/topic/${topic.id}`}>
										<span className="table-icon-item">
											<BsChatText /> Comment {topic.countReplies}
										</span>
									</Link>
								</div>
							</div>
						))}
				</div>
			</div>
		</main>
	);
}
