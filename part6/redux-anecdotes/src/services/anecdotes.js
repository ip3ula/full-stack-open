import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}
const createNew = async (content) => {
    const object = { content, votes: 0}
    const response = await axios.post(baseUrl, object)
    console.log(response.data)
    return response.data
}

const update = async (id, updatedContent, updatedVotes) => {
    const object = { 
      content: updatedContent,
      votes: updatedVotes + 1
    }
    const response = await axios.put(`${baseUrl}/${id}`, object)
    return response.data
}

export default { getAll, createNew, update }