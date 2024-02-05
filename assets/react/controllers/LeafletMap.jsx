import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';


// const map = L.map('map').setView([46.2, 2.21], 6);
// var geojsonFeature = L.geoJSON(myGeoJSON);

const LeafletMap = () => {
  const position = [46.2276, 2.2137];

  const mapRef = useRef();
  const geoJSON = useRef();

  // const ChangeMapView = () => {
  //   const map = useMap();
  //   map.setView(position, 15);
  //   return null;
  // }

  const [geoJSONData, setGeoJSONData] = useState(null);


  // await for the data to be received
  const fetchData = async () => {
    try {
      let response = await fetch('/get-geojson'); // call the geojsonpath in controller
      let data = await response.json(); // once it receives it the data are stocked in the data var
      return data.path; // set the data from useState hook

    } catch (error) { // if something goes wrong
      console.error(`Error fetching GeoJson: ${error}`)
    }
  };


  useEffect(() => {
    fetch(fetchData())  // put the path to the geojson file
      .then(response => response.json())
      .then(data => setGeoJSONData(data));
  }, []);

  return (
    <MapContainer className='map' center={position} zoom={5} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* <ChangeMapView /> */}
      {/* {geoJSONData && <GeoJSON data={geoJSONData} ref={geoJSON} />} */}
      {/* <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
    </MapContainer>
  );
};
export default LeafletMap;