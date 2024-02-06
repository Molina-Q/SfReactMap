import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, SVGOverlay, useMapEvent, ImageOverlay, GeoJSON } from 'react-leaflet';
import L from 'leaflet'


// const map = L.map('map').setView([46.2, 2.21], 6);
// var geojsonFeature = L.geoJSON(myGeoJSON);

const LeafletMap = () => {
  const position = [46.2276, 2.2137];

  // const mapRef = useRef();
  // const geoJSONRef = useRef();

  // function MyComponent() {
  //   const map = useMapEvent('click', () => {
  //     map.setView([46.2276, 2.2137], map.getZoom())
  //   })
  //   return null
  // }

  const polygon = [
    [46.2276, 3],
    [47.2276, 4],
    [45.2276, 3],
  ];


  // const [geoJSONPath, setGeoJSONPath] = useState(null);

  // const [geoJSONData, setGeoJSONData] = useState(null);

  const purpleOptions = { color: 'purple' }

  // await for the data to be received
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch('/get-geojson'); // call the geojsonpath in controller
        const data = await response.json(); // once it receives it the data are stocked in the data var
        setGeoJSONPath(data.path); // set the data from useState hook

      } catch (error) { // if something goes wrong
        console.error(`Error fetching GeoJson: ${error}`)
      }
    };

    fetchData()

  }, []);


  // useEffect(() => {
  //   fetch(geoJSONPath)  // put the path to the geojson file
  //     .then(response => response.json())
  //     .then(data => setGeoJSONData(data))
  // }, []);

  // useEffect(() => {
  //   const map = mapRef.current;
  //   // You can perform additional actions on the map, if needed
  //   // For example, fitBounds to the GeoJSON data extent
  //   if (map && geoJSONRef.current) {
  //     const bounds = geoJSONRef.current.getBounds();
  //     map.fitBounds(bounds);
  //   }
  // }, [geoJSONData]);

  return (
    <MapContainer className='map' center={position} zoom={6} scrollWheelZoom={true} >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* <ChangeMapView /> */}
      {/* {geoJSONData && <GeoJSON data={geoJSONData} ref={geoJSONRef} />} */}

      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

    
      {/* <MyComponent /> */}

      <Polygon positions={polygon} />

      {/* <ImageOverlay
        url="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
        bounds={bounds}
        opacity={0.5}
        zIndex={10}
      /> */}
    </MapContainer>
  );
};


// render(<LeafletMap />)
export default LeafletMap;