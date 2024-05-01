import React from 'react'

export default function Alert({ props }) {
    const color = props.color;
    const style = props.className;
  return (
    <div className={`react-alert ${color} ${style}`}>
        {props.children}
    </div>
  )
}
