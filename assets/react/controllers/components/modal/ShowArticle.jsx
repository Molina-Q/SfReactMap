import React from 'react'
import SingleSectionInArticle from './SingleSectionInArticle'
import LinkBtnTwoParams from '../UI/button/LinkBtnTwoParams'

function ShowArticle({article, showDetails}) {
 
  return (
    <article>
        <h2>{article.Country.name} - {article.Century.year}</h2>

        <LinkBtnTwoParams URI={`map/edit/article/${article.id}`}>
          Edit
        </LinkBtnTwoParams>

        <LinkBtnTwoParams URI={`map/delete/article/${article.id}`}>
          Delete
        </LinkBtnTwoParams>

        <h1>{article.title}</h1> 

        <p>{article.summary}</p> 

        <section className='section-container'>
          
          {article.sections.map((section) =>
            <SingleSectionInArticle key={section.id} section={section} showDetails={showDetails} />
          )}

        </section>

        <LinkBtnTwoParams URI={`section/create/${article.id}`}>
          Add Section
        </LinkBtnTwoParams>
    </article> 
  )
}

export default ShowArticle