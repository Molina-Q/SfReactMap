import React from "react";
import Gallery from "../gallery/Gallery";
import LinkBtn from "../UI/button/LinkBtn";

function ShowSection({ section }) {
  return (
    <article>
      <LinkBtn URI={`section/edit/${section.id}`} className={"delete-btn"}>
        Edit
      </LinkBtn>

      <h1>{section.title}</h1>

      <h2>{section.summary}</h2>

      <p>{section.text}</p>

      <section className="section-gallery-container">
        {<Gallery items={section.Equipments} className={"gallery-items"} />}
      </section>
    </article>
  );
}

export default ShowSection;
