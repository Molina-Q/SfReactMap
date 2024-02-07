import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, SVGOverlay, useMapEvent, useMapEvents, ImageOverlay, GeoJSON } from 'react-leaflet';
import myGeoJson from '../../../public/geojson/countries.json';

const LeafletMap = () => {
  // const [geoJSONData, setGeoJSONData] = useState(null);
  const position = [46.2276, 2.2137];
  const geoJsonFeatures = myGeoJson.features;

  const options = {
    BEL: { color: "yellow", fillOpacity: 1},
    FRA: {color: "blue", fillOpacity: 1},
    DEU: {color: "green", fillOpacity: 1}, // Germany
    RUS: {color: "grey", fillOpacity: 1},
    GBR: {color: "purple", fillOpacity: 1}, // UK
    ITA: {color: "red", fillOpacity: 1},
    ESP: {color: "orange", fillOpacity: 1},
  };

  /**
   * Function that loops on all of the countries in the json sent in params and return them as an array
   */
  function GeoJsonGeometry({jsonFeatures}) {
    const geoJSON = [];

    const map = useMap()
    const padd = { padding: [1 , 1] }

    for (let feature of jsonFeatures) {
      // console.log(options)
      console.log("feature.geometry.coordinates = ", feature.geometry.coordinates);
      let polygon;

      // if simple polygon
      if (feature.geometry.type == "Polygon") {
        polygon = [feature.geometry.coordinates[0].map((internalArrayItem) => internalArrayItem.toReversed())];
        
      // if multi-polygon
      // } else if(feature.geometry.type == "MultiPolygon") {
      } else {
        polygon = feature.geometry.coordinates.map((externalArrayItem) => [externalArrayItem[0].map((internalArrayItem) => internalArrayItem.toReversed())]);
      }
      
      const [bounds, setBounds] = useState(polygon);
      
      const handlers = useMemo(
        () => ({
          click() {
            setBounds(polygon)
            map.flyToBounds(polygon) //panInsideBounds
          },
        }),
        [map],
      );

      // push each country's geometry in the array, and use their names as key
      geoJSON.push(
        <GeoJSON 
          data={feature.geometry} 
          key={feature.properties.ADMIN}  // their names are used as key
          pathOptions={options[feature.properties.ISO_A3]} // change the style variable depending on the country
          eventHandlers={handlers}

          className={"qqch"}
        />
      );
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
    <MapContainer className='map' center={position} zoom={6} scrollWheelZoom={true} >

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