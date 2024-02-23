import React, { useEffect, useState } from 'react';

import LeafletMap from './LeafletMap';
import Timeline from './timeline/Timeline';
import Modal from './modal/Modal';
import ShowArticle from './modal/ShowArticle';
import Loading from './animation/Loading';

import { fetchAnything } from "../../../tools/Fetchs";
import ShowSection from './modal/ShowSection';

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

  // array of elements the modal will show
  const [contentModal, setContentModal] = useState(null);

  // URI of the content of the modal
  const [dataURI, setDataURI] = useState(`/dataCountry/${clickedCountry}/${checkedYear}`);

  // used for loading during the fetch of the modal
  const [loading, setLoading] = useState(false);

  // const [error, setError] = useState(null);

  /***** Callback to ModalShowArticle *****/
  /****************************************/
  const modalIsClosed = () => {

    // Check if the modal is open then close it 
    (openModal ? setOpenModal(false) : '');
  }
  
  // onClick backArrow
  const backArrowHandler = () => {

    // change the URI of the fetch to return to the original data
    setDataURI(`/dataCountry/${clickedCountry}/${checkedYear}`);
  }

  const getDetailsSection = (id) => {

    // change the URI of the fetch to return to the original data
    setDataURI(`/dataCountry/section/${id}`);
  }
  
  /***** Callback to Timeline *****/
  /********************************/ 
  const returnValue = (stringYear) => {
    // change it to the currently checked year
    setCheckedYear(stringYear);

    // change the URI to match the checked year
    setDataURI(`/dataCountry/${clickedCountry}/${stringYear}`);
  }

  /***** Callback to LeafletMap *****/
  /**********************************/ 
  const handleClickOnCountry = (countryName) => {
    // change it to the clicked country
    setClickedCountry(countryName);

    // change the URI to match the clicked country
    setDataURI(`/dataCountry/${countryName}/${checkedYear}`);

    // open the modal
    setOpenModal(true);
  };

  useEffect(() => {
    
    // async function that fetch articles data for the country during the selected century from the MapController
    async function fetchData(URI = `/dataCountry/${clickedCountry}/${checkedYear}`) {
    // async function fetchData() {

      // await for data at the given URI (Uniform Resource Identifier)
      setLoading(true);

      console.log("-- Fetch - called --");

      // const data = await fetchAnything(`/dataCountry/${clickedCountry}/${checkedYear}`);
      const data = await fetchAnything(URI);

      console.log("-- Fetch - received --");

      // if the given data were valid
      if (data) {

        // set the content of data
        setLoading(false);
        setFetchedData(data);

      } else {

        // there was a mistake and the data is null
        setLoading(false);
        setFetchedData(null)
        console.error('No country selected (Can mean that the fetchData returned an error)');

      }
    }

    // immediatly calls himself
    fetchData(dataURI);
  
  }, [dataURI]); // will re-run only when one of those variables changes (using Object.js comparison)

  useEffect(() => {

    if (!fetchedData) {
      return setContentModal(<h2 className='article-none'>Sorry this country doesn't have an Article for this period.</h2>);
    }

    if (typeof fetchedData.section == 'undefined') {

      return setContentModal(<ShowArticle article={fetchedData.article} showDetails={getDetailsSection} />);

    } else {

      return setContentModal(<ShowSection section={fetchedData.section} />);

    }
    
  }, [fetchedData])

  return (<>
    <LeafletMap
      checkedValue={checkedYear}
      handleClickOnCountry={handleClickOnCountry}
    />

    <Modal
      isOpen={openModal}
      onClose={modalIsClosed}
      handleReturn={backArrowHandler}
    >
      {loading ? <Loading /> : ''}
      {/* {modalContent(fetchedData)} */}
      {contentModal}

    </Modal>

    <div id="timeline">
      <Timeline 
        defaultYear={checkedYear}
        returnChecked={returnValue}
      />
    </div>

  </>);
};

export default SfReactMap;