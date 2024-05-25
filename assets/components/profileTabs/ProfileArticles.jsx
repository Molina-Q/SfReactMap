import React from 'react'
import { Link } from 'react-router-dom'

export default function ProfileArticles() {
  return (
    <div>
      ProfileArticles

      <h2>ARTICLE</h2>
      <Link to='/article/create'>
        <button>Create an Article</button>
      </Link>
      <Link to='/article/edit/1'>
        <button>Edit an Article</button>
      </Link>

      <h2>SECTION</h2>
      <Link to='/section/create'>
        <button>Create a Section</button>
      </Link>
      <Link to='/section/edit/1'>
        <button>Edit a Section</button>
      </Link>




    </div>
  )
}
