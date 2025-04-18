import { useState, useEffect, useReducer } from 'react'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import BlogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import WhoLoggedIn from './components/WhoLoggedIn'
import BlogDetails from './components/BlogDetails'
import Author from './components/Author'
import BlogForm from './components/BlogForm'
import Togglable from './components/togglable'
import Notification from './components/Notification'
import Blogs from './components/Blogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const notificationReducer = (state, action) => {
    switch (action.type) {
    case 'SET':
      return action.payload
    case 'RESET':
      return null
    default:
      return state
    }
  }

  const userReducer = (state, action) => {
    switch (action.type) {
    case 'SET':
      return action.payload
    case 'RESET':
      return null
    default:
      return state
    }
  }

  const [notification, notificationDispatch] = useReducer(notificationReducer, '')
  const [user, userDispatch] = useReducer(userReducer, null)
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: BlogService.getAll,
  })

  const newBlogMutation = useMutation({
    mutationFn: BlogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET', payload: user })
      BlogService.setToken(user.token)
    }
  }, [])

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      BlogService.setToken(user.token)
      userDispatch({ type: 'SET', payload: user })
      setUsername('')
      setPassword('')
      notificationDispatch({ type: 'SET', payload: 'logged in' })
      setTimeout(() => {
        notificationDispatch({ type: 'RESET' })
      }, 5000)
      navigate('/')
    } catch (exception) {
      notificationDispatch({ type: 'SET', payload: 'wrong credentials' })
      setTimeout(() => {
        notificationDispatch({ type: 'RESET' })
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    newBlogMutation.mutate(blogObject)
    notificationDispatch({ type: 'SET', payload: 'you added a new blog' })
    setTimeout(() => {
      notificationDispatch({ type: 'RESET' })
    }, 5000)
  }

  if (result.isLoading) return <div>Loading blogs...</div>
  if (result.isError) return <div>Error loading blogs</div>

  const sortedItems = [...result.data].sort((a, b) => b.likes - a.likes)
  const authors = {}

  sortedItems.forEach(blog => {
    if (authors[blog.author]) {
      authors[blog.author] += 1
    } else {
      authors[blog.author] = 1
    }
  })

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'RESET' })
    navigate('/login')
  }

  const authorsList = Object.entries(authors)

  return (
    <div className='px-5'>
      <Notification notification={notification} />
      <div>
        {user && (
          <nav className='h-15 flex justify-between items-center font-mono'>
            <h1 className='text-teal-600 font-bold text-2xl'>My Blog</h1>
            <div className='flex gap-5'>
              <Link to="/">Blogs</Link>
              <Link to="/authors">Authors</Link>
              <Link to="/create">Create</Link>
              <Link to="/user">User</Link>
            </div>
          </nav>
        )}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            user ? <Blogs blogs={result.data} /> : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/authors"
          element={
            user ? (
              <div className="mt-4 space-y-2">
                {authorsList.map(([author, count]) => (
                  <div className="flex gap-4 *:cursor-pointer" key={author}>
                    <Link to={`/authors/${author}`}>{author}</Link>
                    <p>{count}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/create"
          element={user ? <BlogForm /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/user"
          element={user ? <WhoLoggedIn user={user} logout={handleLogout} /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate replace to="/" />
            ) : (
              <LoginForm
                handleLogin={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
              />
            )
          }
        />
        <Route path="/authors/:author" element={<Author blogs={result.data} />} />
        <Route path="/blog/:id" element={<BlogDetails blogs={result.data} />} />
      </Routes>
    </div>
  )
}

export default App
