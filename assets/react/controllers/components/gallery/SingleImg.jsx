import React from 'react'

function SingleImg({item}) {
    // path to the picture of the item
    const pathImg = `/img/upload/${item.Equipment.imgObjects[0].Img.path}`;

    return ( 
        <figure key={item.id} className='gallery-items' >
            <img src={pathImg} alt={item.Equipment.name} />

            <figcaption>
                <a href='/forum'>{item.Equipment.name}</a>
            </figcaption>
        </figure>
    )
}

export default SingleImg