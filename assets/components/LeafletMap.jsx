import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import myGeoJson1400 from "../geojson/1400countries.json";
import myGeoJson1500 from "../geojson/1500countries.json";
import myGeoJson1600 from "../geojson/1600countries.json";
import myGeoJson1700 from "../geojson/1700countries.json";
import myGeoJson1800 from "../geojson/1800countries.json";
import myGeoJson1900 from "../geojson/1900countries.json";

// all possible value for geoJSonFeatures
const myGeoJsons = {
	1400: myGeoJson1400,
	1500: myGeoJson1500,
	1600: myGeoJson1600,
	1700: myGeoJson1700,
	1800: myGeoJson1800,
	1900: myGeoJson1900,
};

const LeafletMap = ({ checkedValue, handleClickOnCountry, children }) => {
	const position = [46.2276, 3.2137];

	const [countriesWithArticles, setCountriesWithArticles] = useState([]);

	useEffect(() => {
		myGeoJsons[checkedValue]
			? setGeoJsonFeatures(myGeoJsons[checkedValue].features)
			: setGeoJsonFeatures(myGeoJson1900.features);

		// Fetch all countries that have articles
		const fetchCountriesWithArticles = async () => {
			const response = await fetch(`/api/articles/countries/${checkedValue}`);
			const data = await response.json();

			if (data.error === false) {
				setCountriesWithArticles(data.object);
				return;
			}
		};

		fetchCountriesWithArticles();
	}, [checkedValue]);

	// ce state sera géré par son parent SfReactMap
	// const [checkedValue, setCheckedValue] = useState('1900') ;

	// géré ici car utilisé dans son Enfant GeoJsonGeometry
	const [geoJsonFeatures, setGeoJsonFeatures] = useState(null);

	// sera géré dans le parent
	// const [data, setData] = useState(null);

	useEffect(() => {
		const optionsCopy = { ...options };
		for (let countryCode in optionsCopy) {
			console.log(countriesWithArticles);
			if (!countriesWithArticles.includes(countryCode)) {
				optionsCopy[countryCode].isGray = true;
			} else {
				optionsCopy[countryCode].isGray = false;
			}
		}
		setOptions(optionsCopy, countriesWithArticles);
	}, [countriesWithArticles]); // this make it so useEffect will take effect only when checkedValue is changed

	// Style variable for the country polygon
	const [options, setOptions] = useState({
		BEL: { color: "yellow", fillOpacity: 0.1, isGray: false },
		FRA: { color: "blue", fillOpacity: 0.1, isGray: false },
		DEU: { color: "green", fillOpacity: 0.1, isGray: false }, // Germany
		RUS: { color: "green", fillOpacity: 0.1, isGray: false },
		GBR: { color: "purple", fillOpacity: 0.1, isGray: false }, // UK
		ITA: { color: "red", fillOpacity: 0.1, isGray: false },
		ESP: { color: "orange", fillOpacity: 0.1, isGray: false },
	});

	/**
	 * Function that loops on all of the countries in the json sent in params and return them as an array
	 * @param {JSON} jsonFeatures
	 */
	function GeoJsonGeometry({ jsonFeatures }) {
		const geoJSON = [];

		const map = useMap();

		if (jsonFeatures) {
			// loop on feature to get info on each individual country
			for (let feature of jsonFeatures) {
				let polygon;

				// if simple polygon
				if (feature.geometry.type == "Polygon") {
					// get the coordinates of the country in the correct order (latitude, longitude)
					polygon = [
						feature.geometry.coordinates[0].map((internalArrayItem) =>
							internalArrayItem.toReversed()
						),
					];

					// if multi-polygon, so has one more layer in the json file
				} else {
					polygon = feature.geometry.coordinates.map((externalArrayItem) => [
						externalArrayItem[0].map((internalArrayItem) =>
							internalArrayItem.toReversed()
						),
					]);
				}

				// eventHandlers for the map
				const handlers = useMemo(
					() => ({
						click() {
							handleClickOnCountry(feature.properties.ADMIN);
							map.panInsideBounds(polygon);
						},
					}),
					[map]
				);

				// push each country's geometry in the array, and use their names as key
				geoJSON.push(
					<GeoJSON
						data={feature.geometry}
						key={feature.properties.ADMIN} // their names are used as key
						pathOptions={
							options[feature.properties.ISO_A3].isGray
								? { color: "gray", fillOpacity: 0.1 }
								: options[feature.properties.ISO_A3]
						} // Use gray if no options for this country
						eventHandlers={handlers}
						smoothFactor={4}
					/>
				);
			}
		}

		return geoJSON;
	}

	return (
		<div id="leafletMap">
			<MapContainer
				className="map"
				center={position}
				zoom={6}
				scrollWheelZoom={true}
				zoomControl={false}
			>
				{/* My map img */}
				<TileLayer
					url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
					minZoom={3}
					maxZoom={8}
				/>

				{/* Country polygon */}
				<GeoJsonGeometry jsonFeatures={geoJsonFeatures} />
			</MapContainer>

			{children}
		</div>
	);
};

export default LeafletMap;
