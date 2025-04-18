import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
  },
})

export const setNotification = (content, time) => {
  return (dispatch) => {
    dispatch(showNotification(content))
    setTimeout(() => dispatch(showNotification('')), 1000 * time)
  }
}

export const { showNotification } = notificationSlice.actions
export default notificationSlice.reducer
