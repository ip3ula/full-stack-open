import { createContext, useReducer } from "react";

const NotificationReducer = (state, action) => {
    switch (action.type) {
        case 'notification':
            return action.payload
        default: 
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(NotificationReducer, "")

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider> 
    )
}

export default NotificationContext
