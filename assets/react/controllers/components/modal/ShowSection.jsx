import React from 'react'
import Gallery from '../gallery/Gallery'
import LinkBtnTwoParams from '../UI/button/LinkBtnTwoParams'

function ShowSection({section}) {
  return (
    <article>

      <LinkBtnTwoParams URI={`section/edit/${section.id}`} className={'delete-btn'}>
        Edit
      </LinkBtnTwoParams>

      <h1>{section.title}</h1>

      <h2>{section.summary}</h2> 

      <p>{section.text}</p> 

      <section className='section-gallery-container'>
        {<Gallery items={section.Equipments} />}
      </section>

    </article> 
  )
}

export default ShowSection