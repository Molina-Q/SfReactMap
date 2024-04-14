import React from "react";

function DetailsItem(props) {
  const imgUrl = `/img/upload/${props.img}`;
  return (
    <>
      <h2 id="equip-name">{props.name ? props.name : 'Click on an item !'}</h2>
      {props.img && props.text && props.name && (
        <>
          <figure>
            <img src={imgUrl} alt={props.name} />
          </figure>

          <div>
            <p>{props.text}</p>
          </div>
        </>
      )}
    </>
  );
}

export default DetailsItem;
