import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    createNew(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    setLikes(state, action) {
      const id = action.payload
      const blogToChange = state.find(b => b.id === id)
      const changedBlog = { ...blogToChange, likes: blogToChange.likes + 1 }
      return state.map(b => b.id === id ? changedBlog : b)
    },
    deleteBlog(state, action) {
      const id = action.payload
      console.log(id)
      return state.filter(b => b.id !== id)
    }
  },
})

export const { setBlogs, createNew, setLikes, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const addNew = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    dispatch(createNew(newBlog))
  }
}

export const increaseLikes = (id) => {
  return async (dispatch, getState) => {
    const blog = getState().blog.find(b => b.id === id)

    if (!blog) return
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    await blogService.update(id, updatedBlog)
    dispatch(setLikes(id))
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(deleteBlog(id))
  }
}

export default blogSlice.reducer
