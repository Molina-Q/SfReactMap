import React from "react";

function DetailsItem(props) {
  const imgUrl = `/img/upload/${props.img}`;
  return (
    <>
      <h2 id="equip-name">{props.name ?? 'Click on an item !'}</h2>
      {props.img && props.text && props.name && (
        <>
          <figure>
            <img src={imgUrl} alt={props.name} />
            <figcaption className="weapon-details">
              <ul>
                <li>Sharp</li>
                <li>Blue?</li>
                <li>Glow in the dark</li>
              </ul>
            </figcaption>
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
