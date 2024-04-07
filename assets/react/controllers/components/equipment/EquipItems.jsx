import React, { useEffect, useState } from "react";
import { fetchAnything } from "../../../../tools/Fetchs";
import SingleImg from "../gallery/SingleImg";
import Gallery from "../gallery/Gallery";
import Loading from "../UI/animation/Loading";

// interface Equipment {
//   id: number;
//   name: string;
//   text: string;
//   img: string;
// }

function EquipItems() {
  const dataURI = "/equipment/api";
  const equip = [];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(data);

  useEffect(() => {
    // async function that fetch articles data for the country during the selected century from the MapController
    // await for data at the given URI (Uniform Resource Identifier)
    async function fetchData(URI) {
      console.log("-- Fetch - called --");

      // const data = await fetchAnything(`/dataCountry/${clickedCountry}/${checkedYear}`);
      const dataFetch = await fetchAnything(URI);

      console.log("-- Fetch - received --");

      // if the given data were valid
      if (dataFetch) {
        // set the content of data
        setLoading(false);
        setData(dataFetch);
      } else {
        // there was a mistake and the data is null
        console.error("MANUAL ERRROR: Invalid data");
      }
    }
    // immediatly calls himself
    fetchData(dataURI);
  }, []); // will re-run only when one of those variables changes (using Object.js comparison)

  // data.map((equip) => (
  //   <SingleImg key={equip.id} item={equip} />
  // ))

  return (
    <div>
      <section className="section-gallery-container">
        {loading ? <Loading /> : <Gallery items={data["equipment"]} />}
      </section>
    </div>
  );
}

export default EquipItems;
