import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, SVGOverlay, useMapEvent, useMapEvents, ImageOverlay, GeoJSON } from 'react-leaflet';
import myGeoJson from '../../../public/geojson/countries.json';

const LeafletMap = () => {
  // const [geoJSONData, setGeoJSONData] = useState(null);
  const position = [46.2276, 2.2137];
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

    const map = useMap()

    for (let feature of jsonFeatures) {

      // console.log(options)
      console.log(feature.geometry.coordinates)
      const polygon = feature.geometry.coordinates;

      // coord.push(feature.geometry.coordinates);
      polygon.map((item) => { item.reverse(); }); 
      
      const [bounds, setBounds] = useState(polygon)
      
      const handlers = useMemo(
        () => ({
          click() {
            setBounds(polygon)
            map.fitBounds(polygon)
          },
        }),
        [map],
      )

      // push each country's geometry in the array, and use their names as key
      geoJSON.push(
        <GeoJSON 
          data={feature.geometry} 
          key={feature.properties.ADMIN} 
          pathOptions={options[count]} 
          eventHandlers={handlers}
        />
      );
      
      // fonctionnement voulu serait :
      // geoJSON.push(<GeoJSON data={feature.geometry} key={feature.properties.ADMIN} pathOptions={options[feature.properties.ISO_A3]}/>);
      // main ne fonctionne pas, pareil pour `options${feature.properties.ISO_A3}`


      count++;
    }

    return geoJSON;
  }

  

  // function LocationMarker() {
  //   const [position, setPosition] = useState(null)
  //   const map = useMapEvents({
  //     click() {
  //       map.locate()
  //     },
  //     locationfound(e) {
  //       setPosition(e.latlng)
  //       map.flyTo(e.latlng, map.getZoom())
  //     },
  //   })
  
  //   return position === null ? null : (
  //     <Marker position={position}>
  //       <Popup>You are here</Popup>
  //     </Marker>
  //   )
  // }


  // function SetBoundsRectangles() {
  //   const [bounds, setBounds] = useState(outerBounds)
  //   const map = useMap()
  
  //   const innerHandlers = useMemo(
  //     () => ({
  //       click() {
  //         setBounds(innerBounds)
  //         map.fitBounds(innerBounds)
  //       },
  //     }),
  //     [map],
  //   )
  //   const outerHandlers = useMemo(
  //     () => ({
  //       click() {
  //         setBounds(outerBounds)
  //         map.fitBounds(outerBounds)
  //       },
  //     }),
  //     [map],
  //   )
  // }

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