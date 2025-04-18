import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import { use } from 'react'
const store = configureStore({
  reducer: {
    blog: blogReducer,
    notification: notificationReducer,
    user: userReducer,
  },
})

export default store
