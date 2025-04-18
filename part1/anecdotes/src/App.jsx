import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
 
   const number = anecdotes.length
  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(Array(number).fill(0))
  const randomNum = () => setSelected(Math.floor(Math.random() * number))
  const handleVotes = () => {
    const copy = [...vote]
    copy[selected] += 1
    setVote(copy)
  }
  const maxNumber = Math.max(...vote)
  const indexOfMax = vote.indexOf(maxNumber)
  console.log(vote)
  return (
    <div>
      {anecdotes[selected]}
      <button onClick={randomNum}>next anecdotesa</button>
      <button onClick={handleVotes}>vote</button>
      <h1>anecdotes with the most votes</h1>
      <p>{anecdotes[indexOfMax]}</p>
    </div>
  )
}
export default Appc