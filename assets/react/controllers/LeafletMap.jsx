import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, SVGOverlay, useMapEvent, ImageOverlay, GeoJSON } from 'react-leaflet';
import L from 'leaflet'
import myGeoJson from '../../../public/geojson/countries.json';

const LeafletMap = () => {
  const position = [46.2276, 2.2137];
  // const [geoJSONData, setGeoJSONData] = useState(null);
console.log(`options${myGeoJson.features[0].properties.ISO_A3}`)
  const geoJsonFeatures = myGeoJson.features;

  /**
   * Function that loops on all of the countries in the json sent in params and return them as an array
   */
  function GeoJsonGeometry({jsonFeatures}) {
    const geoJSON = [];

    for (let feature of jsonFeatures) {
      // push each country's geometry in the array, and use their names as key
      geoJSON.push(<GeoJSON data={feature.geometry} key={feature.properties.ADMIN} pathOptions={feature.properties.ISO_A3}/>);
    }

    return geoJSON;
  }

  const options = { color: 'red', opacity: 0}
  const BEL = { color: 'yellow', opacity: 0}
  const FRA = { color: 'blue', opacity: 0}
  const GER = { color: 'green', opacity: 0}

  // const mapRef = useRef();
  // const geoJSONRef = useRef();

  // function MyComponent() {
  //   const map = useMapEvent('click', () => {
  //     map.setView([46.2276, 2.2137], map.getZoom())
  //   })
  //   return null
  // }

  // useEffect(() => {
  //   const fetchGeoJSON = async () => {
  //       try {
  //         const response = await fetch('/geojson');
      
  //         const data = await response.json();
  //         setGeoJSONData(data);
  //       } catch (error) {
  //         console.log(`Error fetching GeoJSON: ${error}`);
  //       }
  //   };

  //   fetchGeoJSON();
  // }, []);

  // const polygon = 
  //   myGeoJson.features[6].geometry.coordinates
  // ;

  // const [geoJSONPath, setGeoJSONPath] = useState(null);

  // const [geoJSONData, setGeoJSONData] = useState(null);

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
    <MapContainer className='map' center={position} zoom={7} scrollWheelZoom={true} >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      

      <GeoJsonGeometry jsonFeatures={geoJsonFeatures} />
      {/* <GeoJSON data={myGeoJson.features[0].geometry} /> */}

      {/* {geoJSONData && <GeoJSON data={geoJSONData} ref={geoJSONRef} />} */}

      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    
      {/* <MyComponent /> */}

      {/* <Polygon positions={polygon} /> */}

    </MapContainer>
  );
};


// render(<LeafletMap />)
export default LeafletMap;