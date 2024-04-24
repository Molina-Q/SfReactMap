import React from 'react'

function LinkBtn(props) {

  return (
    <a href={props.URI}>
      <button>
        {props.children}
      </button>
    </a>
  )
}

export default LinkBtn