import React from 'react'
import SingleSectionInArticle from './SingleSectionInArticle'
import LinkBtn from '../UI/button/LinkBtn'

function ShowArticle({article, showDetails}) {
 
  return (
    <article>
        <h2>{article.Country.name} - {article.Century.year}</h2>

        <LinkBtn URI={`map/edit/article/${article.id}`}>
          Edit
        </LinkBtn>

        <LinkBtn URI={`map/delete/article/${article.id}`}>
          Delete
        </LinkBtn>

        <h1>{article.title}</h1> 

        <p>{article.summary}</p> 

        <section className='section-container'>
          
          {article.sections.map((section) =>
            <SingleSectionInArticle key={section.id} section={section} showDetails={showDetails} />
          )}

        </section>

        <LinkBtn URI={`section/create/${article.id}`}>
          Add Section
        </LinkBtn>
    </article> 
  )
}

export default ShowArticle