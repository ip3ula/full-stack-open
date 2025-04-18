import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: '',
  reducers: {
    loggedUser(state, action) {
      return action.payload
    }
  }
})

export const { loggedUser } = userSlice.actions

export const saveUser = (user) => {
  return dispatch => {
    dispatch(loggedUser(user))
  }
}

export default userSlice.reducer