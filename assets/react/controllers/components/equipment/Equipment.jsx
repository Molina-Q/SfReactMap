import React, { useEffect, useLayoutEffect, useState } from "react";
import { fetchAnything } from "../../../../tools/Fetchs";
import Gallery from "../gallery/Gallery";
import Loading from "../UI/animation/Loading";
import EquipItems from "./EquipItems";
import DetailsItem from "./DetailsItem";

export default function Equipment() {
  // states for the gallery data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // category data
  const [categories, setCategories] = useState({});

  // states for the details page data
  const [clickedItem, setClickedItem] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  // state for the current selected category
  const [categoryType, setCategoryType] = useState(1);

  // trigger onClick of an img from the gallery
  const clickEvent = (id) => {
    setLoadingDetails(true);
    fetchData(`/api/equipment/${id}`, setClickedItem, setLoadingDetails);
  };

  async function fetchData(URI, dataState, loadingState) {
    console.log("-- Fetch - called --");
    const dataFetch = await fetchAnything(URI);
    console.log("-- Fetch - received --");

    if (dataFetch) {
      // set the content of given state data
      loadingState ? loadingState(false) : "";
      dataState(dataFetch);
    } else {
      // there was a mistake and the data is null
      console.error("MANUAL ERRROR: Invalid data");
    }
  }

  // test purpose useEffect
  useEffect(() => {
    if (clickedItem.equipment) {
      console.log("data clicked item = ", clickedItem.equipment.id);
    }
  });

  // call fetchData when page is loading then when category type is updated
  useEffect(() => {
    fetchData(`/api/equipment/type/${categoryType}`, setData, setLoading);
  }, [categoryType]); // will re-run only when one of those variables changes (using Object.js comparison)

  useLayoutEffect(() => {
    fetchData(`/api/equipment/types`, setCategories);
  }, []); // will re-run only when one of those variables changes (using Object.js comparison)

  const handleClick = (e) => {
    if (
      e.target.getAttribute("data-id") == 1 ||
      e.target.getAttribute("data-id") == 2 ||
      e.target.getAttribute("data-id") == 3
    ) {
      setCategoryType(e.target.getAttribute("data-id"));
    }
  };

  if(categories.categories) {
    console.log('data type = ',categories.categories);
  }

  return (
    <>
      {categories.categories &&
        categories.categories.map((catType) => (
          <strong
            key={catType.id}
            data-id={catType.id}
            onClick={handleClick}
            className={"cat-" + catType.label.toLowerCase()}
          >
            {catType.label}
          </strong>
        ))}
      {/* <strong onClick={handleClick} className="cat-weapon">
        Weapon
      </strong>
      <strong onClick={handleClick} className="cat-armour">
        Armour
      </strong>
      <strong onClick={handleClick} className="cat-tool">
        Tool
      </strong> */}

      <article className="equip-menu">
        <article className="equip-gallery">
          {loading ? (
            <Loading />
          ) : (
            <Gallery
              items={data["equipments"]}
              className={"equip-items"}
              clickEvent={clickEvent}
            />
          )}
        </article>
        <aside className="equip-description">
          {clickedItem.equipment ? (
            <DetailsItem
              name={clickedItem.equipment.name}
              img={clickedItem.equipment.img}
              text={clickedItem.equipment.text}
            />
          ) : (
            <DetailsItem />
          )}
        </aside>
      </article>
    </>
  );
}
