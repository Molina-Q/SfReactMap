import React, { useEffect, useState } from "react";
import { fetchAnything } from "../../../../tools/Fetchs";
import Gallery from "../gallery/Gallery";
import Loading from "../UI/animation/Loading";
import DetailsItem from "./DetailsItem";
import { setUrlParam, getUrlParam } from "../../../../tools/UrlParam";

export default function Equipment() {
	// states for the gallery data
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	// category data
	const [categories, setCategories] = useState({});

	// current active category type
	const [currentCategory, setCurrentCategory] = useState(null);

	// states for the details page data
	const [clickedItemData, setClickedItemData] = useState({});
	const [loadingDetails, setLoadingDetails] = useState(false);


	const [urlData, setUrlData] = useState({
		type: getUrlParam("type") || 1,
		item: getUrlParam("item") || "",
	});

	// onClick function for the images of the gallery
	const handleClickImage = (id) => {
		setLoadingDetails(true);
		setUrlParam("item", id);
		setUrlData({ ...urlData, item: id });
	};

	// onClick function for the categories
	const handleClickCategory = (e) => {
		if (
			e.target.getAttribute("data-id") == 1 ||
			e.target.getAttribute("data-id") == 2 ||
			e.target.getAttribute("data-id") == 3
		) {
			setUrlParam("type", e.target.getAttribute("data-id"));

			setUrlData({ ...urlData, type: e.target.getAttribute("data-id") });

			setCurrentCategory(e.target.getAttribute("data-id"));

			setLoading(true);
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

	// call fetchData when page is loading then when category type is updated
	useEffect(() => {
		fetchData(`/api/equipment/type/${urlData.type}`, setData, setLoading);
		if (
			(urlData.item && !clickedItemData.equipment) ||
			(clickedItemData.equipment &&
				urlData.item != clickedItemData.equipment.id)
		) {
			setLoadingDetails(true);
			fetchData(
				`/api/equipment/${urlData.item}`,
				setClickedItemData,
				setLoadingDetails
			);
		}
	}, [urlData]); // will re-run only when one of those variables changes (using Object.js comparison)

	useEffect(() => {
		fetchData(`/api/equipment/types`, setCategories);
	}, []); // will re-run only when one of those variables changes (using Object.js comparison)

	if (data) {
		console.log("data type = ", data["equipments"].length);
	}

	return (
		<>
			{categories.categories &&
				categories.categories.map((catType) => (
					<strong
						key={catType.id}
						data-id={catType.id}
						onClick={handleClickCategory}
						className={"cat-" + catType.label.toLowerCase()}
					>
						{catType.label}
					</strong>
				))}

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
					{loadingDetails ? (
						<Loading />
					) : clickedItemData.equipment ? (
						<DetailsItem
							name={clickedItemData.equipment.name}
							img={clickedItemData.equipment.img}
							text={clickedItemData.equipment.text}
							id={clickedItemData.equipment.id}
						/>
					) : (
						<DetailsItem />
					)}
				</aside>
			</article>
		</>
	);
}