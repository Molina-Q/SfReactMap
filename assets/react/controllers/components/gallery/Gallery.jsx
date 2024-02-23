import React from 'react'
import SingleImg from './SingleImg';

function Gallery({items}) {
  return (
    <div className='section-gallery-container' >

        {items.map((item) => (
            <SingleImg key={item.id} item={item} />
        ))}

    </div>
  )
}

export default Gallery