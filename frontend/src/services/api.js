import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getUniversities = async () => {
  const response = await api.get('/universities/')
  return response.data
}

export const getUniversity = async (id) => {
  const response = await api.get(`/universities/${id}/`)
  return response.data
}

export const getPrograms = async () => {
  const response = await api.get('/programs/')
  return response.data
}

export const getFilterOptions = async () => {
  const response = await api.get('/filter-options/')
  return response.data
}

export default api

