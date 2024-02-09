import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import myGeoJson1400 from '../../../../public/geojson/1400countries.json';
import myGeoJson1500 from '../../../../public/geojson/1500countries.json';
import myGeoJson1600 from '../../../../public/geojson/1600countries.json';
import myGeoJson1700 from '../../../../public/geojson/1700countries.json';
import myGeoJson1800 from '../../../../public/geojson/1800countries.json';
import myGeoJson1900 from '../../../../public/geojson/1900countries.json';

import Radio from './timeline/Timeline';
import Modal from './modal/ModalShowArticle';

const myGeoJsons = {
  "1400": myGeoJson1400,
  "1500": myGeoJson1500,
  "1600": myGeoJson1600,
  "1700": myGeoJson1700,
  "1800": myGeoJson1800,
  "1900": myGeoJson1900,
};

const LeafletMap = ({ checkedValue, handleClickOnCountry }) => {
  const position = [46.2276, 2.2137];

  // ce state sera géré par son parent SfReactMap
  // const [checkedValue, setCheckedValue] = useState('1900') ;

  // géré ici car utilisé dans son Enfant GeoJsonGeometry
  const [geoJsonFeatures, setGeoJsonFeatures] = useState(null)

  // sera géré dans le parent
  // const [data, setData] = useState(null);

  /**
   * all possible value for geoJSonFeatures
   * * will need to be upgraded in the future to be more readable and maintainable *
   */
  useEffect(() => {
    // switch (checkedValue) {
    //   case '1400':
    //     setGeoJsonFeatures(myGeoJson1400.features);
    //     break;

    //   case '1500':
    //     setGeoJsonFeatures(myGeoJson1500.features);
    //     break;

    //   case '1600':
    //     setGeoJsonFeatures(myGeoJson1600.features);
    //     break;

    //   case '1700':
    //     setGeoJsonFeatures(myGeoJson1700.features);
    //     break;

    //   case '1800':
    //     setGeoJsonFeatures(myGeoJson1800.features);
    //     break;

    //   case '1900':
    //     setGeoJsonFeatures(myGeoJson1900.features);
    //     break;
    
    //   default:
    //     setGeoJsonFeatures(myGeoJson1900.features);
    //     break;
    // }

    if (myGeoJsons[checkedValue]) {
      setGeoJsonFeatures(myGeoJsons[checkedValue].features);
    } else {
      setGeoJsonFeatures(myGeoJson1900.features);
    }

  }, [checkedValue]) // this make it so useEffect will take effect only when checkedValue is changed

  // Style variable for the country polygon
  const options = {
    BEL: {color: "yellow", fillOpacity: 0.1},
    FRA: {color: "blue", fillOpacity: 0.1},
    DEU: {color: "green", fillOpacity: 0.1}, // Germany
    RUS: {color: "grey", fillOpacity: 0.1},
    GBR: {color: "purple", fillOpacity: 0.1}, // UK
    ITA: {color: "red", fillOpacity: 0.1},
    ESP: {color: "orange", fillOpacity: 0.1},
  };


  // variable with state of dialog and open or setOpen
  // const [openModal, setOpenModal] = useState(false)

  /***** Callback Modal *****/
  /**************************/
  // const ModalIsClosed = () => {
  //   if (openModal) {
  //     setOpenModal(false)
  //   }
  // }
  
  /***** Callback Timeline *****/
  /*****************************/ 
  // const ReturnValue = string => {
  //   setCheckedValue(string);
  // }

  /**
   * Function that loops on all of the countries in the json sent in params and return them as an array
   * @param {JSON} jsonFeatures 
   */
  function GeoJsonGeometry({jsonFeatures}) {

    const geoJSON = [];

    const map = useMap()

    const padd = { padding: [1 , 1] }

    if (jsonFeatures) {

      // loop on feature to get info on each individual country
      for (let feature of jsonFeatures) {
        let polygon;

        // if simple polygon
        if (feature.geometry.type == "Polygon") {
          polygon = [feature.geometry.coordinates[0].map((internalArrayItem) => internalArrayItem.toReversed())];
          
        // if multi-polygon
        } else {
          polygon = feature.geometry.coordinates.map((externalArrayItem) => [externalArrayItem[0].map((internalArrayItem) => internalArrayItem.toReversed())]);
        }
        
        // eventHandlers for the map
        const handlers = useMemo(
          () => ({
            click() {
              map.panInsideBounds(polygon)
              // setOpenModal(true)
              handleClickOnCountry();
            },
          }),
          [map],
        );

        // push each country's geometry in the array, and use their names as key
        geoJSON.push(
          <GeoJSON 
            data={feature.geometry} 
            key={feature.properties.ADMIN} // their names are used as key
            pathOptions={options[feature.properties.ISO_A3]} // change the style variable depending on the country
            eventHandlers={handlers}
          />
        );
      }
    }
    
    return geoJSON;
  }

  // // fetch data from a controller then set it
  // // function not needed but i do not know how to do async without function rn
  // async function DataFetchingExample() {
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);

  //   useEffect(() => {
  //     fetch('/dataCountry')
  //       .then(response => response.json())
  //       .catch(error => console.log(error)
  //       )
  //       .then(data => {
  //         setData(data);
  //         setLoading(false);
  //       })
  //       .catch(error => {
  //         // setLoading(false);
  //         console.log(error)
  //       });
  //   }, []);

  //   if (loading) return <p>Loading...</p>;

  //   console.log('echo data sent = ',data)
  // }

  // DataFetchingExample()

  return (<>
    <MapContainer className='map' center={position} zoom={6} scrollWheelZoom={true} >
      {/* My map img */}
      <TileLayer
        url='https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        minZoom={3}
        maxZoom={8}
      />
      
      {/* Country polygon */}
      <GeoJsonGeometry jsonFeatures={geoJsonFeatures} />
 
    </MapContainer>

  </>);
};

export default LeafletMap;