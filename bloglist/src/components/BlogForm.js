import React, { useState } from 'react'
import PropTypes from 'prop-types'


const BlogForm = ({ createBlog, setAddFormIsShown }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')


  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  return (
    <div className='form-box'>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog} >
        <div className='form-input'>
          <input
            type='text'
            value={newTitle}
            name='title'
            id='title'
            placeholder='Title'
            onChange={handleTitleChange}
          />
          <label htmlFor='title'>Title</label>
        </div>
        <div className='form-input'>
          <input
            type='text'
            value={newAuthor}
            name='author'
            id='author'
            placeholder='Author'
            onChange={handleAuthorChange}
          />
          <label htmlFor='author'>Author</label>
        </div>
        <div className='form-input'>
          <input
            type='text'
            value={newUrl}
            name='url'
            id='url'
            placeholder='Url'
            onChange={handleUrlChange}
          />
          <label htmlFor='url'>Url</label>
        </div>
        <div className='form-button-container'>
          <button type='submit' className='form-button'>CREATE</button>
          <button
            type='button'
            className='form-button'
            onClick={() => setAddFormIsShown(false)}
          >CANCEL</button>
        </div>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  setAddFormIsShown: PropTypes.func.isRequired
}

export default BlogForm
