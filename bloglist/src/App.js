import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [infoMessage, setInfoMessage] = useState(null)
  const [error, setError] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [addFormIsShown, setAddFormIsShown] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs))
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setError(true)
      setInfoMessage('❗️ Wrong credentials ❗️')
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <div className='form-box'>
      <h2>LOGIN</h2>
      <form onSubmit={handleLogin}>
        <div className='form-input'>
          <input
            type='text'
            name='username'
            id='username'
            placeholder='Username'
            value={username}
            onChange={({ target }) => setUsername(target.value)} />
          <label htmlFor='username'>Username</label>
        </div>
        <div className='form-input'>
          <input
            type='password'
            name='password'
            id='password'
            placeholder='Password'
            value={password}
            onChange={({ target }) => setPassword(target.value)} />
          <label htmlFor='password'>Password</label>
        </div>
        <button type='submit' id="login-button" className='form-button'>LOGIN</button>
      </form>
    </div>
  )

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setError(false)
        setInfoMessage(`✅ The new blog "${blogObject.title}" by ${blogObject.author} was added ✅`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
        setAddFormIsShown(false)
      })
  }

  const updateBlog = (blogObject) => {
    blogService
      .update(blogObject.id, blogObject)
      .then(() => {
        const newBlogs = blogs.map((blog) => {
          if (blog.id === blogObject.id) return blogObject
          return blog
        })
        setBlogs(newBlogs)
      })
  }

  const deleteBlog = (id) => {
    blogService
      .deleteOne(id)
      .then(() => {
        const newBlogs = blogs.filter((blog) => blog.id !== id)
        setBlogs(newBlogs)
      })
  }

  return (
    <div>
      <Notification message={infoMessage} error={error} />

      {user === null
        ? loginForm()
        : (
          <>
            <div className='header'>
              <h2>Blogs</h2>
              <p>{user.name} is logged in <button id='logout-button' onClick={handleLogout}>logout</button></p>
            </div>
            {addFormIsShown === true
              ? <BlogForm createBlog={addBlog} setAddFormIsShown={setAddFormIsShown} />
              : (
                <div>
                  <button
                    className='create-toggle-button'
                    onClick={() => setAddFormIsShown(true)}>Create a new blog</button>
                  {blogs.sort((a, b) => a.likes - b.likes).map(blog =>
                    <Blog
                      key={blog.id}
                      blog={blog}
                      updateBlog={updateBlog}
                      deleteBlog={deleteBlog}
                      loggedInUser={user} />
                  )}
                </div>)
            }
          </>
        )}
    </div>
  )
}

export default App
