import React, { useEffect, useState } from "react";
import { fetchAnything } from "../../../../tools/Fetchs";
import Gallery from "../gallery/Gallery";
import Loading from "../UI/animation/Loading";
import EquipItems from "./EquipItems";
import DetailsItem from "./DetailsItem";

export default function Equipment() {
  // states for the gallery data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // states for the details page data
  const [clickedItem, setClickedItem] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  // trigger onClick of an img from the gallery
  const clickEvent = (id) => {
    setLoadingDetails(true);
    fetchData(`/equipment/api/${id}`, setClickedItem, setLoadingDetails);
  };

  async function fetchData(URI, dataState, loadingState) {
    console.log("-- Fetch - called --");
    const dataFetch = await fetchAnything(URI);
    console.log("-- Fetch - received --");

    if (dataFetch) {
      // set the content of given state data
      loadingState(false);
      dataState(dataFetch);
    } else {
      // there was a mistake and the data is null
      console.error("MANUAL ERRROR: Invalid data");
    }
  }

  useEffect(() => {
    if (clickedItem.equipment) {
      console.log("data clicked item = ", clickedItem.equipment.id);
    }
  });

  useEffect(() => {
    fetchData("/equipment/api", setData, setLoading);
  }, []); // will re-run only when one of those variables changes (using Object.js comparison)

  return (
    <article className="equip-menu">
      <article className="equip-gallery">
        {loading ? (
          <Loading />
        ) : (
          <Gallery
            items={data["equipment"]}
            className={"equip-items"}
            clickEvent={clickEvent}
          />
        )}
      </article>
      <aside className="equip-description">
        {clickedItem.equipment && (
          <DetailsItem
            name={clickedItem.equipment.name}
            img={clickedItem.equipment.img}
            text={clickedItem.equipment.text}
          />
        )}
      </aside>
    </article>
  );
}
