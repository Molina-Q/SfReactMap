import React, { useEffect, useState } from "react";
import { fetchAnything } from "../../../../tools/Fetchs";
import Gallery from "../gallery/Gallery";
import Loading from "../UI/animation/Loading";

function EquipItems() {
  const dataURI = "/equipment/api";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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


  return (
    <div>
      <section className="section-gallery-container">
        {loading ? <Loading /> : <Gallery items={data["equipment"]} />}
      </section>
    </div>
  );
}

export default EquipItems;
