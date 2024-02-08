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

const LeafletMap = () => {
  const position = [46.2276, 2.2137]; 
  
  const [checkedValue, setCheckedValue] = useState('1900') ;

  const [geoJsonFeatures, setGeoJsonFeatures] = useState(null)

  const [data, setData] = useState(null);

  
  /**
   * all possible value for geoJSonFeatures
   * *will need to be upgraded in the future to be more readable and maintainable*
   */
  useEffect(() => {
    switch (checkedValue) {
      case '1400':
        setGeoJsonFeatures(myGeoJson1400.features);
        break;

      case '1500':
        setGeoJsonFeatures(myGeoJson1500.features);
        break;

      case '1600':
        setGeoJsonFeatures(myGeoJson1600.features);
        break;

      case '1700':
        setGeoJsonFeatures(myGeoJson1700.features);
        break;

      case '1800':
        setGeoJsonFeatures(myGeoJson1800.features);
        break;

      case '1900':
        setGeoJsonFeatures(myGeoJson1900.features);
        break;
    
      default:
        setGeoJsonFeatures(myGeoJson1900.features);
        break;
    }
  }, [checkedValue]) // this make it so useEffect will take effect only when checkedValue is changed

  // console.log(geoJsonFeatures);

  // Style variable for the country polygon
  const options = {
    BEL: { color: "yellow", fillOpacity: 1},
    FRA: {color: "blue", fillOpacity: 1},
    DEU: {color: "green", fillOpacity: 1}, // Germany
    RUS: {color: "grey", fillOpacity: 1},
    GBR: {color: "purple", fillOpacity: 1}, // UK
    ITA: {color: "red", fillOpacity: 1},
    ESP: {color: "orange", fillOpacity: 1},
  };

  // variable with state of dialog and open or setOpen
  const [openModal, setOpenModal] = useState(false)

  // callback to child component Modal
  const ModalIsClosed = () => {
    if (openModal) {
      setOpenModal(false)
    }
  }
  
  // callback to child component Timeline
  const ReturnValue = string => {
    setCheckedValue(string);
  }

  /**
   * Function that loops on all of the countries in the json sent in params and return them as an array
   * @param {JSON} jsonFeatures 
   */
  function GeoJsonGeometry({jsonFeatures}) {

    const geoJSON = [];

    const map = useMap()

    // const padd = { padding: [1 , 1] }

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
            setOpenModal(true)
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
    return geoJSON;
  }

  // fetch data from a controller then set it
  // function not needed but i do not know how to do async without function rn
  async function DataFetchingExample() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetch('/dataCountry')
        .then(response => response.json())
        .catch(error => console.log(error))
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(error => {
          // setError(error);
          // setLoading(false);
          console.log(error)
        });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    console.log('echo data sent = ',data)
  }

  DataFetchingExample()

  return (<>
    <MapContainer className='map' center={position} zoom={6} scrollWheelZoom={true} >
      {/* My map img */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Country polygon */}
      <GeoJsonGeometry jsonFeatures={geoJsonFeatures} />
 
    </MapContainer>   

    <Modal 
      isOpen={openModal}
      hasCloseBtn={true}
      onClose={ModalIsClosed}
      children={data == null ? '' : data}
    />

    <div id="timeline">
      <Radio 
        defaultYear={checkedValue}
        returnChecked={ReturnValue}
      />
    </div>

  </>);
};

export default LeafletMap;