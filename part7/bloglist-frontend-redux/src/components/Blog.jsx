import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import { increaseLikes, removeBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'


const Blog = ({ blog, blogs, setBlogs, value
}) => {

  const dispatch = useDispatch()

  const updateLikes = async () => {
    try {
      if (!blog.id) {
        console.log('there is no an id')
      }
      const blogId = blog.id
      dispatch(increaseLikes(blogId))
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const [more, setMore] = useState(value || false)

  useEffect(() => {
    setMore(value)
  }, [value]) // Update 'more' when 'value' prop changes

  if (!blog) {
    return null
  }



  const handleRemove = async (id) => {
    if (window.confirm('Do you want to delete this blog')) {
      dispatch(removeBlog(id))
    }
  }

  return (
    <>
      <tr className="border-b-2 border-b-stone-600 hover:bg-teal-600 hover:text-white flex justify-between px-2">
        <td className="w-3/4 p-2">{blog.title}</td>
        <td className="w-1/4 p-2">
          <button data-testid='show' className="underline" onClick={() => setMore(!more)}>
            {more ? 'hide' : 'show'}
          </button>
          <button onClick={() => {
            handleRemove(blog.id)
            console.log(blog.id)
          }} className="underline text-red-600 ml-3">remove</button>
        </td>
      </tr>
      {more && (
        <div className="mx-4 p-2">
          <p>{blog.url}</p>
          <p>
            likes: {blog.likes}
            <button
              className="like bg-blue-500 text-white rounded px-1 ml-2"
              onClick={updateLikes}
            >
              like
            </button>
          </p>
          <p>{blog.author}</p>
        </div>
      )}
    </>
  )
}

export default Blog
