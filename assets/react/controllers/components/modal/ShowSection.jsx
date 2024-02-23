import React from 'react'
import Gallery from '../gallery/Gallery'

function ShowSection({section}) {
  return (
    <article>
        <h1>{section.title}</h1>

        <h2>{section.summary}</h2> 

        <p>{section.text}</p> 

        <section className='section-gallery-container'>
            {<Gallery items={section.equipmentSections} />}
        </section>

    </article> 
  )
}

export default ShowSection