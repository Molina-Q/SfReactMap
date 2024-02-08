import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, SVGOverlay, useMapEvent, useMapEvents, ImageOverlay, GeoJSON } from 'react-leaflet';
import myGeoJson from '../../../../public/geojson/1900countries.json';
import Modal from './modal/ModalShowArticle';
import Radio from './timeline/Timeline';

const LeafletMap = () => {
  const position = [46.2276, 2.2137];
  const geoJsonFeatures = myGeoJson.features;

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

  const ModalIsClosed = () => {
    if (openModal) {
      setOpenModal(false)
    }
  }

  /**
   * Function that loops on all of the countries in the json sent in params and return them as an array
   */
  function GeoJsonGeometry({jsonFeatures}) {
    const geoJSON = [];

    const map = useMap()
    const padd = { padding: [1 , 1] }

    for (let feature of jsonFeatures) {
      // console.log(options)
      // console.log("feature.geometry.coordinates = ", feature.geometry.coordinates);
      let polygon;

      // if simple polygon
      if (feature.geometry.type == "Polygon") {
        polygon = [feature.geometry.coordinates[0].map((internalArrayItem) => internalArrayItem.toReversed())];
        
      // if multi-polygon
      // } else if(feature.geometry.type == "MultiPolygon") {
      } else {
        polygon = feature.geometry.coordinates.map((externalArrayItem) => [externalArrayItem[0].map((internalArrayItem) => internalArrayItem.toReversed())]);
      }
      
      // const [bounds, setBounds] = useState(polygon);
      
      const handlers = useMemo(
        () => ({
          click() {
            // setBounds(polygon)
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
          key={feature.properties.ADMIN}  // their names are used as key
          pathOptions={options[feature.properties.ISO_A3]} // change the style variable depending on the country
          eventHandlers={handlers}
        />
      );
    }

    return geoJSON;
  }

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
      children={'Bonjour à tous'}
    />

    <div id="timeline">
      <Radio defaultYear={'1400'} />
    </div>

  </>);
};

export default LeafletMap;