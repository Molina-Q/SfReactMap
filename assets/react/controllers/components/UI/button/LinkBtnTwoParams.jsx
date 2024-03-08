import React from 'react'

function LinkBtnTwoParams(props) {

  return (
    <a href={props.URI}>
      <button>
        {props.children}
      </button>
    </a>
  )
}

export default LinkBtnTwoParams