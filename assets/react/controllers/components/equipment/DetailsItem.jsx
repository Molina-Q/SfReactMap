import React from "react";

function DetailsItem(props) {
  return (
    <aside class="equip-description">
      <h2 id="equip-name">{props.name}</h2>
      <figure>
        <img src={props.image} alt="" />
        <figcaption class="weapon-details">
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
    </aside>
  );
}

export default DetailsItem;
