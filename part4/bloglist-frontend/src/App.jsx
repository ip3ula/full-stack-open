import { useState, useEffect } from 'react'
import loginService from './services/login'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Togglable from './components/togglable'
import BlogForm from './components/Blog_form'
const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return (
    <form data-testid="login-form" onSubmit={handleLogin} className="flex flex-col gap-2 justify-center items-center">
      <h2 className="text-center font-bold text-2xl my-6 mb-10">log in to application</h2>
      <div className="flex gap-2">
        username
        <input  data-testid='username' className="border-2 border-stone-600 rounded-md focus:border-teal-700 focus:outline-none px-2"
          type="text" value={username} onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div className="flex gap-2">
        password
        <input data-testid='password' className="border-2 border-stone-600 rounded-md focus:border-teal-700 focus:outline-none px-2"
          type="password" value={password} onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" className="hover:bg-teal-700 bg-teal-600 text-white w-70 py-1 rounded my-40 font-medium">login</button>
    </form>
  )
}

const WhoLoggedIn = ({ user, setUser }) => {
  return (
    <div>
      <p className="text-center text-sm font-bold">{user.name} logged in</p>

    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      console.log('user', user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('login successful')
      setTimeout(() => {
        setMessage(null)
      }, 5000
      )
    } catch (exception) {
      console.error('wrong credentials')
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000
      )
    }
  }

  const addBlog = async (noteObject) => {
    const newBlog = await blogService.create(noteObject)
    setBlogs(blogs.concat(newBlog))

    setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 5000
    )
  }
  const sortedItems = [...blogs].sort((a,b) => b.likes - a.likes)

  return (
    <div>

      <div className="bg-indigo-700 text-4xl text-white w-full">{message !== null && <div>{message}</div>}</div>
      <div className="border-b-2 border-b-stone-600 text-3xl  w-full p-1 flex justify-between px-4 items-center">
        <h1 className="font-bold">blog app</h1>
        <div className="flex gap-2 items-center">
          {user !== null && <WhoLoggedIn user={user} setUser={setUser} />}
          {user !== null && <button className="py-1 bg-teal-600 hover:bg-teal-700 text-xl px-6 rounded-3xl text-white font-medium
        " onClick={() => {
            window.localStorage.removeItem('loggedBlogappUser')
            setUser(null)
          }
          }>
          logout
          </
            button>}
        </div>
      </div>
      {user === null
        ? <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
        : <div>

          <Togglable buttonLabel="new blog">
            <BlogForm createNote={addBlog}/>
          </Togglable>
          <table className="w-full">

            <tbody data-testid="blogs">
              {sortedItems.map(blog =>
                <Blog key={blog.id} blog={blog} setBlogs={setBlogs} blogs={blogs} />
              )}
            </tbody>
          </table>

        </div>
      }
    </div>
  )
}

export default App