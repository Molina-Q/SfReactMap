import React, { useRef, useEffect, useState, useMemo } from 'react';

import LeafletMap from './LeafletMap';
import Radio from './timeline/Timeline';
import ModalShowArticle from './modal/ModalShowArticle';

import { fetchAnything } from "../../../tools/Fetchs";

const SfReactMap = () => {

  // ce composant devient le composant principal, qui va se comporter comme un Controller
  // c'est sa responsabilité de gérer les states, de synchroniser le tout avec ses enfants qui peuvent avoir des interactions indirectes
  // un enfant peut faire remonter un changement
  // le parent (ce composant) sera notifié et changera le state (qu'il gère lui), puis si besoin fera redescendre l'info à l'enfant à notifier

  // current checked year in the timeline
  const [checkedYear, setCheckedYear] = useState('1900') ;

  // data fetched with the fetchData() function
  const [fetchedData, setFetchedData] = useState(null);

  // variable with state of dialog and open or setOpen
  const [openModal, setOpenModal] = useState(false)

  // the country that was clicked on
  const [clickedCountry, setClickedCountry] = useState('')

  /***** Callback Modal *****/
  /**************************/
  const ModalIsClosed = () => {
    if (openModal) {
      setOpenModal(false)
    }
  }
  
  /***** Callback Timeline *****/
  /*****************************/ 
  const ReturnValue = string => {
    setCheckedYear(string);
  }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // async function that fetch data from the MapController
  useEffect(() => {
    async function fetchData() {
      // await for data at the given URI (Uniform Resource Identifier)
      const data = await fetchAnything(`/dataCountry/${clickedCountry}`);


      // if the given data were valid
      if (data) {
        setFetchedData(data);
        setLoading(false);
      } else {
        console.error('No country selected')
        setLoading(false);
      }
    }
    // immediatly calls himself
    fetchData();
  }, [clickedCountry]); // make it so the useEffect re-run only when one of those variable change (using Object.js comparison)

  // is called when a polygon is clicked in leaflet.jsx
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
      hasCloseBtn={true}
      data={fetchedData}
      onClose={ModalIsClosed}
      children={fetchedData ? fetchedData : ''}
    />

    <div id="timeline">
      <Radio 
        defaultYear={checkedYear}
        returnChecked={ReturnValue}
      />
    </div>

  </>);
};

export default SfReactMap;