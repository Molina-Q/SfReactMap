import React, { useEffect, useState } from "react";
import { fetchAnything } from "../utils/Fetchs";
import Gallery from "../components/gallery/Gallery";
import Loading from "../components/UI/animation/Loading";
import DetailsItem from "../components/equipment/DetailsItem";
import { getUrlParam, setUrlParam } from "../utils/UrlParam";
import { Link, useNavigate } from "react-router-dom";
import SingleEquipSkeleton from "../components/skeletons/SingleEquipSkeleton";
import { Helmet } from "react-helmet-async";

export default function Equipment() {
	const navigate = useNavigate();
	// states for the gallery data
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	// current active category type
	const [currentCategory, setCurrentCategory] = useState(1);

	// states for the details page data
	const [clickedItemData, setClickedItemData] = useState({});
	const [clickedItemId, setClickedItemId] = useState(null);
	const [loadingDetails, setLoadingDetails] = useState(false);

	// categories data
	const categories = [
		{
			label: "Weapon",
			id: 1,
		},
		{
			label: "Armour",
			id: 2,
		},
		{
			label: "Tool",
			id: 3,
		},
	];

	// data of the possible paramters in the url
	const [urlData, setUrlData] = useState({
		type: "",
		item: "",
	});

	// get the url parameters and set the current category
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const type = urlParams.get("type");
		const item = urlParams.get("item");

		setCurrentCategory(type ?? 1);

		setUrlData({
			type: type ?? 1,
			item: item ?? 1,
		});
		
	}, []);

	// onClick function for the images of the gallery
	const handleClickImage = (id) => {
		if (clickedItemId === id) return;

		const urlParams = new URLSearchParams(location.search);

		urlParams.set("item", id);

		const searchParams = urlParams.toString();

		navigate(`/equipment?${searchParams}`);

		setClickedItemId(id);

		setLoadingDetails(true);

		setUrlData({ ...urlData, item: id });
	};

	// onClick function for the categories
	const handleClickCategory = (e) => {
		// if the category is already active, do nothing
		if (e.target.getAttribute("data-id") == currentCategory) return;

		if (
			e.target.getAttribute("data-id") == 1 ||
			e.target.getAttribute("data-id") == 2 ||
			e.target.getAttribute("data-id") == 3
		) {
			const urlParams = new URLSearchParams(location.search);

			urlParams.set("type", e.target.getAttribute("data-id"));

			const searchParams = urlParams.toString();

			setUrlData({ ...urlData, type: e.target.getAttribute("data-id") });

			setCurrentCategory(e.target.getAttribute("data-id"));

			setLoading(true);

			navigate(`/equipment?${searchParams}`);
		}
	};

	async function fetchData(URI, dataState, loadingState) {
		console.log("-- Fetch - called --");
		const dataFetch = await fetchAnything(URI);
		console.log("-- Fetch - received --");

		if (dataFetch) {
			// set the content of given state data
			loadingState ? loadingState(false) : "";
			dataState(dataFetch);
		} else {
			// there was a mistake and the data is null
			console.error("MANUAL ERRROR: Invalid data");
		}
	}

	// call fetchData when the url changes
	useEffect(() => {
		// fetchData(`/api/equipment/type/${urlData.type}`, setData, setLoading);

		if (
			(urlData.item && !clickedItemData.equipment) ||
			(clickedItemData.equipment &&
				urlData.item != clickedItemData.equipment.id)
		) {
			setLoadingDetails(true);
			setCurrentCategory(urlData.type);

			fetchData(
				`/api/equipment/${urlData.item}`,
				setClickedItemData,
				setLoadingDetails
			);
		}
	}, [location.search]); // will re-run only when one of those variables changes (using Object.js comparison)

	// called when data.type from the url is updated then set
	useEffect(() => {
		fetchData(
			`/api/equipments/type/${currentCategory}`, 
			setData, 
			setLoading
		);
	}, [currentCategory]);

	if (data) {
		console.log("data type = ", data["equipments"].length);
	}

	return (
		<main id="wrapperMain" className="wrap-equip">
			<Helmet>
				<title>Equipment</title>
				<meta name="description" content="Equipment page" />
			</Helmet>
			
			{/* <Link to="/equipment/create">
				<button>
					<svg
						className="icon icon-plus"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
					>
						<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
					</svg>
				</button>
			</Link>
			<Link to="/equipment/edit/6">
				<button>
					<svg
						className="icon icon-plus"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
					>
						<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
					</svg>
				</button>
			</Link> */}

			<section id="equip-menu-container">
				<div className="categories">
					{categories.map((catType) => (
						<p
							key={catType.id}
							data-id={catType.id}
							onClick={handleClickCategory}
							className={`cat-${catType.label.toLowerCase()} ${
								currentCategory == catType.id ? "active" : "inactive"
							}`}
						>
							{catType.label}
						</p>
					))}
				</div>

				<article className="equip-menu">
					<article className="equip-gallery">
						{loading ? (
							<Loading />
						) : data["equipments"].length === 0 ? (
							<h2>There is no items here yet sorry for the inconvenience !</h2>
						) : (
							<Gallery
								items={data["equipments"]}
								className={"equip-items"}
								clickEvent={handleClickImage}
							/>
						)}
					</article>

					<aside className="equip-description">
						{loadingDetails ? ( // if loading is true
							<SingleEquipSkeleton />
						) : clickedItemData.equipment ? ( // if loading is not true and clickedData exists 
							<DetailsItem
								name={clickedItemData.equipment.name}
								img={clickedItemData.equipment.img}
								text={clickedItemData.equipment.text}
								id={clickedItemData.equipment.id}
								sub_cat={clickedItemData.equipment.sub_cat}
							/>
							
						) : ( // if loading is not true and clickedData does not exist
							// when details item is not given any props it will show a message
							<DetailsItem />
						)}
					</aside>
				</article>
			</section>
		</main>
	);
}
