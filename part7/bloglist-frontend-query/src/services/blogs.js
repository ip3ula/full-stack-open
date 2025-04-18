import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const createComment = async comment => {
  const response = axios.post(`${baseUrl}/${comment.id}/comments`, comment)
  console.log('comment', comment)
  return response.data
}

const update = async (object) => {
  const request = await axios.put(`${baseUrl}/${object.id}`, object)
  return request.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.data
}

export default { getAll, create, setToken, update, remove, createComment }