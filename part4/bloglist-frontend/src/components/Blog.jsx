import { useState, useEffect } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, value, updateLikes = async () => {
  try {
    if (!blog.id) {
      console.log('there is no an id')
    }
    const blogId = blog.id
    console.log(blogId)
    const request = await blogService.update(blogId, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    })
    setBlogs(blogs.map(b => b.id === request.id ? { ...b, likes: request.likes } : b))
  } catch (error) {
    console.error('Error updating likes:', error)
  }
}
}) => {
  const [more, setMore] = useState(value || false)

  useEffect(() => {
    setMore(value)
  }, [value]) // Update 'more' when 'value' prop changes

  if (!blog) {
    return null
  }



  const removeBlog = async () => {
    if (window.confirm('Do you want to delete this blog')) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
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
          <button onClick={removeBlog} className="underline text-red-600 ml-3">remove</button>
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
