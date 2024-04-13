import React from "react";

function DetailsItem() {
   return (
      <aside class="equip-description">
         <h2 id="equip-name">Click on an equipment to get it's details !</h2>
         <figure>
            <img src={image} alt="" />
            <figcaption class="weapon-details">
               <ul>
                  <li>Sharp</li>
                  <li>Blue?</li>
                  <li>Glow in the dark</li>
               </ul>
            </figcaption>
         </figure>

         <div>
            <p>
              {text}
            </p>
         </div>
      </aside>
   );
}

export default DetailsItem;
