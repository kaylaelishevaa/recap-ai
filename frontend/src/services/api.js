import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 300000, // 5 min — long uploads + AI processing
})

export async function uploadFile(file, language = 'en', onProgress = null) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('language', language)
  const { data } = await api.post('/meetings/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  })
  return data
}

export async function submitTranscript(transcript, title = null, language = 'en') {
  const { data } = await api.post('/meetings/transcript', { transcript, title, language })
  return data
}

export async function listMeetings(page = 1, limit = 20, search = null, language = null) {
  const params = { page, limit }
  if (search) params.search = search
  if (language) params.language = language
  const { data } = await api.get('/meetings', { params })
  return data
}

export async function getMeeting(id) {
  const { data } = await api.get(`/meetings/${id}`)
  return data
}

export async function deleteMeeting(id) {
  const { data } = await api.delete(`/meetings/${id}`)
  return data
}

export async function exportMeeting(id) {
  const { data } = await api.post(`/meetings/${id}/export`)
  return data
}
