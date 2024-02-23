import React from 'react'

function SingleImg({item}) {

    const pathImg = `/img/upload/${item.Equipment.imgObjects[0].Img.path}`;

    return (
        <div className='section-gallery' key={item.id}>
            
            <figure className='gallery-items'>
                <img src={pathImg} alt={item.Equipment.name} />

                <figcaption>
                    <a href='#'>{item.Equipment.name}</a>
                </figcaption>
            </figure>

        </div>
    )
}

export default SingleImg