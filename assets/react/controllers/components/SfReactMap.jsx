import React, { useEffect, useState } from 'react';

import LeafletMap from './LeafletMap';
import Timeline from './timeline/Timeline';
import ModalShowArticle from './modal/ModalShowArticle';
import Loading from './animation/Loading';

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

  // array of elements the modal will show
  const [contentModal, setContentModal] = useState(null);

  const [reloadFetch, setReloadFetch] = useState(false);

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

  const [dataURI, setDataURI] = useState(`/dataCountry/${clickedCountry}/${checkedYear}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // async function that fetch articles data for the country during the selected century from the MapController
    async function fetchData(URI = `/dataCountry/${clickedCountry}/${checkedYear}`) {

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
    fetchData();
  
  }, [clickedCountry, checkedYear]); // will re-run only when one of those variables changes (using Object.js comparison)

  // is called when a polygon is clicked in leafletMap
  const handleClickOnCountry = (countryName) => {
    setClickedCountry(countryName);
    setOpenModal(true);
  };

  // function used to loop on all important information of a section
  const showAllSections = (sectionsData) => {
    const sections = [];

    if (!sectionsData) {
      return ;
    }

    for(let section of sectionsData ) {
      // the uri to the section details
      let id_section = section.id;

      // push all the sections into a single array
      sections.push(

        // key so that React can diffentiate them
        <div className='section-items' key={id_section}>

          {/* the link created higher */}
          <h3 onClick={() => {showDetails(id_section)}}>{section.title}</h3>

          <p>{section.text}</p>

        </div>
      )
    }

    return sections;
  }

  // function used to loop on all important information of a section
  const showGallery = (galleryData) => {
    const sections = [];

    if (!galleryData) {
      return ;
    }

    for(let gallery of galleryData ) {

      let id_section = gallery.id;
      let pathImg = `/img/upload/${gallery.Equipment.imgObjects[0].Img.path}`;

      // push all the sections into a single array
      sections.push(

        // key so that React can diffentiate them
        <div className='section-gallery' key={id_section}>
          
          <figure className='gallery-items'>
            <img src={pathImg} alt={gallery.Equipment.name} />

            <figcaption>
              {gallery.Equipment.name}
            </figcaption>
          </figure>

          {/* <h3 onClick={() => {showDetails(id_section)}}>{section.title}</h3> */}

        </div>
      )
    }

    return sections;
  }
  

  // const modalContent = (data) => {

    useEffect(() => {

      if (!fetchedData) {
        return setContentModal(<h2 className='article-none'>Sorry this country doesn't have an Article for this period.</h2>);
      }

      if (typeof fetchedData.section == 'undefined') {

        const article = fetchedData.article;
        
        return setContentModal(<article>
            <h2>{article.Country.name} - {article.Century.year}</h2>
            <h1>{article.title}</h1> 
            <p>{article.summary}</p> 

            <section className='section-container'>
              {showAllSections(article.sections)}
            </section>

          </article> 
        );

      } else {

        const section = fetchedData.section;

        return setContentModal( <article>
            <h1>{section.title}</h1>

            <h2>{section.summary}</h2> 

            <p>{section.text}</p> 

            <section className='section-gallery-container'>
              {showGallery(section.equipmentSections)}
            </section>

          </article> 
        );
      }
 
     
    }, [fetchedData])
  
  // }

  // const handleModalClick = (id) => {
  //   showDetails(id);

  // }

  async function showDetails(id) {
    setLoading(true);
    setDataURI(`/dataCountry/section/${id}`);

    console.log("-- Section Fetch - sent --");

    const data = await fetchAnything(`/dataCountry/section/${id}`);

    console.log("-- Section Fetch - received --");

    // if the given data were valid
    if (data) {

      // set the content of data
      setLoading(false);
      return setFetchedData(data);

    } else {

      // there was a mistake and the data is null
      setLoading(false);
      console.error('No country selected (Can mean that the fetchData returned an error)');
      return setFetchedData(null);
    }
  }

  const backArrowHandler = () => {
    setDataURI(`/dataCountry/${clickedCountry}/${checkedYear}`);
  }

  return (<>
    <LeafletMap
      checkedValue={checkedYear}
      handleClickOnCountry={handleClickOnCountry}
    />

    <ModalShowArticle
      isOpen={openModal}
      onClose={modalIsClosed}
      handleReturn={backArrowHandler}
    >
      {loading ? <Loading /> : ''}
      {/* {modalContent(fetchedData)} */}
      {contentModal}

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