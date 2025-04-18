import Blog from './Blog'

const Blogs = ({ blogs }) => {
  
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
  return(
    <div>
      <h1 className="font-bold text-3xl my-5">Welcome to my blog!</h1>
      <div className='pt-10'>
        {sortedBlogs.map(blog => {
          return (
            <Blog key={blog.id} blog={blog}/>
          )
        })}
      </div>
    </div>
  )
}

export default Blogs