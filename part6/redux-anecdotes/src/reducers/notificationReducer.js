import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: '',
    reducers: {
        showNotification(state, action) {
            return action.payload
        }
    }
})

export const setNotification = (content, time) => {
    return async dispatch => {
        dispatch(showNotification(content))
        setTimeout(() => dispatch(showNotification('')), time * 1000)
    } 
}

export const { showNotification } = notificationSlice.actions
export default notificationSlice.reducer