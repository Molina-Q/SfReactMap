import React from "react";

function SingleImg({ item }) {
  // path to the picture of the item
  const pathImg = `/img/upload/${item.img}`;

  return (
    <figure key={item.id} className={item.name}>
      <img src={pathImg} alt={item.name} />

      <figcaption>
        <a href="/forum">{item.name}</a>
      </figcaption>
    </figure>
  );
}

export default SingleImg;
