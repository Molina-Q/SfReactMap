import React from 'react'
import SingleSectionInArticle from './SingleSectionInArticle'

function ShowArticle({article, showDetails}) {
  return (
    <article>
        <h2>{article.Country.name} - {article.Century.year}</h2>

        <h1>{article.title}</h1> 

        <p>{article.summary}</p> 

        <section className='section-container'>
          
          {article.sections.map((section) => (
            <SingleSectionInArticle key={section.id} section={section} showDetails={showDetails} />
          ))}

        </section>

    </article> 
  )
}

export default ShowArticle