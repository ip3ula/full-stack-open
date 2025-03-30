import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
    const res = await axios.get(baseUrl)
    return res.data
}

export const create = async (content) => {
    const res = await axios.post(baseUrl, content)
    return res.data
}

export const update = async (content) => {
    console.log('content id',content.id)
    const res = await axios.put(`${baseUrl}/${content.id}`, content)
    return res.data
}