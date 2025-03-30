import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AncedoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ anecdotes, filter }) => {
      if (filter) {
        return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
      }
      return anecdotes
    })
    const sortedAnecdotes = [...anecdotes].sort((a,b) => b.votes - a.votes)

    const vote = (id, content, votes) => {
        dispatch(addVote(id, content, votes))
        dispatch((setNotification(`you voted "${content}"`, 5)))
      }

    return (
        <>
                {sortedAnecdotes.map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id, anecdote.content, anecdote.votes)}>vote</button>
              </div>
            </div>
          )}
        </>
    )
}

export default AncedoteList