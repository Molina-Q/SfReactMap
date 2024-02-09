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

  const [checkedValue, setCheckedValue] = useState('1900') ;

  const [data, setData] = useState(null);


  // variable with state of dialog and open or setOpen
  const [openModal, setOpenModal] = useState(false)

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
    setCheckedValue(string);
  }

  // fetch data from a controller then set it
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchAnything('/dataCountry');

      if (data) {
        setData(data);
        setLoading(false);
      } else {
        // quelque chose s'est mal passé
      }
    }

    fetchData();
  }, [checkedValue]);

  const handleClickOnCountry = () => {
    setOpenModal(true);
  };

  return (<>
    <LeafletMap
      checkedValue={checkedValue}
      handleClickOnCountry={handleClickOnCountry}
    />

    <ModalShowArticle
        isOpen={openModal}
        hasCloseBtn={true}
        data={data}
        onClose={ModalIsClosed}
        children={data != null ? data : ''}
    />

    <div id="timeline">
        <Radio 
            defaultYear={checkedValue}
            returnChecked={ReturnValue}
        />
    </div>

  </>);
};

export default SfReactMap;