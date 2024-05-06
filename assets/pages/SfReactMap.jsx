import React, { useEffect, useState } from "react";

import LeafletMap from "../components/LeafletMap";
import Timeline from "../components/timeline/Timeline";
import Modal from "../components/modal/Modal";
import ShowArticle from "../components/modal/ShowArticle";
import Loading from "../components/UI/animation/Loading";

import { fetchAnything } from "../utils/Fetchs";
import { getUrlParam, setUrlParam } from "../utils/UrlParam";
import ShowSection from "../components/modal/ShowSection";
import LinkBtn from "../components/UI/button/LinkBtn";

const SfReactMap = () => {
	// ce composant devient le composant principal, qui va se comporter comme un Controller
	// c'est sa responsabilité de gérer les states, de synchroniser le tout avec ses enfants qui peuvent avoir des interactions indirectes
	// un enfant peut faire remonter un changement
	// le parent (ce composant) sera notifié et changera le state (qu'il gère lui), puis si besoin fera redescendre l'info à l'enfant à notifier

	// data fetched with the fetchData() function
	const [fetchedData, setFetchedData] = useState(null);

	// variable with state of dialog and open or setOpen
	const [openModal, setOpenModal] = useState(
		getUrlParam("box") === "false" ? false : true
	);

	// current checked year in the timeline
	const [checkedYear, setCheckedYear] = useState("1900");

	// the country that was clicked on
	const [clickedCountry, setClickedCountry] = useState("France");

	// array of elements the modal will show
	const [contentModal, setContentModal] = useState(null);

	// used for loading during the fetch of the modal
	const [loading, setLoading] = useState(false);

	// data in the url
	const [urlData, setUrlData] = useState({
		year: getUrlParam("year") || "1900",
		country: getUrlParam("country") || "France",
		box: getUrlParam("box") ?? false,
	});

	// URI of the content of the modal
	const [dataURI, setDataURI] = useState(
		`/dataCountry/${clickedCountry}/${checkedYear}`
	);

	/***** Callback to ModalShowArticle *****/
	/****************************************/
	const modalIsClosed = () => {
		// Check if the modal is open then close it
		openModal ? setOpenModal(false) : "";
		setUrlParam("box", false);

		setUrlData({
			...urlData,
			box: false,
		});
	};

	// onClick backArrow
	const backArrowHandler = () => {
		// change the URI of the fetch to return to the original data
		setDataURI(`/dataCountry/${clickedCountry}/${checkedYear}`);
	};

	const getDetailsSection = (id) => {
		// change the URI of the fetch to return to the original data
		setDataURI(`/dataCountry/section/${id}`);
	};

	/***** Callback to Timeline *****/
	/********************************/
	const returnValue = (stringYear) => {
		// change it to the currently checked year
		setCheckedYear(stringYear);

		// change url
		setUrlParam("year", stringYear);
		setUrlData({
			...urlData,
			year: stringYear,
		});
		// change the URI to match the checked year
		setDataURI(`/dataCountry/${clickedCountry}/${stringYear}`);
	};

	/***** Callback to LeafletMap *****/
	/**********************************/
	const handleClickOnCountry = (countryName) => {
		// change it to the clicked country
		setClickedCountry(countryName);

		// change the URI to match the clicked country
		setDataURI(`/dataCountry/${countryName}/${checkedYear}`);
		setUrlData({
			...urlData,
			country: countryName,
		});
		// change url
		setUrlParam("country", countryName);
		setUrlParam("box", true);

		setUrlData({
			...urlData,
			box: true,
		});

		// open the modal
		setOpenModal(true);
	};

	useEffect(() => {
		// async function that fetch articles data for the country during the selected century from the MapController
		// await for data at the given URI (Uniform Resource Identifier)
		async function fetchData(URI) {
			setLoading(true);

			console.log("-- Fetch - called --");

			// const data = await fetchAnything(`/dataCountry/${clickedCountry}/${checkedYear}`);
			const data = await fetchAnything(URI);

			console.log("-- Fetch - received --");

			// if the given data were valid
			if (data) {
				// set the content of data
				setFetchedData(data);
			} else {
				// there was a mistake and the data is null

				setFetchedData(null);
				setLoading(false); // loading is set to false to avoid infinite loading
				console.error("MANUAL ERRROR: Invalid data");

				return setContentModal(
					<div>
						<h2 className="article-none">
							Sorry this country doesn't have an Article for this period.
						</h2>

						<LinkBtn
							URI={`map/create/article/${clickedCountry}/${checkedYear}`}
						>
							Create an article
						</LinkBtn>
					</div>
				);
			}
		}

		// immediatly calls himself
		fetchData(dataURI);
	}, [dataURI]); // will re-run only when one of those variables changes (using Object.js comparison)

	// set the component shown by the modal
	useEffect(() => {
		// function dataFunc() {
		if (!fetchedData) {
			return;
		}

		if (typeof fetchedData.section == "undefined") {
			return setContentModal(
				<ShowArticle
					article={fetchedData.article}
					showDetails={getDetailsSection}
				/>
			);
		} else {
			return setContentModal(<ShowSection section={fetchedData.section} />);
		}
	}, [fetchedData]); // re-run everytime data is fetched

	// everytime the content modal state is changed the loading is set to false and the loading component is removed
	useEffect(() => setLoading(false), [contentModal]);

	return (
		<>
			<LeafletMap
				checkedValue={checkedYear}
				handleClickOnCountry={handleClickOnCountry}
			/>

			<Modal
				isOpen={openModal}
				onClose={modalIsClosed}
				handleReturn={backArrowHandler}
				// children={loading ? <Loading /> : contentModal}
			>
				{loading ? <Loading /> : contentModal}
			</Modal>

			<div id="timeline">
				<Timeline defaultYear={checkedYear} returnChecked={returnValue} />
			</div>
		</>
	);
};

export default SfReactMap;
