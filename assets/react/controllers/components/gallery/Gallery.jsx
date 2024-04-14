import React from "react";
import SingleImg from "./SingleImg";

function Gallery({ items, className, clickEvent }) {
  return (
    <>
      {items.map((item) => (
        <SingleImg key={item.id} item={item} className={className} url={`/api/equipment/${item.id}`} clickEvent={clickEvent} />
      ))}
    </>
  );
}

export default Gallery;
