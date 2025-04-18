import { useState } from 'react'




const BlogForm = ({ createNote }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createNote({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2 className="text-center my-5 font-bold text-2xl mb-10">create new</h2>
      <form onSubmit={addBlog} className="w-70 mx-auto flex flex-col gap-2">
        <div className="flex">
          <span className="w-1/4">title:</span>
          <input data-testid='title' className="title border-2 border-stone-600 rounded-md focus:border-teal-700 focus:outline-none px-2"
            type="text" name="title" value={title} onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="flex">
          <span className="w-1/4">author:</span>
          <input data-testid="author" className="author border-2 border-stone-600 rounded-md focus:border-teal-700 focus:outline-none px-2"
            type="text" name="author" value={author} onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div className="flex">
          <span className="w-1/4">url:</span>
          <input data-testid='url' className="url border-2 border-stone-600 rounded-md focus:border-teal-700 focus:outline-none px-2"
            type="text" name="url" value={url} onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button className="create hover:bg-teal-700 bg-teal-600 text-white w-70 py-1 rounded mt-20 font-medium mx-auto block text-center -mb-6" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm