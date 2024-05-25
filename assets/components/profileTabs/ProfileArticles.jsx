import React from 'react'
import { Link } from 'react-router-dom'

export default function ProfileArticles() {
  return (
    <div>
      ProfileArticles

      <Link to='/article/create'>
        <button>Create an article</button>
      </Link>

      <Link to='/section/create'>
        <button>Create a Section</button>
      </Link>




    </div>
  )
}
