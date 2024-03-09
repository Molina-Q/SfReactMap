import React from 'react'
import SingleSectionInArticle from './SingleSectionInArticle'
import LinkBtnTwoParams from '../UI/button/LinkBtnTwoParams'

function ShowArticle({article, showDetails}) {
  const idArticle = parseInt(article.id);
  return (
    <article>
        <h2>{article.Country.name} - {article.Century.year}</h2>
        <LinkBtnTwoParams URI={`map/edit/article/${article.id}`}>
          Edit
        </LinkBtnTwoParams>

        <LinkBtnTwoParams URI={`map/delete/article/${article.id}`} className={'delete-btn'}>
          Delete
        </LinkBtnTwoParams>

        <h1>{article.title}</h1> 

        <p>{article.summary}</p> 

        <section className='section-container'>
          
          {article.sections.map((section) =>
            <SingleSectionInArticle key={section.id} section={section} showDetails={showDetails} />
          )}

        </section>

    </article> 
  )
}

export default ShowArticle