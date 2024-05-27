import React from "react";
import SingleImg from "./SingleImg";

function Gallery({ items, className, clickEvent, isLink = false}) {
  return (
    <>
      {items.map((item) => (
        <SingleImg key={item.id} item={item} className={className} clickEvent={clickEvent} isLink={isLink} />
      ))}
    </>
  );
}

export default Gallery;
