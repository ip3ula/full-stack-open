import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route, Link, useParams } from 'react-router-dom'

const Blog = ({ blog, blogs, setBlogs, value
}) => {
  const [more, setMore] = useState(value || false)

  const queryClient = useQueryClient()

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  useEffect(() => {
    setMore(value)
  }, [value]) // Update 'more' when 'value' prop changes

  if (!blog) {
    return null
  }

  const updateLikes = async () => {
    try {
      if (!blog.id) {
        console.log('there is no an id')
      }
      updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }



  const removeBlog = async () => {
    if (window.confirm('Do you want to delete this blog')) {
      deleteBlogMutation.mutate(blog.id)
    }
  }

  return (
    <>
      <tr className="border-b-2 border-b-stone-600 hover:bg-teal-600 hover:text-white flex justify-between px-2">
        <td className="w-3/4 p-2">
          <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
        </td>
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
