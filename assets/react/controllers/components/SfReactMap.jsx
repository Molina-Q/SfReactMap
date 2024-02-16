import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    
    // async function that fetch articles data for the country during the selected century from the MapController
    async function fetchData() {

      // await for data at the given URI (Uniform Resource Identifier)
      setLoading(true);

      console.log("-- Fetch - called --");

      const data = await fetchAnything(`/dataCountry/${clickedCountry}/${checkedYear}`);

      console.log("-- Fetch - received --");

      // if the given data were valid
      if (data) {

        // set the content of data
        setFetchedData(data);
        setLoading(false);

      } else {

        // there was a mistake and the data is null
        setFetchedData(null)
        setLoading(false);
        console.error('No country selected (Can mean that the fetchData returned an error)')

      }
    }

    // immediatly calls himself
    fetchData();

  // will re-run only when one of those variables changes (using Object.js comparison)
  }, [clickedCountry, checkedYear]); 

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
    >
      {fetchedData ? (
        <>
            <h2>{fetchedData.article.Country.name} - {fetchedData.article.Century.year}</h2>
            <h1>{fetchedData.article.title}</h1> 
            <p>{fetchedData.article.summary}</p> 

            <h3>{fetchedData.article.sections.length !== 0 ? fetchedData.article.sections[0].title : "This article doesn't have any section"}</h3>
          <p>{fetchedData.article.sections.length !== 0  ? fetchedData.article.sections[0].text : "" }</p>
        </>
        )
      : (<h1>Sorry this country doesn't have an Article for this period.</h1>)} 

    </ModalShowArticle>

    <div id="timeline">
      <Timeline 
        defaultYear={checkedYear}
        returnChecked={returnValue}
      />
    </div>

  </>);
};

export default SfReactMap;