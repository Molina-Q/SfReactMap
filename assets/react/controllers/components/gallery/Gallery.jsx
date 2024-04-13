import React from "react";
import SingleImg from "./SingleImg";

function Gallery({ items }) {
  return (
    <>
      {items.map((item) => (
        <SingleImg key={item.id} item={item} />
      ))}
    </>
  );
}

export default Gallery;
