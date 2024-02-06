import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, SVGOverlay, useMapEvent, ImageOverlay, GeoJSON } from 'react-leaflet';
import myGeoJson from '../../../public/geojson/countries.json';

const LeafletMap = () => {
  const position = [46.2276, 2.2137];
  // const [geoJSONData, setGeoJSONData] = useState(null);
  const geoJsonFeatures = myGeoJson.features;

  const options = [
    {color: 'yellow',fillOpacity: 1}, 
    {color: 'red',fillOpacity: 1}, 
    {color: 'orange',fillOpacity: 1}, 
    {color: 'green',fillOpacity: 1}, 
    {color: 'purple',fillOpacity: 1},
    {color: 'blue',fillOpacity: 1},
    {color: 'lime',fillOpacity: 1},
  ]
  const optionss =  { color: 'red', fillOpacity: 1}
  const optionsBEL = { color: 'yellow', fillOpacity: 0}
  // const FRA = { color: 'blue', opacity: 0}

  /**
   * Function that loops on all of the countries in the json sent in params and return them as an array
   */
  function GeoJsonGeometry({jsonFeatures}) {
    const geoJSON = [];
    let count = 0; 
    for (let feature of jsonFeatures) {
      console.log(options)

      // push each country's geometry in the array, and use their names as key
      geoJSON.push(<GeoJSON data={feature.geometry} key={feature.properties.ADMIN} pathOptions={options[count]}/>);
      
      // fonctionnement voulu serait :
      // geoJSON.push(<GeoJSON data={feature.geometry} key={feature.properties.ADMIN} pathOptions={options[feature.properties.ISO_A3]}/>);
      // main ne fonctionne pas, pareil pour `options${feature.properties.ISO_A3}`
      
      count++;
    }

    return geoJSON;
  }


  return (
    <MapContainer className='map' center={position} zoom={7} scrollWheelZoom={true} >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <GeoJsonGeometry jsonFeatures={geoJsonFeatures} />

      {/* <GeoJSON data={myGeoJson.features[0].geometry} /> */}
      {/* {geoJSONData && <GeoJSON data={geoJSONData} ref={geoJSONRef} />} */}
    
    </MapContainer>
  );
};


// render(<LeafletMap />)
export default LeafletMap;