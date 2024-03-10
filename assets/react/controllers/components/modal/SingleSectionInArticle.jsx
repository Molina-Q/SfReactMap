import React from 'react'

function SingleSectionInArticle({section, showDetails}) {
  return (
    // key so that React can differentiate them
    <div key={section.id} className='section-items' >

      {/* the link created higher */}
      <h3 onClick={() => {showDetails(section.id)}}>{section.title}</h3>

      <p>{section.text}</p>

    </div>
  )
}

export default SingleSectionInArticle