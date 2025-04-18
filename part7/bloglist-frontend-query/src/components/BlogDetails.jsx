import { useState } from 'react'

import { useParams } from 'react-router-dom'
import blogServices from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const BlogDetails = ({ blogs }) => {
  const [comment, setComment ] = useState('')
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)

  const queryClient = useQueryClient()

  const newCommentMutation = useMutation({
    mutationFn: blogServices.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const handleComments = (event) => {
    event.preventDefault()
    newCommentMutation.mutate({
      comment: comment,
      id: blog.id
    })
    setComment('')
  }

  return (
    <div className="p-4 border mt-4">
      <h2 className="text-xl font-bold">{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>Likes: {blog.likes}</p>
      <p>URL: <a href={blog.url} className="text-blue-500 underline">{blog.url}</a></p>
      <h2 className="text-2xl font-bold">Comments</h2>
      <form>
        <input value={comment} onChange={(event) => setComment(event.target.value)} className='border-1 rounded border-slate-300 focus:outline-0 focus:border-teal-700 py-1 px-3 my-3' placeholder='add comment '/> <button type="submit" className="bg-teal-600 text-white p-1 rounded" onClick={handleComments}>add comment</button>
      </form>
      <ol className="list-decimal marker:text-teal-700 mt-5 ml-5">
        {blog.comments.map(comment => {
          return(
            <li key={comment.id}>
              <p>{comment.comment}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default BlogDetails
