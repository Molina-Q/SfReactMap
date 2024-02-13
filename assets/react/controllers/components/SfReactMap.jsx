import React, { useRef, useEffect, useState, useMemo } from 'react';

import LeafletMap from './LeafletMap';
import Timeline from './timeline/Timeline';
import ModalShowArticle from './modal/ModalShowArticle';

import { fetchAnything } from "../../../tools/Fetchs";

const SfReactMap = () => {

  // ce composant devient le composant principal, qui va se comporter comme un Controller
  // c'est sa responsabilité de gérer les states, de synchroniser le tout avec ses enfants qui peuvent avoir des interactions indirectes
  // un enfant peut faire remonter un changement
  // le parent (ce composant) sera notifié et changera le state (qu'il gère lui), puis si besoin fera redescendre l'info à l'enfant à notifier

  // data fetched with the fetchData() function
  const [fetchedData, setFetchedData] = useState(null);

  // variable with state of dialog and open or setOpen
  const [openModal, setOpenModal] = useState(false);

  // current checked year in the timeline
  const [checkedYear, setCheckedYear] = useState('1900');

  // the country that was clicked on
  const [clickedCountry, setClickedCountry] = useState('France');

  /***** Callback to ModalShowArticle *****/
  /****************************************/
  const modalIsClosed = () => {
    if (openModal) {
      setOpenModal(false);
    }
  }
  
  /***** Callback to Timeline *****/
  /********************************/ 
  const returnValue = string => {
    setCheckedYear(string);
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // async function that fetch data from the MapController
  useEffect(() => {
    async function fetchData() {
      // await for data at the given URI (Uniform Resource Identifier)
      const data = await fetchAnything(`/dataCountry/${clickedCountry}/${checkedYear}`);

      setLoading(true);
      // if the given data were valid
      if (data) {
        setFetchedData(data);
        setLoading(false);
      } else {
        console.error('No country selected (Can mean that the fetchData returned an error)')
        setLoading(false);
      }
    }
    // immediatly calls himself
    fetchData();
  }, [clickedCountry, checkedYear]); // make it so the useEffect re-run only when one of those variable change (using Object.js comparison)

  // is called when a polygon is clicked in leafletMap
  const handleClickOnCountry = (countryName) => {
    setClickedCountry(countryName);
    setOpenModal(true);
  };

  return (<>
    <LeafletMap
      checkedValue={checkedYear}
      handleClickOnCountry={handleClickOnCountry}
    />

    <ModalShowArticle
      isOpen={openModal}
      onClose={modalIsClosed}
      children={fetchedData}
    />

    <div id="timeline">
      <Timeline 
        defaultYear={checkedYear}
        returnChecked={returnValue}
      />
    </div>

  </>);
};

export default SfReactMap;