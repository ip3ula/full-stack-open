import { createSlice } from "@reduxjs/toolkit"
import anecdoteServices from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    doVote(state, action) {
      const id = action.payload
    const anecdoteToUpdate = state.find(a => a.id === id)
    const changedAnecdote = {...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1}
    return state.map(a => a.id === id ? changedAnecdote : a)
    },
    addNew(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteServices.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteServices.createNew(content)
    dispatch(addNew(newAnecdote))
  }
}

export const addVote = (id , updatedContent, updatedVotes
) => {
  return async dispatch => {
    const editedAnecdote = await anecdoteServices.update(id, updatedContent, updatedVotes)
    dispatch(doVote(editedAnecdote.id))
  }
}

export const { doVote, addNew, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer