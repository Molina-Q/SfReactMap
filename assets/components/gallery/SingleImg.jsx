import React from "react";

function SingleImg({ item, className, clickEvent }) {
  // path to the picture of the item
  const pathImg = `/img/upload/${item.img}`;

  return (
    <figure key={item.id} className={className} onClick={()=>clickEvent(item.id)}>
      <img src={pathImg} alt={item.name} />

      <figcaption>
        <a href={ item.url ? item.url : "/forum"}>{item.name}</a>
      </figcaption>
    </figure>
  );
}

export default SingleImg;
