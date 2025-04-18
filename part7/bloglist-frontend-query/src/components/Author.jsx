import { useParams } from 'react-router-dom'
import Blog from './Blog'
const Author = ( { blogs } ) => {
  const { author } = useParams()
  const authorBlog = blogs.filter(blog => blog.author === author)
  return (
    <div className='mt-10'>
      {authorBlog.map(blog => <Blog key={blog.id} blog={blog} /> )}
    </div>
  )
}

export default Author