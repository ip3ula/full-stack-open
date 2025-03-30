import { useMutation, useQueryClient } from "@tanstack/react-query"
import { create } from "../requests"
import { useContext } from "react"
import NotificationContext from "../notificationContext"

const AnecdoteForm = () => {
  const [notification, dispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: create,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || []
      queryClient.setQueryData(['anecdotes'], [...anecdotes, newAnecdote])
    },
    onError: (error) => {
      dispatch({type: 'notification', payload: 'Anecdote must be at least 5 characters long.'})
      setTimeout(() => {
        dispatch({type: 'notification', payload: ''})
      }, 5000)
    }
  })


  
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    console.log('new anecdote created')

    newAnecdoteMutation.mutate({ content, votes: 0 })
    dispatch({type: 'notification', payload: `you added ${content}`})
    setTimeout(() => {
      dispatch({type: 'notification', payload: ''})
    }, 5000)
  }

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
