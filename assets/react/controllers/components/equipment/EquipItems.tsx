import React, { useEffect, useState } from 'react'
import { fetchAnything } from '../../../../tools/Fetchs';
import SingleImg from '../gallery/SingleImg';

interface Equipment {
  id: number;
  name: string;
  text: string;
  img: string;
}

function EquipItems() {
  const dataURI = '/equipment/api';
  const data = useFetch(dataURI);

  // for (const equip of data) (
  //   <SingleImg key={equip.id} item={equip} />
  // )

  return (<div>

    {data.map((equip) =>
      (<SingleImg key={equip.id} item={equip} />)
    )}
  </div>
  )
}

async function useFetch(URI: string) {
  const [data, setData] = useState(Array<Equipment>)
  useEffect(() => {
    // async function that fetch articles data for the country during the selected century from the MapController
    // await for data at the given URI (Uniform Resource Identifier)
    async function fetchData(URI: string) {

      console.log("-- Fetch - called --");

      // const data = await fetchAnything(`/dataCountry/${clickedCountry}/${checkedYear}`);
      const dataFetch: Array<Equipment> = await fetchAnything(URI);

      console.log("-- Fetch - received --");

      // if the given data were valid
      if (dataFetch) {
        // set the content of data
        return setData(dataFetch);
      } else {
        // there was a mistake and the data is null
        console.error("MANUAL ERRROR: Invalid data");
        return null;
      }
    }
    // immediatly calls himself
    fetchData(URI);
  }); // will re-run only when one of those variables changes (using Object.js comparison)
  return data;
}


export default EquipItems